import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import axios from "axios"; // Axios for HTTP requests

const PostModal = ({ isOpen, onClose, refreshCourseData }) => {
  const toast = useToast();
  const { token, user } = useSelector((state) => state.auth); // Get token and user from redux state

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    difficulty: "",
    tags: "",
    videoUrl: "",
    prerequisite: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.description || !imageFile) {
      toast({
        title: "Missing Fields",
        description: "Please make sure all fields are filled out correctly.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true); // Show loading state

      // Create FormData object to send the course data with the image
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("department", formData.department);
      form.append("difficulty", formData.difficulty);
      form.append(
        "tags",
        JSON.stringify(formData.tags.split(",").map((tag) => tag.trim()))
      );
      form.append("prerequisite", formData.prerequisite);
      form.append("instructorId", user?._id); // Send the instructor ID
      form.append("image", imageFile); // Attach the image
      form.append("videoUrl", formData.videoUrl); // Attach the video URL

      // Use axios to post the course data
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/courses`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      toast({
        title: "Course Created",
        description: "Your course has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close the modal and reset the form
      onClose();
      setFormData({
        title: "",
        description: "",
        department: "",
        difficulty: "",
        tags: "",
        videoUrl: "",
        prerequisite: "",
      });
      setImageFile(null);

      // Refresh the course data after adding the course
      refreshCourseData();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || err.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Course</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={3} isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Course Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Course Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Department</FormLabel>
            <Input
              placeholder="e.g. Computer Science"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Difficulty</FormLabel>
            <Input
              placeholder="e.g. Beginner / Intermediate / Advanced"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <Input
              placeholder="e.g. AI, ML, Data Structures"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Video URL</FormLabel>
            <Input
              placeholder="e.g. https://www.youtube.com/watch?v=example"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Prerequisite (comma-separated)</FormLabel>
            <Input
              placeholder="e.g. Intro to Programming, Data Structures"
              name="prerequisite"
              value={formData.prerequisite}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              display="none"
              id="image-upload"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                as="span"
                variant="outline"
                colorScheme="teal"
                width="full"
                cursor="pointer"
              >
                {imageFile ? "Change Image" : "Choose Image"}
              </Button>
            </label>

            {imageFile && (
              <Box mt={3} textAlign="center">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{
                    maxHeight: "200px",
                    borderRadius: "8px",
                    margin: "10px auto",
                  }}
                />
                <Button
                  mt={2}
                  colorScheme="red"
                  size="sm"
                  onClick={handleImageRemove}
                >
                  Remove Image
                </Button>
              </Box>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
