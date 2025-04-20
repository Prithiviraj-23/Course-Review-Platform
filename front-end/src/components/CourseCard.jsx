import { Box, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onAddReview, isInstructorView, onDelete }) => {
  const navigate = useNavigate();
  const toast = useToast(); // ✅ Toast hook

  const handleCardClick = () => {
    navigate(`/course/${course._id}`);
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
    onAddReview(course._id);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();

    try {
      await onDelete(course._id); // Assuming onDelete returns a promise
      toast({
        title: "Course deleted",
        description: `"${course.title}" has been removed.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting course",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

      {isInstructorView ? (
        <Button
          mt="2"
          colorScheme="red"
          width="full"
          onClick={handleDeleteClick}
        >
          Delete Course
        </Button>
      ) : (
        <>
          <Text fontSize="xs" color="gray.500" mb="1">
            Click below to add or update your review
          </Text>
          <Button
            mt="1"
            colorScheme="teal"
            width="full"
            onClick={handleReviewClick}
          >
            Review
          </Button>
        </>
      )}
    </Box>
  );
};

export default CourseCard;
