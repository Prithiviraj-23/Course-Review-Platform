import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
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

  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        My Course Reviews
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
              isInstructorView={false}
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

      {/* Use your existing ReviewModal component */}
      {reviewCourseId && (
        <ReviewModal
          isOpen={!!reviewCourseId}
          onClose={() => setReviewCourseId(null)}
          courseId={reviewCourseId}
          refreshCourseData={fetchUserContent}
        />
      )}
    </>
  );
};

export default StudentView;
