import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  HStack,
  Box,
  Divider,
  Text,
  InputGroup,
  InputRightElement,
  Tooltip,
  VStack,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const { token } = useSelector((state) => state.auth);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferences: {
      department: "",
      interests: [],
    },
  });

  const [newInterest, setNewInterest] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Colors
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const tagBg = useColorModeValue("blue.50", "blue.800");

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        preferences: {
          department: userData.preferences?.department || "",
          interests: userData.preferences?.interests || [],
        },
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          department: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear errors when user types
    if (error) setError("");
  };

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !formData.preferences.interests.includes(newInterest.trim())
    ) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          interests: [...formData.preferences.interests, newInterest.trim()],
        },
      });
      setNewInterest("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        interests: formData.preferences.interests.filter((i) => i !== interest),
      },
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_HOST || "http://localhost:5000"
        }/api/auth/update`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Call the parent component's onSave function with updated data
      if (onSave) {
        onSave(response.data.user || formData);
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      toast({
        title: "Update Failed",
        description:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="lg" boxShadow="xl">
        <ModalHeader
          py={4}
          px={6}
          bg={useColorModeValue("blue.50", "blue.900")}
          borderTopRadius="lg"
        >
          <Heading size="md">Edit Profile</Heading>
        </ModalHeader>
        <ModalCloseButton mt={2} mr={2} />

        <Divider />

        <ModalBody p={6}>
          <VStack spacing={5} align="stretch">
            {/* Personal Information Section */}
            <Box>
              <Text fontWeight="medium" fontSize="sm" color="gray.500" mb={3}>
                PERSONAL INFORMATION
              </Text>

              <FormControl mb={4} isInvalid={!!error}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Name
                </FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Email
                </FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  focusBorderColor="blue.400"
                />
              </FormControl>
            </Box>

            <Divider />

            {/* Preferences Section */}
            <Box>
              <Text fontWeight="medium" fontSize="sm" color="gray.500" mb={3}>
                PREFERENCES
              </Text>

              <FormControl mb={4}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Department
                </FormLabel>
                <Select
                  name="department"
                  value={formData.preferences.department}
                  onChange={handleChange}
                  placeholder="Select department"
                  focusBorderColor="blue.400"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Interests
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    onKeyPress={handleKeyPress}
                    pr="4.5rem"
                    focusBorderColor="blue.400"
                  />
                  <InputRightElement width="4.5rem">
                    <Tooltip label="Add interest" placement="top">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleAddInterest}
                        colorScheme="blue"
                        variant="ghost"
                        rightIcon={<FaPlus />}
                      >
                        Add
                      </Button>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>

                <Text fontSize="xs" color="gray.500" mt={1} ml={1}>
                  Press Enter to add or click Add
                </Text>

                {formData.preferences.interests.length > 0 && (
                  <Box mt={3} p={3} borderRadius="md" bg={sectionBg}>
                    <Wrap spacing={2}>
                      {formData.preferences.interests.map((interest, index) => (
                        <WrapItem key={index}>
                          <Tag
                            size="md"
                            borderRadius="full"
                            variant="subtle"
                            colorScheme="blue"
                            bgColor={tagBg}
                          >
                            <TagLabel>{interest}</TagLabel>
                            <TagCloseButton
                              onClick={() => handleRemoveInterest(interest)}
                            />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}
              </FormControl>
            </Box>
          </VStack>

          {error && (
            <Box
              mt={4}
              p={3}
              borderRadius="md"
              bg="red.50"
              borderColor="red.300"
              borderWidth="1px"
            >
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}
        </ModalBody>

        <Divider />

        <ModalFooter
          bg={useColorModeValue("gray.50", "gray.800")}
          p={4}
          borderBottomRadius="lg"
        >
          <Button variant="outline" mr={3} onClick={onClose} size="md">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Saving"
            size="md"
            boxShadow="sm"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
