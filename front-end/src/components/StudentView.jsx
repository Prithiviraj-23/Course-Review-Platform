import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  Flex,
  Icon,
  Badge,
  Container,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaBookOpen } from "react-icons/fa";
import CourseCard from "./CourseCard";
import ReviewModal from "./ReviewModal";

const StudentView = ({ userReviews, loading, fetchUserContent }) => {
  const navigate = useNavigate();
  const [reviewCourseId, setReviewCourseId] = useState(null);

  // Extract courses from reviews - safely handle potential undefined values
  const reviewedCourses = Array.isArray(userReviews)
    ? userReviews
        .map((review) => ({
          ...review.course,
          _id: review.course?._id,
          averageRating: review.rating,
          review: review,
        }))
        .filter((course) => course._id)
    : [];

  const handleAddReview = (courseId) => {
    setReviewCourseId(courseId);
  };

  // Theme colors
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Container maxW="container.xl" p={4}>
      {/* Section Header */}
      <Box
        bg={headerBg}
        p={4}
        borderRadius="lg"
        mb={6}
        shadow="sm"
      >
        <Flex
          justify="space-between"
          align="center"
          wrap={{ base: "wrap", md: "nowrap" }}
          gap={2}
        >
          <Flex align="center">
            <Icon as={FaStar} mr={2} color="blue.500" boxSize={5} />
            <Heading as="h3" size="md">
              My Course Reviews
            </Heading>
            <Badge ml={2} colorScheme="blue" borderRadius="full" px={2}>
              {reviewedCourses.length}
            </Badge>
          </Flex>
          
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<Icon as={FaBookOpen} />}
            onClick={() => navigate("/dashboard")}
          >
            Browse All Courses
          </Button>
        </Flex>
      </Box>

      {loading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[1, 2, 3].map((i) => (
            <Skeleton 
              key={i} 
              height="320px" 
              borderRadius="lg"
              startColor={useColorModeValue("gray.50", "gray.700")}
              endColor={useColorModeValue("gray.200", "gray.600")}
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
              isInstructorView={false}
              isOwnCourse={false}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box 
          p={8} 
          textAlign="center" 
          borderWidth="1px" 
          borderRadius="lg"
          bg={emptyStateBg}
          shadow="sm"
        >
          <VStack spacing={4}>
            <Icon as={FaStar} boxSize={10} color="blue.400" />
            <Heading size="md">No Reviews Yet</Heading>
            <Text fontSize="md">You haven't reviewed any courses yet. Start by browsing available courses.</Text>
            <Button
              mt={2}
              colorScheme="blue"
              onClick={() => navigate("/dashboard")}
              size="md"
              leftIcon={<Icon as={FaBookOpen} />}
            >
              Browse Courses to Review
            </Button>
          </VStack>
        </Box>
      )}

      {/* Review Modal */}
      {reviewCourseId && (
        <ReviewModal
          isOpen={!!reviewCourseId}
          onClose={() => setReviewCourseId(null)}
          courseId={reviewCourseId}
          refreshCourseData={fetchUserContent}
        />
      )}
    </Container>
  );
};

export default StudentView;