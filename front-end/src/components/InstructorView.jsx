import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  VStack,
  Icon,
  Badge,
  useColorModeValue,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaPlus,
  FaChartBar,
  FaBook,
  FaStar,
  FaEye,
  FaSmile,
  FaMeh,
  FaFrown,
  FaCommentAlt,
  FaSync,
} from "react-icons/fa";
import CourseCard from "./CourseCard";
import ReviewModal from "./ReviewModal";
import CourseAnalytics from "./CourseAnalytics";
import PostModal from "./PostModal";

// Add missing Section Header Component
const SectionHeader = ({
  title,
  count,
  action,
  actionLabel,
  icon,
  headerBg,
}) => {
  const bgColor = useColorModeValue("blue.50", "blue.900");

  return (
    <Box bg={headerBg || bgColor} p={4} borderRadius="lg" mb={6} shadow="sm">
      <Flex
        justify="space-between"
        align="center"
        wrap={{ base: "wrap", md: "nowrap" }}
        gap={2}
      >
        <Flex align="center">
          <Icon as={icon} mr={2} color="blue.500" boxSize={5} />
          <Heading as="h3" size="md">
            {title}
          </Heading>
          {count !== undefined && (
            <Badge ml={2} colorScheme="blue" borderRadius="full" px={2}>
              {count}
            </Badge>
          )}
        </Flex>

        {action && (
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            size="sm"
            onClick={action}
          >
            {actionLabel}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

// Add missing EmptyState Component
const EmptyState = ({
  message,
  buttonText,
  buttonAction,
  icon,
  emptyStateBg,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      p={8}
      textAlign="center"
      borderWidth="1px"
      borderRadius="lg"
      bg={emptyStateBg || bgColor}
      shadow="sm"
    >
      <Icon as={icon} boxSize={12} color="blue.500" mb={4} />
      <Heading as="h3" size="md" mb={4}>
        {message}
      </Heading>
      {buttonText && buttonAction && (
        <Button colorScheme="blue" leftIcon={<FaPlus />} onClick={buttonAction}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

// Updated Analytics Summary Component to use stats data
const AnalyticsSummary = ({ courses, courseStats }) => {
  const statBg = useColorModeValue("blue.50", "blue.900");

  // Calculate overall stats
  const totalCourses = courses.length;
  let totalReviews = 0;
  let totalPositiveReviews = 0;
  let totalNegativeReviews = 0;
  let overallRating = 0;
  let reviewsWithRating = 0;
  let overallSentiment = 0;

  // Process stats data for all courses
  Object.values(courseStats || {}).forEach((stats) => {
    if (stats) {
      totalReviews += stats.totalReviews || 0;

      // Get positive and negative from sentiment object
      totalPositiveReviews += stats.sentiment?.positive || 0;
      totalNegativeReviews += stats.sentiment?.negative || 0;

      if (stats.averageRating) {
        overallRating += stats.averageRating;
        reviewsWithRating++;
      }

      // Calculate overall sentiment (simple heuristic if not provided directly)
      const positive = stats.sentiment?.positive || 0;
      const negative = stats.sentiment?.negative || 0;
      const total = stats.totalReviews || 0;
      if (total > 0) {
        overallSentiment += (positive - negative) / total;
      }
    }
  });

  // Calculate averages
  const avgRating =
    reviewsWithRating > 0
      ? (overallRating / reviewsWithRating).toFixed(1)
      : "N/A";
  const avgSentiment =
    reviewsWithRating > 0
      ? (overallSentiment / reviewsWithRating).toFixed(1)
      : "N/A";
  const positivePercent =
    totalReviews > 0
      ? ((totalPositiveReviews / totalReviews) * 100).toFixed(1)
      : "0";
  const negativePercent =
    totalReviews > 0
      ? ((totalNegativeReviews / totalReviews) * 100).toFixed(1)
      : "0";

  return (
    <Box mb={6}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        {/* Stats display remains the same */}
        <Stat
          bg={statBg}
          p={3}
          borderRadius="md"
          shadow="sm"
          textAlign="center"
        >
          <StatLabel>Overall Rating</StatLabel>
          <Flex justify="center" align="center">
            <StatNumber>{avgRating}</StatNumber>
            {avgRating !== "N/A" && <Icon as={FaStar} ml={1} color="gold" />}
          </Flex>
          <StatHelpText>{totalReviews} total reviews</StatHelpText>
        </Stat>

        <Stat
          bg={statBg}
          p={3}
          borderRadius="md"
          shadow="sm"
          textAlign="center"
        >
          <StatLabel>Overall Sentiment</StatLabel>
          <Flex justify="center" align="center">
            <StatNumber>
              {avgSentiment !== "N/A" ? (
                avgSentiment > 0 ? (
                  <Icon as={FaSmile} color="green.500" />
                ) : avgSentiment < 0 ? (
                  <Icon as={FaFrown} color="red.500" />
                ) : (
                  <Icon as={FaMeh} color="gray.500" />
                )
              ) : (
                "N/A"
              )}
            </StatNumber>
          </Flex>
          <StatHelpText>
            {avgSentiment !== "N/A" ? avgSentiment : "No data"}
          </StatHelpText>
        </Stat>

        <Stat
          bg={statBg}
          p={3}
          borderRadius="md"
          shadow="sm"
          textAlign="center"
        >
          <StatLabel>Positive Reviews</StatLabel>
          <StatNumber>{totalPositiveReviews}</StatNumber>
          <StatHelpText>{positivePercent}% of total</StatHelpText>
        </Stat>

        <Stat
          bg={statBg}
          p={3}
          borderRadius="md"
          shadow="sm"
          textAlign="center"
        >
          <StatLabel>Negative Reviews</StatLabel>
          <StatNumber>{totalNegativeReviews}</StatNumber>
          <StatHelpText>{negativePercent}% of total</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

const InstructorView = ({
  userCourses,
  userReviews,
  loading,
  onTabChange,
  fetchUserContent,
  // Add new props for passing course stats
  courseStats: propsCourseStats,
  statsLoading: propsStatsLoading,
  allStatsLoaded: propsAllStatsLoaded,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useSelector((state) => state.auth);

  // Define theme colors
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  const analyticsHeaderBg = useColorModeValue("teal.50", "teal.900");
  const skeletonStartColor = useColorModeValue("gray.100", "gray.800");
  const skeletonEndColor = useColorModeValue("gray.300", "gray.600");

  const [reviewCourseId, setReviewCourseId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Local state for course stats when not provided through props
  const [courseStatsLocal, setCourseStatsLocal] = useState({});
  const [statsLoadingLocal, setStatsLoadingLocal] = useState({});
  const [allStatsLoadedLocal, setAllStatsLoadedLocal] = useState(false);

  // Use either props or local state
  const courseStatsToUse = propsCourseStats || courseStatsLocal;
  const statsLoadingToUse = propsStatsLoading || statsLoadingLocal;
  const allStatsLoadedToUse =
    propsAllStatsLoaded !== undefined
      ? propsAllStatsLoaded
      : allStatsLoadedLocal;

  // Set state setters based on whether props are provided
  const setCourseStats = propsCourseStats ? () => {} : setCourseStatsLocal;
  const setStatsLoading = propsStatsLoading ? () => {} : setStatsLoadingLocal;
  const setAllStatsLoaded =
    propsAllStatsLoaded !== undefined ? () => {} : setAllStatsLoadedLocal;

  // Safely handle potentially undefined arrays
  const courses = Array.isArray(userCourses) ? userCourses : [];
  const reviews = Array.isArray(userReviews) ? userReviews : [];

  // Function to fetch analytics data for a course
  const fetchCourseStats = async (courseId) => {
    if (!courseId || propsCourseStats) return; // Skip if we're using props

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
      
      console.log(`Stats loaded for course ${courseId}:`, response.data);
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
  };

  // UPDATED: Function to fetch all courses stats
  const fetchAllCoursesStats = async () => {
    if (propsCourseStats || courses.length === 0) return;
    
    console.log("Fetching analytics data for all courses");
    
    // Start loading for all courses
    const loadingState = {};
    courses.forEach((course) => {
      loadingState[course._id] = true;
    });
    setStatsLoading(loadingState);

    // Fetch stats for each course
    for (const course of courses) {
      await fetchCourseStats(course._id);
    }
    
    // Force a re-render after all data is loaded
    setCourseStats(prev => ({...prev}));
    setAllStatsLoaded(true);
  };

  // Fetch stats for all courses when the analytics tab is active - UPDATED
  useEffect(() => {
    if (activeTab === 2 && courses.length > 0 && !allStatsLoadedToUse && !propsCourseStats) {
      fetchAllCoursesStats();
    }
  }, [activeTab, courses.length, allStatsLoadedToUse, propsCourseStats]);

  // Reset stats loaded state when courses change
  useEffect(() => {
    if (courses.length === 0 && !propsCourseStats) {
      setAllStatsLoaded(false);
    }
  }, [courses, propsCourseStats]);

  // Extract courses from reviews
  const reviewedCourses = reviews
    .map((review) => ({
      ...review.course,
      _id: review.course?._id,
      averageRating: review.rating,
      review: review,
    }))
    .filter((course) => course._id);

  const handleAddReview = (courseId) => {
    setReviewCourseId(courseId);
  };

  const handleManageCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleOpenCreateModal = () => setIsCreateOpen(true);
  const handleCloseCreateModal = () => setIsCreateOpen(false);

  // UPDATED: Handle tab changes and trigger data loading as needed
  const handleTabChange = (index) => {
    setActiveTab(index);
    
    // Immediate data fetch when selecting analytics tab
    if (index === 2) {
      // Force analytics to load immediately if we're switching to analytics tab
      if (!propsCourseStats && (!allStatsLoadedToUse || Object.keys(courseStatsToUse).length === 0)) {
        console.log("Tab changed to Analytics - loading stats immediately");
        
        // Use setTimeout to ensure UI updates first
        setTimeout(() => {
          fetchAllCoursesStats();
        }, 0);
      }
    }
    
    // Notify parent component
    if (onTabChange) {
      onTabChange(index);
    }

    // Reset allStatsLoaded when changing away from analytics tab
    if (index !== 2 && !propsCourseStats) {
      setAllStatsLoaded(false);
    }
  };

  // Load state determination
  const isLoadingCourses = loading?.courses || loading === true || false;
  const isLoadingReviews = loading?.reviews || loading === true || false;
  const isLoadingAnalytics =
    loading?.analytics ||
    (activeTab === 2 &&
      courses.length > 0 &&
      Object.keys(statsLoadingToUse).some((id) => statsLoadingToUse[id]));
      
  // Check if stats are missing for any course  
  const hasMissingStats = courses.some(course => 
    !courseStatsToUse[course._id] && !statsLoadingToUse[course._id]
  );

  return (
    <Container maxW="container.xl" p={0}>
      <Tabs
        colorScheme="blue"
        variant="soft-rounded"
        size="md"
        isFitted
        mt={2}
        index={activeTab}
        onChange={handleTabChange}
      >
        <TabList mb={4}>
          <Tab>
            <Flex align="center">
              <Icon as={FaBook} mr={2} />
              <Text>My Courses</Text>
            </Flex>
          </Tab>
          <Tab>
            <Flex align="center">
              <Icon as={FaCommentAlt} mr={2} />
              <Text>My Reviews</Text>
            </Flex>
          </Tab>
          <Tab>
            <Flex align="center">
              <Icon as={FaChartBar} mr={2} />
              <Text>Analytics</Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels>
          {/* My Courses Tab */}
          <TabPanel p={0}>
            <SectionHeader
              title="My Courses"
              count={courses.length}
              action={handleOpenCreateModal}
              actionLabel="Create Course"
              icon={FaBook}
              headerBg={headerBg}
            />

            {isLoadingCourses ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    height="300px"
                    borderRadius="lg"
                    startColor={skeletonStartColor}
                    endColor={skeletonEndColor}
                  />
                ))}
              </SimpleGrid>
            ) : courses.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onManage={() => handleManageCourse(course._id)}
                    showManageButton={true}
                    isInstructorView={true}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <EmptyState
                message="You haven't created any courses yet."
                buttonText="Create Your First Course"
                buttonAction={handleOpenCreateModal}
                icon={FaBook}
                emptyStateBg={emptyStateBg}
              />
            )}
          </TabPanel>

          {/* My Reviews Tab */}
          <TabPanel p={0}>
            <SectionHeader
              title="My Reviews"
              count={reviews.length}
              icon={FaCommentAlt}
              headerBg={headerBg}
            />

            {isLoadingReviews ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    height="300px"
                    borderRadius="lg"
                    startColor={skeletonStartColor}
                    endColor={skeletonEndColor}
                  />
                ))}
              </SimpleGrid>
            ) : reviewedCourses.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {reviewedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    userReview={course.review}
                    showReviewButton={false}
                    onReview={() => handleAddReview(course._id)}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <EmptyState
                message="You haven't reviewed any courses yet."
                icon={FaCommentAlt}
                emptyStateBg={emptyStateBg}
              />
            )}
          </TabPanel>

          {/* Analytics Tab - UPDATED */}
          <TabPanel p={0}>
            <Flex justify="space-between" align="center" mb={4}>
              <SectionHeader
                title="Course Analytics"
                count={courses.length}
                icon={FaChartBar}
                headerBg={headerBg}
              />
              
              {activeTab === 2 && hasMissingStats && !isLoadingAnalytics && (
                <Button 
                  leftIcon={<FaSync />} 
                  colorScheme="blue" 
                  size="sm"
                  ml={4}
                  onClick={fetchAllCoursesStats}
                >
                  Refresh Analytics
                </Button>
              )}
            </Flex>

            {isLoadingAnalytics ? (
              <VStack spacing={6}>
                <Skeleton
                  height="400px"
                  width="100%"
                  borderRadius="lg"
                  startColor={skeletonStartColor}
                  endColor={skeletonEndColor}
                />
                <Skeleton
                  height="400px"
                  width="100%"
                  borderRadius="lg"
                  startColor={skeletonStartColor}
                  endColor={skeletonEndColor}
                />
              </VStack>
            ) : courses.length > 0 ? (
              <VStack spacing={8} align="stretch">
                {/* Debug information in development mode
                {process.env.NODE_ENV === 'development' && (
                  <Box p={3} bg="yellow.100" color="black" borderRadius="md" fontSize="sm">
                    <Text fontWeight="bold">Debug Info:</Text>
                    <Text>Stats loaded: {allStatsLoadedToUse ? 'Yes' : 'No'}</Text>
                    <Text>Courses with stats: {Object.keys(courseStatsToUse).length}</Text>
                    <Text>Total courses: {courses.length}</Text>
                  </Box>
                )}
                 */}
                {/* Updated Analytics Summary Component */}
                <AnalyticsSummary
                  courses={courses}
                  courseStats={courseStatsToUse}
                />

                {courses.map((course) => (
                  <Box key={course._id}>
                    <Flex
                      justify="space-between"
                      align="center"
                      mb={3}
                      bg={analyticsHeaderBg}
                      p={3}
                      borderRadius="md"
                    >
                      <Flex align="center">
                        <Heading as="h4" size="md">
                          {course.title}
                        </Heading>
                        <HStack ml={2} spacing={2}>
                          <Badge colorScheme="green">
                            {course.averageRating?.toFixed(1) || "No ratings"}
                          </Badge>
                        </HStack>
                      </Flex>
                      <HStack>
                        {!courseStatsToUse[course._id] && !statsLoadingToUse[course._id] && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => fetchCourseStats(course._id)}
                          >
                            Load Analytics
                          </Button>
                        )}
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => navigate(`/course/${course._id}`)}
                          leftIcon={<Icon as={FaEye} />}
                        >
                          View Course
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Updated CourseAnalytics component */}
                    <CourseAnalytics
                      course={course}
                      stats={courseStatsToUse[course._id]}
                      isLoading={statsLoadingToUse[course._id]}
                    />
                  </Box>
                ))}
              </VStack>
            ) : (
              <EmptyState
                message="Create courses to see analytics data."
                buttonText="Create Your First Course"
                buttonAction={handleOpenCreateModal}
                icon={FaChartBar}
                emptyStateBg={emptyStateBg}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Review Modal */}
      {reviewCourseId && (
        <ReviewModal
          isOpen={!!reviewCourseId}
          onClose={() => setReviewCourseId(null)}
          courseId={reviewCourseId}
          onReviewSubmit={() => {
            setReviewCourseId(null);
            if (fetchUserContent) fetchUserContent();
          }}
        />
      )}

      {/* Create Course Modal */}
      {isCreateOpen && (
        <PostModal
          isOpen={isCreateOpen}
          onClose={handleCloseCreateModal}
          onSubmitSuccess={() => {
            handleCloseCreateModal();
            if (fetchUserContent) fetchUserContent();
          }}
        />
      )}
    </Container>
  );
};

export default InstructorView;