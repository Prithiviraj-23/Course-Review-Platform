import React, { useState } from "react";
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
  Divider,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChartBar, FaBook, FaStar, FaEye } from "react-icons/fa";
import CourseCard from "./CourseCard";
import ReviewModal from "./ReviewModal";
import CourseAnalytics from "./CourseAnalytics";
import PostModal from "./PostModal";

// Component definitions moved outside of InstructorView
const SectionHeader = ({
  title,
  count,
  action,
  actionLabel,
  icon,
  headerBg,
}) => (
  <Box bg={headerBg} p={4} borderRadius="lg" mb={6} shadow="sm">
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
          colorScheme="blue"
          leftIcon={<Icon as={FaPlus} />}
          onClick={action}
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </Flex>
  </Box>
);

const EmptyState = ({
  message,
  buttonText,
  buttonAction,
  icon,
  emptyStateBg,
}) => (
  <Box
    p={8}
    textAlign="center"
    borderWidth="1px"
    borderRadius="lg"
    bg={emptyStateBg}
    shadow="sm"
  >
    <Icon as={icon} boxSize={10} mb={4} color="blue.400" />
    <Text fontSize="lg" mb={4}>
      {message}
    </Text>
    <Button mt={2} colorScheme="blue" onClick={buttonAction} size="md">
      {buttonText}
    </Button>
  </Box>
);

const InstructorView = ({
  userCourses,
  userReviews,
  courseAnalytics,
  loading,
  fetchUserContent,
}) => {
  const navigate = useNavigate();
  const [reviewCourseId, setReviewCourseId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Safely handle potentially undefined arrays
  const courses = Array.isArray(userCourses) ? userCourses : [];
  const reviews = Array.isArray(userReviews) ? userReviews : [];

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

  // IMPORTANT: Move ALL color mode hooks to the top level
  // Theme colors
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  const tabListBg = useColorModeValue("gray.100", "gray.700");
  const tabSelectedBg = useColorModeValue("blue.100", "blue.800");
  const tabSelectedColor = useColorModeValue("blue.800", "blue.100");
  const analyticsHeaderBg = useColorModeValue("gray.50", "gray.700");
  const skeletonStartColor = useColorModeValue("gray.50", "gray.700");
  const skeletonEndColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Container maxW="container.xl" p={0}>
      <Tabs colorScheme="blue" variant="soft-rounded" size="md" isFitted mt={2}>
        <TabList
          mb={4}
          bg={tabListBg} // Use pre-defined value instead of inline hook
          p={1}
          borderRadius="lg"
        >
          <Tab
            _selected={{ bg: tabSelectedBg, color: tabSelectedColor }} // Use pre-defined values
            borderRadius="md"
          >
            <Flex align="center">
              <Icon as={FaBook} mr={2} />
              <Text>My Courses</Text>
            </Flex>
          </Tab>
          <Tab
            _selected={{ bg: tabSelectedBg, color: tabSelectedColor }} // Use pre-defined values
            borderRadius="md"
          >
            <Flex align="center">
              <Icon as={FaStar} mr={2} />
              <Text>My Reviews</Text>
            </Flex>
          </Tab>
          <Tab
            _selected={{ bg: tabSelectedBg, color: tabSelectedColor }} // Use pre-defined values
            borderRadius="md"
          >
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

            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    height="320px"
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
                    onAddReview={handleManageCourse}
                    isInstructorView={true}
                    isOwnCourse={true}
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
              count={reviewedCourses.length}
              icon={FaStar}
              headerBg={headerBg}
            />

            {loading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    height="320px"
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
                    onAddReview={handleAddReview}
                    isInstructorView={true}
                    isOwnCourse={false}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <EmptyState
                message="You haven't reviewed any courses yet."
                buttonText="Browse Courses to Review"
                buttonAction={() => navigate("/dashboard")}
                icon={FaStar}
                emptyStateBg={emptyStateBg}
              />
            )}
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel p={0}>
            <SectionHeader
              title="Course Analytics"
              count={courses.length}
              icon={FaChartBar}
              headerBg={headerBg}
            />

            {loading ? (
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
                {courses.map((course) => (
                  <Box key={course._id}>
                    <Flex
                      justify="space-between"
                      align="center"
                      mb={3}
                      bg={analyticsHeaderBg} // Use pre-defined value
                      p={3}
                      borderRadius="md"
                    >
                      <Flex align="center">
                        <Heading as="h4" size="md">
                          {course.title}
                        </Heading>
                        <Badge ml={2} colorScheme="green">
                          {course.averageRating?.toFixed(1) || "No ratings"}
                        </Badge>
                      </Flex>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => navigate(`/course/${course._id}`)}
                        leftIcon={<Icon as={FaEye} />}
                      >
                        View Course
                      </Button>
                    </Flex>
                    <CourseAnalytics
                      analytics={courseAnalytics && courseAnalytics[course._id]}
                      reviews={course.reviews}
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

        {/* IMPORTANT: Always render modals but control visibility with isOpen prop */}
        <ReviewModal
          isOpen={!!reviewCourseId}
          onClose={() => setReviewCourseId(null)}
          courseId={reviewCourseId || ""} // Provide fallback empty string
          refreshCourseData={fetchUserContent}
        />

        <PostModal
          isOpen={isCreateOpen}
          onClose={handleCloseCreateModal}
          refreshCourseData={fetchUserContent}
        />
      </Tabs>
    </Container>
  );
};

export default InstructorView;
