import {
  Box,
  Text,
  Heading,
  Tag,
  Button,
  Avatar,
  Divider,
  VStack,
  HStack,
  useDisclosure,
  Spinner,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useSelector } from "react-redux";
import { HiArrowLeft } from "react-icons/hi"; // For the back button
import ReviewModal from "./ReviewModal"; // Assuming the ReviewModal component exists

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to navigate back

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_HOST}/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
        setError("Failed to load course details.");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_HOST}/api/reviews/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (token && courseId) {
      fetchCourse();
      fetchReviews();
    }
  }, [courseId, token]);

  if (loading)
    return (
      <Box textAlign="center">
        <Spinner size="xl" />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" color="red.500">
        <Text>{error}</Text>
      </Box>
    );

  if (!course) return <Text>Course not found.</Text>;

  return (
    <Box p="6" maxW="4xl" mx="auto" bg="white" boxShadow="lg" borderRadius="lg">
      {/* Back Button */}
      <IconButton
        icon={<HiArrowLeft />}
        onClick={() => navigate(-1)}
        aria-label="Back"
        variant="outline"
        colorScheme="teal"
        mb="4"
      />

      {/* Video section */}
      {course.videoUrl?.trim() ? (
        <Box mb="6">
          <iframe
            width="100%"
            height="315"
            src={course.videoUrl.trim()}
            title="Course Video"
            frameBorder="0"
            allowFullScreen
            style={{
              borderRadius: "10px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          ></iframe>
        </Box>
      ) : (
        <Box
          mb="4"
          height="300px"
          borderRadius="10px"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.500"
          fontSize="xl"
          fontWeight="bold"
        >
          No Video Available
        </Box>
      )}

      <Heading size="lg" mb="2" fontWeight="bold">
        {course.title}
      </Heading>
      <Text color="gray.600" mb="4">
        {course.description}
      </Text>

      <HStack spacing={4} mb={4}>
        <Text>
          <strong>Department:</strong> {course.department}
        </Text>
        <Text>
          <strong>Difficulty:</strong> {course.difficulty}
        </Text>
      </HStack>

      <Text mb={2}>
        <strong>Instructor:</strong> {course.instructor?.name || "N/A"} (
        {course.instructor?.email})
      </Text>

      {/* Prerequisites Section - Displayed Horizontally */}
      <Box mb="4">
        <Flex align="center" wrap="nowrap">
          <Text fontWeight="bold" mr="2">
            Prerequisites:
          </Text>
          {course.prerequisites?.length > 0 ? (
            course.prerequisites.map((prerequisite, idx) => (
              <Tag
                key={idx}
                colorScheme="blue"
                borderRadius="full"
                p="2"
                mr="2"
              >
                {prerequisite}
              </Tag>
            ))
          ) : (
            <Text color="gray.500" display="inline-block">
              No prerequisites available
            </Text>
          )}
        </Flex>
      </Box>

      <HStack spacing={2} wrap="wrap" mb={4}>
        {course.tags?.map((tag, idx) => (
          <Tag key={idx} colorScheme="blue">
            {tag.trim()}
          </Tag>
        ))}
      </HStack>

      <HStack spacing={4} mb={4}>
        <Text>
          <strong>Avg Rating:</strong> ⭐ {course.averageRating.toFixed(1)}
        </Text>
      </HStack>

      <Button colorScheme="teal" onClick={onOpen} width="full" mb="6">
        Add / Update Review
      </Button>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isOpen}
        onClose={onClose}
        courseId={course._id}
        userId={userId}
      />

      <Divider mb="4" />
      <Heading size="md" mb="3">
        Reviews
      </Heading>

      <VStack align="stretch" spacing={4}>
        {reviews.length === 0 ? (
          <Text>No reviews yet</Text>
        ) : (
          reviews.map((review) => (
            <Box key={review._id} p="4" bg="gray.50" borderRadius="md">
              <HStack spacing={3} mb={2}>
                <Avatar size="sm" name={review.student?.name} />
                <Text fontWeight="bold">
                  {review.student?.name || "Anonymous"}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600" mb="1">
                ⭐ {review.rating}
              </Text>
              <Text>{review.comment}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default CourseDetailPage;
