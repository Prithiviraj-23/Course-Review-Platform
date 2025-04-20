import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onAddReview }) => {
  const navigate = useNavigate();

  // Navigate to course detail page when card is clicked
  const handleCardClick = () => {
    navigate(`/course/${course._id}`);
  };

  // Prevent card click when Review button is clicked
  const handleReviewClick = (e) => {
    e.stopPropagation(); // Prevent the card click event from firing
    onAddReview(course._id); // Call the existing review function
  };

  return (
    <Box
      p="5"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      boxShadow="md"
      _hover={{ cursor: "pointer", boxShadow: "lg" }}
      onClick={handleCardClick} // Make the card clickable
    >
      {/* Image or fallback */}
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

      {/* Review button with note */}
      <Text fontSize="xs" color="gray.500" mb="1">
        Click below to add or update your review
      </Text>
      <Button
        mt="1"
        colorScheme="teal"
        width="full"
        onClick={handleReviewClick} // Trigger review function, prevent card click
      >
        Review
      </Button>
    </Box>
  );
};

export default CourseCard;
