import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Skeleton,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

// Import your components
import ProfileHeader from "../components/ProfileHeader";
import AccountDetails from "../components/AccountDetails";
import StudentView from "../components/StudentView";
import InstructorView from "../components/InstructorView";
import EditProfileModal from "../components/EditProfileModel";

const Profile = () => {
  // Get all hooks first - this ensures consistent hook order
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const bgColor = useColorModeValue("white", "gray.700"); // Move this hook to the top level

  // All state hooks
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [userCourses, setUserCourses] = useState([]);

  // New state for storing course stats
  const [courseStats, setCourseStats] = useState({});
  const [statsLoading, setStatsLoading] = useState({});
  const [allStatsLoaded, setAllStatsLoaded] = useState(false);

  // Loading states
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Track which data has been loaded
  const [dataLoaded, setDataLoaded] = useState({
    courses: false,
    reviews: false,
    analytics: false,
  });

  // Function to fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/getuser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data.user);
      return response.data.user;
    } catch (err) {
      setError("Failed to fetch user data");
      toast({
        title: "Error",
        description: "Failed to load profile data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  // Function to fetch user reviews - called only when reviews tab is selected
  const fetchUserReviews = useCallback(async () => {
    if (dataLoaded.reviews) return; // Skip if already loaded

    setLoadingReviews(true);
    try {
      const reviewsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reviews/user-reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserReviews(reviewsResponse.data || []);
      setDataLoaded((prev) => ({ ...prev, reviews: true }));
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      if (error?.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Failed to load reviews",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setUserReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [token, toast, dataLoaded.reviews]);

  // UPDATED: Function to fetch instructor courses with force reload option
  const fetchInstructorCourses = useCallback(
    async (forceReload = false) => {
      if (dataLoaded.courses && !forceReload) return; // Skip if already loaded and not forcing reload

      setLoadingCourses(true);
      try {
        console.log("Fetching instructor courses...");
        const coursesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/courses/instructor-courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Instructor courses loaded:", coursesResponse.data?.length);
        setUserCourses(coursesResponse.data || []);
        setDataLoaded((prev) => ({ ...prev, courses: true }));
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
        if (error?.response?.status !== 404) {
          toast({
            title: "Error",
            description: "Failed to load courses",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        setUserCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    },
    [token, toast, dataLoaded.courses]
  );

  // Function to fetch analytics data for a single course
  const fetchCourseStats = useCallback(
    async (courseId) => {
      if (!courseId) return;

      try {
        // Mark this specific course stats as loading
        setStatsLoading((prev) => ({ ...prev, [courseId]: true }));

        // Make the API call to get stats
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reviews/course/${courseId}/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Store the stats
        setCourseStats((prev) => ({
          ...prev,
          [courseId]: response.data,
        }));
      } catch (error) {
        console.error(`Error fetching stats for course ${courseId}:`, error);
        // On error, store null for this course's stats
        setCourseStats((prev) => ({
          ...prev,
          [courseId]: null,
        }));

        if (error?.response?.status !== 404) {
          toast({
            title: "Error",
            description: `Could not load analytics for ${courseId}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        setStatsLoading((prev) => ({ ...prev, [courseId]: false }));
      }
    },
    [token, toast]
  );

  // Function to fetch analytics
  const fetchCourseAnalytics = useCallback(async () => {
    // Move the courses fetch outside of the conditional to maintain hook order
    if (!dataLoaded.courses) {
      await fetchInstructorCourses();
      // If we just loaded the courses, we'll continue with analytics
    } else if (dataLoaded.analytics) {
      // Skip if analytics already loaded
      return;
    }

    setAllStatsLoaded(true); // Prevent duplicate calls

    // Start loading for all courses
    const loadingState = {};
    userCourses.forEach((course) => {
      loadingState[course._id] = true;
    });
    setStatsLoading(loadingState);

    // Fetch stats for each course
    for (const course of userCourses) {
      await fetchCourseStats(course._id);
    }

    setDataLoaded((prev) => ({ ...prev, analytics: true }));
  }, [userCourses, dataLoaded, fetchInstructorCourses, fetchCourseStats]);

  const handleEditProfile = (updatedData) => {
    setUserData((prev) => ({ ...prev, ...updatedData }));
  };

  // Reset data loaded state after profile update or other major changes
  const resetDataLoadedState = useCallback(() => {
    setDataLoaded({
      courses: false,
      reviews: false,
      analytics: false,
    });
    setAllStatsLoaded(false);
  }, []);

  // UPDATED: Combined initial data loading effect
  useEffect(() => {
    async function loadInitialData() {
      if (token) {
        try {
          setLoading(true);
          // Fetch user data first
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/getuser`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const user = response.data.user;
          setUserData(user);

          // If user is an instructor, immediately load their courses
          if (user?.role === "instructor") {
            console.log("User is instructor, loading courses immediately");
            setLoadingCourses(true);
            try {
              const coursesResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/courses/instructor-courses`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setUserCourses(coursesResponse.data || []);
              setDataLoaded((prev) => ({ ...prev, courses: true }));
              console.log(
                "Initial courses loaded:",
                coursesResponse.data?.length
              );
            } catch (courseError) {
              console.error("Error fetching initial courses:", courseError);
              setUserCourses([]);
            } finally {
              setLoadingCourses(false);
            }
          }
        } catch (err) {
          setError("Failed to fetch user data");
          toast({
            title: "Error",
            description: "Failed to load profile data",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      } else {
        setError("Authentication token not found");
        setLoading(false);
      }
    }

    loadInitialData();
  }, [token, toast]);

  // Handler for tab changes in InstructorView or StudentView
  const handleTabChange = useCallback(
    (tabIndex) => {
      if (userData?.role === "instructor") {
        // For instructor role
        switch (tabIndex) {
          case 0: // My Courses tab
            fetchInstructorCourses();
            break;
          case 1: // My Reviews tab
            fetchUserReviews();
            break;
          case 2: // Analytics tab
            fetchCourseAnalytics();
            break;
          default:
            break;
        }
      } else {
        // For student role - typically just reviews
        if (tabIndex === 0) {
          fetchUserReviews();
        }
      }
    },
    [userData, fetchInstructorCourses, fetchUserReviews, fetchCourseAnalytics]
  );

  // Refresh all data
  const refreshData = useCallback(() => {
    resetDataLoadedState();
    if (userData?.role === "instructor") {
      fetchInstructorCourses(true); // Force reload
      fetchUserReviews();
      fetchCourseAnalytics();
    } else {
      fetchUserReviews();
    }
  }, [
    userData,
    fetchInstructorCourses,
    fetchUserReviews,
    fetchCourseAnalytics,
    resetDataLoadedState,
  ]);

  // Calculate loading state for analytics
  const isLoadingAnalytics = Object.keys(statsLoading).some(
    (id) => statsLoading[id]
  );

  if (loading && !userData) {
    return (
      <Container maxW="container.lg" py={10}>
        <VStack spacing={8}>
          <Skeleton height="200px" width="100%" />
          <Skeleton height="20px" width="80%" />
          <Skeleton height="20px" width="60%" />
          <Skeleton height="100px" width="100%" />
        </VStack>
      </Container>
    );
  }

  if (error && !userData) {
    return (
      <Container maxW="container.lg" py={10}>
        <Box textAlign="center" py={10} px={6}>
          <Heading as="h2" size="xl" color="red.500">
            Error Loading Profile
          </Heading>
          <Text mt={4}>{error}</Text>
          <Button
            mt={6}
            colorScheme="blue"
            onClick={() => navigate("/dashboard")}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      {/* User Profile Section */}
      <ProfileHeader
        userData={userData}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {/* Account Details Section */}
      <Box bg={bgColor} boxShadow="xl" rounded="lg" p={6} mb={8}>
        <AccountDetails userData={userData} />
      </Box>

      {/* Course and Review Sections */}
      <Box mt={10}>
        {userData?.role === "instructor" ? (
          <InstructorView
            userCourses={userCourses}
            userReviews={userReviews}
            loading={{
              courses: loadingCourses,
              reviews: loadingReviews,
              analytics: isLoadingAnalytics,
            }}
            onTabChange={handleTabChange}
            fetchUserContent={refreshData}
            // New props for passing course stats
            courseStats={courseStats}
            statsLoading={statsLoading}
            allStatsLoaded={allStatsLoaded}
          />
        ) : (
          <StudentView
            userReviews={userReviews}
            loading={loadingReviews}
            onTabChange={handleTabChange}
            fetchUserContent={refreshData}
          />
        )}
      </Box>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userData={userData}
          onSave={handleEditProfile}
        />
      )}
    </Container>
  );
};

export default Profile;
