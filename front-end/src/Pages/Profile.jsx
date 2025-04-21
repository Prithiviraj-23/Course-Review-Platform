import React, { useState, useEffect } from "react";
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
import EditProfileModal from "../components/EditProfileModel"

const Profile = () => {
  // Get all hooks first - this ensures consistent hook order
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // All state hooks
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [courseAnalytics, setCourseAnalytics] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Process reviews to generate analytics - define outside useEffect
  const processReviewAnalytics = (reviews, course) => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        positiveReviews: 0,
        negativeReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        averageRating: 0,
        topPositiveKeywords: [],
        topNegativeKeywords: [],
      };
    }

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach((review) => {
      const rating = review.rating;
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      totalRating += rating;
    });

    const averageRating = totalRating / totalReviews;
    const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
    const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

    // Simple keyword extraction
    const keywords = {
      positive: ["excellent", "great", "helpful", "clear", "engaging"],
      negative: ["difficult", "confusing", "boring", "hard", "unclear"],
    };

    const extractKeywords = (type) => {
      const counts = {};
      reviews.forEach((review) => {
        if (review.comment) {
          const comment = review.comment.toLowerCase();
          keywords[type].forEach((keyword) => {
            if (comment.includes(keyword)) {
              counts[keyword] = (counts[keyword] || 0) + 1;
            }
          });
        }
      });

      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry) => entry[0]);
    };

    return {
      totalReviews,
      positiveReviews,
      negativeReviews,
      ratingDistribution,
      averageRating,
      topPositiveKeywords: extractKeywords("positive"),
      topNegativeKeywords: extractKeywords("negative"),
    };
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/auth/getuser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data.user);
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
  };

  // Function to fetch courses and reviews - fix API endpoint
  const fetchUserContent = async () => {
    if (!userData) return;

    setLoadingCourses(true);
    try {
      // Try API endpoint for reviews - adjust based on your actual API
      const reviewsResponse = await axios.get(
        // Fix the API endpoint - check your backend for the correct path
        "http://localhost:5000/api/reviews/user-reviews", // or "reviews/by-user" or whatever endpoint your API uses
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserReviews(reviewsResponse.data || []);

      // If user is an instructor, fetch their courses
      if (userData?.role === "instructor") {
        const coursesResponse = await axios.get(
          "http://localhost:5000/api/courses/instructor-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserCourses(coursesResponse.data || []);

        // For each course, fetch its reviews to build analytics
        const analytics = {};
        for (const course of coursesResponse.data) {
          try {
            const courseReviews = await axios.get(
              `http://localhost:5000/api/reviews/course/${course._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            analytics[course._id] = processReviewAnalytics(
              courseReviews.data,
              course
            );
          } catch (error) {
            console.error(
              `Error fetching reviews for course ${course._id}:`,
              error
            );
          }
        }
        setCourseAnalytics(analytics);
      }
    } catch (error) {
      console.error("Error in fetchUserContent:", error);
      // Don't show toast for 404 errors repeatedly - it creates a bad UX
      if (error?.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Failed to load courses and reviews",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      // Handle empty data gracefully
      setUserReviews([]);
      if (userData?.role === "instructor") {
        setUserCourses([]);
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleEditProfile = (updatedData) => {
    setUserData((prev) => ({ ...prev, ...updatedData }));
  };

  // Use useEffect hooks after all states and functions are defined
  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setError("Authentication token not found");
      setLoading(false);
    }
  }, [token]); // Remove toast dependency to prevent re-renders

  // Separate effect to fetch user content once user data is available
  useEffect(() => {
    if (userData && token) {
      fetchUserContent();
    }
  }, [userData, token]); // Remove dependencies that could change between renders

  if (loading) {
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

  if (error) {
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
      <Box
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="xl"
        rounded="lg"
        p={6}
        mb={8}
      >
        <AccountDetails userData={userData} />
      </Box>

      {/* Course and Review Sections */}
      <Box mt={10}>
        {userData?.role === "instructor" ? (
          <InstructorView
            userCourses={userCourses}
            userReviews={userReviews}
            courseAnalytics={courseAnalytics}
            loading={loadingCourses}
            fetchUserContent={fetchUserContent}
          />
        ) : (
          <StudentView
            userReviews={userReviews}
            loading={loadingCourses}
            fetchUserContent={fetchUserContent}
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
