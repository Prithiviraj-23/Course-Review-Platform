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
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toast = useToast();

  // Get auth token
  const { token } = useSelector((state) => state.auth);

  // Form validation
  const isError = {
    currentPassword: currentPassword === "",
    newPassword: newPassword.length < 6,
    confirmPassword: newPassword !== confirmPassword,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      isError.currentPassword ||
      isError.newPassword ||
      isError.confirmPassword
    ) {
      setError("Please fix the form errors before submitting.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Close modal and reset form
      handleClose();
    } catch (err) {
      console.error("Password change error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to change password. Please check your current password and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormControl
                isRequired
                isInvalid={isError.currentPassword && currentPassword !== ""}
              >
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showCurrent ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowCurrent(!showCurrent)}
                      aria-label={
                        showCurrent ? "Hide password" : "Show password"
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={isError.newPassword && newPassword !== ""}
              >
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showNew ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowNew(!showNew)}
                      aria-label={showNew ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
                {isError.newPassword && newPassword !== "" && (
                  <FormErrorMessage>
                    Password must be at least 6 characters.
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired
                isInvalid={isError.confirmPassword && confirmPassword !== ""}
              >
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showConfirm ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    />
                  </InputRightElement>
                </InputGroup>
                {isError.confirmPassword && confirmPassword !== "" && (
                  <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Change Password
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
