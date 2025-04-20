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
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ReviewModal = ({ isOpen, onClose, courseId, refreshCourseData }) => {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const toast = useToast();
  const { token } = useSelector((state) => state.auth); // Get user and token

  const handleSubmit = async () => {
    try {
      // Make the API call to submit the review
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/api/reviews/submit`,
        { course: courseId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token here
          },
        }
      );

      // Show success toast
      toast({
        title: "Review submitted!",
        description: res.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear the form and close the modal
      setRating(3);
      setComment("");
      onClose();

      // Call refreshCourseData to refresh the course data after review submission
      refreshCourseData();
    } catch (err) {
      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Submit Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Rating (1-5)</FormLabel>
            <NumberInput
              value={rating}
              min={1}
              max={5}
              onChange={(value) => setRating(Number(value))}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Comment</FormLabel>
            <Textarea
              placeholder="Write your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
