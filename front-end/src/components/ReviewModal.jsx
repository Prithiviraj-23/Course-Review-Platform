import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Flex,
  Text,
  Icon,
  HStack,
  VStack,
  Progress,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaStar, FaRegStar, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const ReviewModal = ({
  isOpen,
  onClose,
  courseId,
  refreshCourseData,
  courseName,
}) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentLength, setCommentLength] = useState(0);
  const toast = useToast();
  const { token } = useSelector((state) => state.auth);

  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const starColor = useColorModeValue("yellow.400", "yellow.300");
  const starHoverColor = useColorModeValue("yellow.500", "yellow.200");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Rating labels based on star value
  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    setCommentLength(value.length);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please share your thoughts about this course.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/api/reviews/submit`,
        { course: courseId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.message) {
        toast({
          title: "Review Submitted",
          description: "Thank you for sharing your feedback!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setRating(3);
        setComment("");
        onClose();
        refreshCourseData();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
      size="md"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent
        borderRadius="lg"
        shadow="xl"
        bg={bgColor}
        overflow="hidden"
      >
        <ModalHeader
          bg={headerBg}
          py={4}
          px={6}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Text fontSize="xl" fontWeight="600">
            {courseName ? `Review: ${courseName}` : "Submit Course Review"}
          </Text>
        </ModalHeader>
        <ModalCloseButton mt={3} mr={3} />

        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Rating Stars */}
            <FormControl id="rating">
              <FormLabel
                fontSize="md"
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
              >
                Your Rating
                <Box
                  as="span"
                  color={ratingLabels[rating] ? `${starColor}` : "gray.500"}
                  ml={2}
                  fontWeight="normal"
                >
                  ({ratingLabels[rating] || "Select"})
                </Box>
              </FormLabel>

              <Flex justify="center" mb={2}>
                <HStack spacing={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                      key={star}
                      cursor="pointer"
                      fontSize="3xl"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      color={
                        (hoveredRating ? hoveredRating >= star : rating >= star)
                          ? starColor
                          : "gray.300"
                      }
                      transition="all 0.2s"
                      _hover={{ color: starHoverColor }}
                    >
                      <Icon as={FaStar} />
                    </Box>
                  ))}
                </HStack>
              </Flex>

              <Flex justify="space-between" px={1}>
                <Text fontSize="xs" color="gray.500">
                  Poor
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Excellent
                </Text>
              </Flex>
            </FormControl>

            {/* Comment Textarea */}
            <FormControl id="comment">
              <FormLabel
                fontSize="md"
                fontWeight="medium"
                mb={2}
                display="flex"
                alignItems="center"
              >
                Your Review
                <Text
                  as="span"
                  ml={2}
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="normal"
                >
                  (Required)
                </Text>
              </FormLabel>

              <Textarea
                placeholder="Share your experience with this course. What did you like or dislike? Would you recommend it to others?"
                value={comment}
                onChange={handleCommentChange}
                minH="120px"
                focusBorderColor="blue.400"
                bg={useColorModeValue("white", "gray.700")}
                borderColor={borderColor}
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                }}
                resize="vertical"
              />

              <Box mt={2}>
                <Flex justifyContent="space-between" alignItems="center">
                  <FormHelperText display="flex" alignItems="center">
                    <Icon as={FaInfoCircle} mr={1} color="blue.400" />
                    Be honest and specific in your feedback
                  </FormHelperText>
                  <Text
                    fontSize="xs"
                    color={commentLength > 0 ? "green.500" : "gray.500"}
                  >
                    {commentLength} characters
                  </Text>
                </Flex>

                {commentLength > 0 && (
                  <Progress
                    size="xs"
                    mt={2}
                    value={Math.min(commentLength, 100)}
                    max={100}
                    borderRadius="full"
                    colorScheme={
                      commentLength < 20
                        ? "red"
                        : commentLength < 50
                        ? "yellow"
                        : "green"
                    }
                  />
                )}
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          borderColor={borderColor}
          bg={useColorModeValue("gray.50", "gray.700")}
          p={4}
        >
          <Button variant="outline" mr={3} onClick={onClose} size="md">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            size="md"
          >
            Submit Review
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
