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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import ReviewModal from "./ReviewModal";
import CourseAnalytics from "./CourseAnalytics";
import PostModal from "./PostModal"; // Import PostModal component

const InstructorView = ({
  userCourses,
  userReviews,
  courseAnalytics,
  loading,
  fetchUserContent,
}) => {
  const navigate = useNavigate();
  const [reviewCourseId, setReviewCourseId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false); // State for PostModal

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

  // Handlers for PostModal
  const handleOpenCreateModal = () => setIsCreateOpen(true);
  const handleCloseCreateModal = () => setIsCreateOpen(false);

  return (
    <Tabs colorScheme="blue" variant="enclosed">
      <TabList>
        <Tab>My Courses</Tab>
        <Tab>My Reviews</Tab>
        <Tab>Analytics</Tab>
      </TabList>
      <TabPanels>
        {/* My Courses Tab */}
        <TabPanel>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h3" size="md">
              My Courses
            </Heading>
            <Button
              colorScheme="blue"
              leftIcon={<span>+</span>}
              onClick={handleOpenCreateModal}
            >
              Create Course
            </Button>
          </Flex>

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="300px" />
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
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
              <Text>You haven't created any courses yet.</Text>
              <Button mt={4} colorScheme="blue" onClick={handleOpenCreateModal}>
                Create Your First Course
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* My Reviews Tab */}
        <TabPanel>
          <Heading as="h3" size="md" mb={4}>
            My Reviews
          </Heading>
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="300px" />
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
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
              <Text>You haven't reviewed any courses yet.</Text>
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => navigate("/dashboard")}
              >
                Browse Courses to Review
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel>
          <Heading as="h3" size="md" mb={4}>
            Course Analytics
          </Heading>
          {loading ? (
            <Skeleton height="400px" />
          ) : courses.length > 0 ? (
            <VStack spacing={8} align="stretch">
              {courses.map((course) => (
                <Box key={course._id}>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Heading as="h4" size="md">
                      {course.title}
                    </Heading>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      View Course
                    </Button>
                  </Flex>
                  <CourseAnalytics
                    analytics={courseAnalytics && courseAnalytics[course._id]}
                  />
                </Box>
              ))}
            </VStack>
          ) : (
            <Box p={6} textAlign="center" borderWidth="1px" borderRadius="lg">
              <Text>Create courses to see analytics data.</Text>
              <Button mt={4} colorScheme="blue" onClick={handleOpenCreateModal}>
                Create Your First Course
              </Button>
            </Box>
          )}
        </TabPanel>
      </TabPanels>

      {/* Use your existing ReviewModal component */}
      {reviewCourseId && (
        <ReviewModal
          isOpen={!!reviewCourseId}
          onClose={() => setReviewCourseId(null)}
          courseId={reviewCourseId}
          refreshCourseData={fetchUserContent}
        />
      )}

      {/* Add PostModal component for creating courses */}
      <PostModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreateModal}
        refreshCourseData={fetchUserContent}
      />
    </Tabs>
  );
};

export default InstructorView;
