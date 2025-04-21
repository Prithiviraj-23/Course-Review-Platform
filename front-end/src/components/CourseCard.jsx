import { Box, Text, Button, Badge, Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onAddReview, isInstructorView, isOwnCourse }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/course/${course._id}`);
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
    onAddReview(course._id);
  };

  return (
    <Box
      p="5"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="md"
      _hover={{ cursor: "pointer", boxShadow: "lg" }}
      onClick={handleCardClick}
    >
      <Flex mb="2">
        {isOwnCourse && <Badge colorScheme="purple">Your Course</Badge>}
        {isInstructorView && !isOwnCourse && (
          <Badge colorScheme="blue">Instructor Review Available</Badge>
        )}
        <Spacer />
      </Flex>

      {course.imageUrl ? (
        <Box mb="3">
          <img
            src={course.imageUrl}
            alt={course.title}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
      ) : (
        <Box
          mb="3"
          width="100%"
          height="160px"
          bgGradient="linear(to-r, teal.100, blue.100)"
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.600">
            No Image Available
          </Text>
        </Box>
      )}

      <Text fontSize="xl" fontWeight="bold" mb="1">
        {course.title}
      </Text>

      <Text fontSize="sm" color="gray.600" mb="1">
        Instructor: <strong>{course.instructor?.name || "N/A"}</strong>
      </Text>

      <Text fontSize="sm" color="gray.600" mb="1">
        Rating:{" "}
        {course.averageRating > 0 ? (
          <>
            {"⭐".repeat(Math.round(course.averageRating))}
            <span> ({course.averageRating.toFixed(1)})</span>
          </>
        ) : (
          "No ratings yet"
        )}
      </Text>

      <Text fontSize="sm" color="gray.600">
        Dept: <strong>{course.department?.trim()}</strong>
      </Text>
      <Text fontSize="sm" color="gray.600" mb="2">
        Difficulty: <strong>{course.difficulty?.trim()}</strong>
      </Text>

      {course.tags?.length > 0 && (
        <Box mt="2" mb="3" display="flex" flexWrap="wrap" gap="2">
          {course.tags.map((tag, idx) => (
            <Box
              key={idx}
              px="2"
              py="1"
              fontSize="xs"
              bg="blue.50"
              borderRadius="md"
              color="blue.700"
              whiteSpace="nowrap"
            >
              {tag.trim()}
            </Box>
          ))}
        </Box>
      )}

      {/* Review button section */}
      <>
        <Text fontSize="xs" color="gray.500" mb="1">
          {isOwnCourse
            ? "You can manage and review your own course"
            : isInstructorView
            ? "As an instructor, you can review this course"
            : "Click below to add or update your review"}
        </Text>
        <Button
          mt="1"
          colorScheme={
            isOwnCourse ? "purple" : isInstructorView ? "blue" : "teal"
          }
          width="full"
          onClick={handleReviewClick}
        >
          {isOwnCourse ? "Manage Course" : "Review Course"}
        </Button>
      </>
    </Box>
  );
};

export default CourseCard;
