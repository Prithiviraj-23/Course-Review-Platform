import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  Text,
  FormErrorMessage,
  useToast,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  useColorModeValue,
  FormHelperText,
  Alert,
  AlertIcon,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  HiArrowLeft,
  HiPlus,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import { FaTags, FaBook, FaVideo, FaInfoCircle } from "react-icons/fa";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    difficulty: "Beginner",
    videoUrl: "",
    prerequisites: [],
    tags: [],
  });

  // Form inputs that aren't directly part of the course object
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const tagBg = useColorModeValue("blue.50", "blue.800");
  const tagPrereqBg = useColorModeValue("purple.50", "purple.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Fetch the course data to edit
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_HOST}/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Populate form with existing course data
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          department: res.data.department || "",
          difficulty: res.data.difficulty || "Beginner",
          videoUrl: res.data.videoUrl || "",
          prerequisites: res.data.prerequisites || [],
          tags: res.data.tags || [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch course", err);
        setError("Failed to load course details for editing.");
        setLoading(false);

        toast({
          title: "Error",
          description: "Failed to load course details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (token && courseId) {
      fetchCourse();
    }
  }, [courseId, token, toast]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Add prerequisite to the list
  const handleAddPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }));
      setPrerequisiteInput("");
    }
  };

  // Remove prerequisite from the list
  const handleRemovePrerequisite = (index) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  // Add tag to the list
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Remove tag from the list
  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.department.trim()) {
      errors.department = "Department is required";
    }

    // Optional: validate videoUrl format if provided
    if (
      formData.videoUrl &&
      !formData.videoUrl.includes("youtube.com") &&
      !formData.videoUrl.includes("youtu.be")
    ) {
      errors.videoUrl = "Video URL should be a YouTube link";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_HOST}/api/courses/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Course updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate back to the course detail page
      navigate(`/course/${courseId}`);
    } catch (err) {
      console.error("Failed to update course", err);

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update course.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} fontSize="lg">
          Loading course data...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="600px" mx="auto" py={10}>
        <Alert status="error" variant="solid" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
        <Button mt={6} onClick={() => navigate(-1)} leftIcon={<HiArrowLeft />}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" py={8} px={4}>
      {/* Header with back button */}
      <Card mb={8} overflow="hidden" boxShadow="md">
        <CardHeader bg={headerBg} py={4}>
          <Flex alignItems="center">
            <IconButton
              icon={<HiArrowLeft />}
              onClick={() => navigate(-1)}
              aria-label="Go back"
              mr={4}
              variant="ghost"
              size="md"
            />
            <Heading size="lg">Edit Course</Heading>
          </Flex>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {/* Basic Information Section */}
          <Card variant="outline" boxShadow="sm" bg={cardBg}>
            <CardHeader bg={useColorModeValue("gray.50", "gray.700")} py={4}>
              <Flex align="center">
                <FaInfoCircle color="blue" />
                <Heading size="md" ml={2}>
                  Basic Information
                </Heading>
              </Flex>
            </CardHeader>
            <CardBody pt={5}>
              <VStack spacing={5} align="stretch">
                {/* Title */}
                <FormControl isInvalid={!!formErrors.title} isRequired>
                  <FormLabel fontWeight="medium">Course Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive course title"
                    focusBorderColor="blue.400"
                    size="md"
                  />
                  <FormErrorMessage>{formErrors.title}</FormErrorMessage>
                </FormControl>

                {/* Description */}
                <FormControl isInvalid={!!formErrors.description} isRequired>
                  <FormLabel fontWeight="medium">Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of what students will learn"
                    rows={5}
                    focusBorderColor="blue.400"
                    size="md"
                  />
                  <FormErrorMessage>{formErrors.description}</FormErrorMessage>
                </FormControl>

                {/* Department and Difficulty in same row on larger screens */}
                <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                  <FormControl
                    isInvalid={!!formErrors.department}
                    isRequired
                    flex="1"
                  >
                    <FormLabel fontWeight="medium">Department</FormLabel>
                    <Input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Computer Science, Chemistry"
                      focusBorderColor="blue.400"
                      size="md"
                    />
                    <FormErrorMessage>{formErrors.department}</FormErrorMessage>
                  </FormControl>

                  <FormControl flex="1">
                    <FormLabel fontWeight="medium">Difficulty Level</FormLabel>
                    <Select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      focusBorderColor="blue.400"
                      size="md"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Select>
                    <FormHelperText>
                      Select the appropriate difficulty level
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </VStack>
            </CardBody>
          </Card>

          {/* Media Section */}
          <Card variant="outline" boxShadow="sm" bg={cardBg}>
            <CardHeader bg={useColorModeValue("gray.50", "gray.700")} py={4}>
              <Flex align="center">
                <FaVideo color="blue" />
                <Heading size="md" ml={2}>
                  Course Media
                </Heading>
              </Flex>
            </CardHeader>
            <CardBody pt={5}>
              {/* Video URL */}
              <FormControl isInvalid={!!formErrors.videoUrl}>
                <FormLabel fontWeight="medium">Video URL (YouTube)</FormLabel>
                <Input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="e.g., https://www.youtube.com/watch?v=..."
                  focusBorderColor="blue.400"
                  size="md"
                />
                <FormHelperText>
                  <Flex align="center">
                    <HiOutlineInformationCircle />
                    <Text ml={1}>
                      Add a YouTube video introducing your course
                    </Text>
                  </Flex>
                </FormHelperText>
                <FormErrorMessage>{formErrors.videoUrl}</FormErrorMessage>
              </FormControl>
            </CardBody>
          </Card>

          {/* Prerequisites & Tags Section */}
          <Card variant="outline" boxShadow="sm" bg={cardBg}>
            <CardHeader bg={useColorModeValue("gray.50", "gray.700")} py={4}>
              <Flex align="center">
                <FaTags color="blue" />
                <Heading size="md" ml={2}>
                  Prerequisites & Tags
                </Heading>
              </Flex>
            </CardHeader>
            <CardBody pt={5}>
              <VStack spacing={5} align="stretch">
                {/* Prerequisites */}
                <FormControl>
                  <FormLabel fontWeight="medium">Prerequisites</FormLabel>
                  <InputGroup>
                    <Input
                      value={prerequisiteInput}
                      onChange={(e) => setPrerequisiteInput(e.target.value)}
                      placeholder="Enter knowledge or courses required"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPrerequisite();
                        }
                      }}
                      focusBorderColor="blue.400"
                      pr="3rem"
                    />
                    <InputRightElement width="3rem">
                      <IconButton
                        icon={<HiPlus />}
                        size="sm"
                        onClick={handleAddPrerequisite}
                        aria-label="Add prerequisite"
                        colorScheme="blue"
                        variant="ghost"
                        isDisabled={!prerequisiteInput.trim()}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>
                    Press Enter to add prerequisite
                  </FormHelperText>

                  {formData.prerequisites.length > 0 && (
                    <Box
                      mt={3}
                      p={3}
                      borderRadius="md"
                      bg={tagPrereqBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Flex mb={2} align="center">
                        <FaBook size="14px" />
                        <Text ml={2} fontWeight="medium" fontSize="sm">
                          Course Prerequisites:
                        </Text>
                        <Badge ml={2} colorScheme="purple">
                          {formData.prerequisites.length}
                        </Badge>
                      </Flex>
                      <Flex flexWrap="wrap" gap={2}>
                        {formData.prerequisites.map((prereq, index) => (
                          <Tag
                            key={index}
                            size="md"
                            borderRadius="full"
                            variant="subtle"
                            colorScheme="purple"
                          >
                            <TagLabel>{prereq}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleRemovePrerequisite(index)}
                            />
                          </Tag>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </FormControl>

                {/* Tags */}
                <FormControl>
                  <FormLabel fontWeight="medium">Tags</FormLabel>
                  <InputGroup>
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add keywords related to your course"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      focusBorderColor="blue.400"
                      pr="3rem"
                    />
                    <InputRightElement width="3rem">
                      <IconButton
                        icon={<HiPlus />}
                        size="sm"
                        onClick={handleAddTag}
                        aria-label="Add tag"
                        colorScheme="blue"
                        variant="ghost"
                        isDisabled={!tagInput.trim()}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>Press Enter to add tag</FormHelperText>

                  {formData.tags.length > 0 && (
                    <Box
                      mt={3}
                      p={3}
                      borderRadius="md"
                      bg={tagBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Flex mb={2} align="center">
                        <FaTags size="14px" />
                        <Text ml={2} fontWeight="medium" fontSize="sm">
                          Course Tags:
                        </Text>
                        <Badge ml={2} colorScheme="blue">
                          {formData.tags.length}
                        </Badge>
                      </Flex>
                      <Flex flexWrap="wrap" gap={2}>
                        {formData.tags.map((tag, index) => (
                          <Tag
                            key={index}
                            size="md"
                            borderRadius="full"
                            variant="subtle"
                            colorScheme="blue"
                          >
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleRemoveTag(index)}
                            />
                          </Tag>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Form Actions */}
          <Card variant="outline" boxShadow="sm" bg={cardBg}>
            <CardFooter>
              <Flex justify="space-between" width="100%">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  size="lg"
                  width={{ base: "45%", md: "200px" }}
                  leftIcon={<HiArrowLeft />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={submitting}
                  loadingText="Saving..."
                  size="lg"
                  width={{ base: "45%", md: "200px" }}
                  boxShadow="sm"
                >
                  Save Changes
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </VStack>
      </form>
    </Box>
  );
};

export default EditCoursePage;
