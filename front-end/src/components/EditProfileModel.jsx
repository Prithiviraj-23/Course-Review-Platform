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
} from "@chakra-ui/react";
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
        "http://localhost:5000/api/auth/update",
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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isInvalid={!!error}>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Department</FormLabel>
            <Select
              name="department"
              value={formData.preferences.department}
              onChange={handleChange}
              placeholder="Select department"
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
            <FormLabel>Interests</FormLabel>
            <HStack mb={2}>
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
                onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
              />
              <Button onClick={handleAddInterest} size="sm">
                Add
              </Button>
            </HStack>

            <Box mt={2}>
              <Wrap spacing={2}>
                {formData.preferences.interests.map((interest, index) => (
                  <WrapItem key={index}>
                    <Tag colorScheme="blue" borderRadius="full">
                      <TagLabel>{interest}</TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveInterest(interest)}
                      />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </FormControl>

          {error && (
            <FormControl isInvalid={true}>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Saving"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
