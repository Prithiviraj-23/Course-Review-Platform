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
  FormHelperText,
  FormErrorMessage,
  Input,
  Textarea,
  Box,
  useToast,
  VStack,
  HStack,
  Divider,
  Text,
  Icon,
  SimpleGrid,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Select,
  Image,
  Badge,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaBook,
  FaTag,
  FaVideo,
  FaImage,
  FaGraduationCap,
  FaExclamationTriangle,
} from "react-icons/fa";

const PostModal = ({ isOpen, onClose, refreshCourseData }) => {
  const toast = useToast();
  const { token, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    difficulty: "Beginner", // Set default value
    tags: "",
    videoUrl: "",
    prerequisite: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Theme colors
  const bgHeader = useColorModeValue("blue.50", "blue.900");
  const bgSection = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const errorBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.1)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    if (!fieldTouched[name]) {
      setFieldTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setFieldTouched((prev) => ({
        ...prev,
        image: true,
      }));

      // Clear image error
      if (formErrors.image) {
        setFormErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check required fields
    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    if (!formData.department.trim()) {
      errors.department = "Department is required";
      isValid = false;
    }

    if (!formData.tags.trim()) {
      errors.tags = "At least one tag is required";
      isValid = false;
    }

    if (!formData.videoUrl.trim()) {
      errors.videoUrl = "Video URL is required";
      isValid = false;
    } else if (
      !formData.videoUrl.includes("youtube.com") &&
      !formData.videoUrl.includes("youtu.be")
    ) {
      errors.videoUrl = "Please enter a valid YouTube URL";
      isValid = false;
    }

    if (!formData.prerequisite.trim()) {
      errors.prerequisite = "Prerequisites are required";
      isValid = false;
    }

    if (!imageFile) {
      errors.image = "Course image is required";
      isValid = false;
    }

    setFormErrors(errors);

    // Mark all fields as touched to show validation messages
    setFieldTouched({
      title: true,
      description: true,
      department: true,
      difficulty: true,
      tags: true,
      videoUrl: true,
      prerequisite: true,
      image: true,
    });

    return isValid;
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!validateForm()) {
      toast({
        title: "Missing Required Fields",
        description: "Please complete all required fields before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setIsSubmitting(true);

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
      form.append("instructorId", user?._id);
      form.append("image", imageFile);
      form.append("videoUrl", formData.videoUrl);

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/courses`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Course Created Successfully",
        description: "Your new course has been added.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      onClose();
      setFormData({
        title: "",
        description: "",
        department: "",
        difficulty: "Beginner",
        tags: "",
        videoUrl: "",
        prerequisite: "",
      });
      setImageFile(null);
      setFieldTouched({});
      setFormErrors({});

      if (refreshCourseData) refreshCourseData();
    } catch (err) {
      toast({
        title: "Error Creating Course",
        description:
          err.response?.data?.message || err.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if field is invalid
  const isInvalid = (field) => {
    if (!fieldTouched[field]) return false;

    if (field === "image") {
      return !imageFile;
    }

    return formErrors[field] ? true : false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="md" shadow="xl">
        <ModalHeader
          borderTopRadius="md"
          bg={bgHeader}
          py={4}
          display="flex"
          alignItems="center"
        >
          <Icon as={FaBook} mr={2} color={iconColor} />
          <Text>Create New Course</Text>
        </ModalHeader>
        <ModalCloseButton mt={2} />

        {/* Required fields notice */}
        <Box
          bg={useColorModeValue("blue.50", "blue.900")}
          px={6}
          py={2}
          fontSize="sm"
          color={useColorModeValue("blue.600", "blue.200")}
        >
          All fields are required to create a course
        </Box>

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Basic Information Section */}
            <Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.500"
                letterSpacing="wide"
                mb={2}
              >
                BASIC INFORMATION
              </Text>

              <VStack
                spacing={4}
                align="stretch"
                bg={bgSection}
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <FormControl isRequired isInvalid={isInvalid("title")}>
                  <FormLabel fontWeight="medium">Course Title</FormLabel>
                  <Input
                    placeholder="Enter a descriptive title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    focusBorderColor="blue.400"
                  />
                  <FormErrorMessage>{formErrors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={isInvalid("description")}>
                  <FormLabel fontWeight="medium">Description</FormLabel>
                  <Textarea
                    placeholder="Provide a detailed description of what students will learn"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    focusBorderColor="blue.400"
                  />
                  <FormErrorMessage>{formErrors.description}</FormErrorMessage>
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={isInvalid("department")}>
                    <FormLabel fontWeight="medium">Department</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaGraduationCap} color="gray.500" />
                      </InputLeftElement>
                      <Input
                        pl="2.5rem"
                        placeholder="e.g. Computer Science"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        focusBorderColor="blue.400"
                      />
                    </InputGroup>
                    <FormErrorMessage>{formErrors.department}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium">Difficulty Level</FormLabel>
                    <Select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      focusBorderColor="blue.400"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Content Details Section */}
            <Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.500"
                letterSpacing="wide"
                mb={2}
              >
                CONTENT DETAILS
              </Text>

              <VStack
                spacing={4}
                align="stretch"
                bg={bgSection}
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <FormControl isRequired isInvalid={isInvalid("tags")}>
                  <FormLabel fontWeight="medium">Tags</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaTag} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      placeholder="e.g. AI, ML, Data Structures (comma-separated)"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      focusBorderColor="blue.400"
                    />
                  </InputGroup>
                  <FormHelperText>
                    Add keywords related to your course, separated by commas
                  </FormHelperText>
                  <FormErrorMessage>{formErrors.tags}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={isInvalid("prerequisite")}>
                  <FormLabel fontWeight="medium">Prerequisites</FormLabel>
                  <Input
                    placeholder="e.g. Intro to Programming, Data Structures"
                    name="prerequisite"
                    value={formData.prerequisite}
                    onChange={handleChange}
                    focusBorderColor="blue.400"
                  />
                  <FormHelperText>
                    Courses or knowledge required before taking this course
                  </FormHelperText>
                  <FormErrorMessage>{formErrors.prerequisite}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>

            {/* Media Section */}
            <Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.500"
                letterSpacing="wide"
                mb={2}
              >
                COURSE MEDIA
              </Text>

              <VStack
                spacing={4}
                align="stretch"
                bg={bgSection}
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <FormControl isRequired isInvalid={isInvalid("videoUrl")}>
                  <FormLabel fontWeight="medium">Video URL</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaVideo} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      pl="2.5rem"
                      placeholder="e.g. https://www.youtube.com/watch?v=example"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      focusBorderColor="blue.400"
                    />
                  </InputGroup>
                  <FormHelperText>
                    Add a YouTube video introducing your course
                  </FormHelperText>
                  <FormErrorMessage>{formErrors.videoUrl}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={isInvalid("image")}>
                  <FormLabel fontWeight="medium">Course Image</FormLabel>
                  <Box
                    borderWidth={2}
                    borderStyle="dashed"
                    borderColor={
                      imageFile
                        ? "blue.400"
                        : isInvalid("image")
                        ? "red.300"
                        : borderColor
                    }
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    bg={
                      imageFile
                        ? "transparent"
                        : useColorModeValue("gray.50", "whiteAlpha.50")
                    }
                    position="relative"
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      display="none"
                      id="image-upload"
                      onChange={handleImageChange}
                    />

                    {!imageFile ? (
                      <VStack spacing={2}>
                        <Icon
                          as={FaImage}
                          boxSize={8}
                          color={isInvalid("image") ? "red.400" : "gray.400"}
                        />
                        <Text
                          fontSize="sm"
                          color={isInvalid("image") ? "red.500" : "gray.500"}
                        >
                          {isInvalid("image")
                            ? "Course image is required"
                            : "Click or drag to upload course image"}
                        </Text>
                        <label htmlFor="image-upload">
                          <Button
                            as="span"
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            cursor="pointer"
                            mt={2}
                          >
                            Browse Files
                          </Button>
                        </label>
                      </VStack>
                    ) : (
                      <Box>
                        <Image
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          maxH="200px"
                          mx="auto"
                          borderRadius="md"
                        />
                        <HStack spacing={2} mt={3} justify="center">
                          <label htmlFor="image-upload">
                            <Button
                              as="span"
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              cursor="pointer"
                            >
                              Change
                            </Button>
                          </label>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={handleImageRemove}
                          >
                            Remove
                          </Button>
                        </HStack>
                        <Badge colorScheme="green" mt={2}>
                          {imageFile.name}
                        </Badge>
                      </Box>
                    )}
                  </Box>
                  <FormErrorMessage>{formErrors.image}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>

            {/* Error Summary - shows only when there are errors and form was submitted */}
            {Object.keys(formErrors).length > 0 && fieldTouched.title && (
              <Box
                bg={errorBg}
                p={3}
                borderRadius="md"
                borderWidth="1px"
                borderColor="red.300"
              >
                <Flex align="center" mb={2}>
                  <Icon as={FaExclamationTriangle} color="red.500" mr={2} />
                  <Text fontWeight="medium" color="red.500">
                    Please fix the following errors:
                  </Text>
                </Flex>
                <VStack align="start" spacing={1} pl={6}>
                  {Object.entries(formErrors).map(([field, error]) => (
                    <Text key={field} fontSize="sm" color="red.500">
                      • {error}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <Divider />

        <ModalFooter bg={useColorModeValue("gray.50", "gray.800")}>
          <Button variant="outline" mr={3} onClick={onClose} size="md">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating..."
            size="md"
          >
            Create Course
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
