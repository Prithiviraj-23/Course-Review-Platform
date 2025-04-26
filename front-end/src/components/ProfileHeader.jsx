import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Avatar,
  Divider,
  Badge,
  Icon,
  Container,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaEdit,
  FaKey,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import ChangePasswordModal from "./ChangePasswordModal ";

const ProfileHeader = ({ userData, onEditClick }) => {
  // Add state for the password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Enhanced color scheme
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subtleText = useColorModeValue("gray.600", "gray.300");
  const headerBg = useColorModeValue("blue.50", "blue.900");

  // Role badge color mapping
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "red";
      case "instructor":
        return "purple";
      case "student":
        return "blue";
      default:
        return "gray";
    }
  };

  // Format join date if available
  const formatJoinDate = () => {
    if (!userData?.joinedAt) return "Member";
    const date = new Date(userData.joinedAt);
    return `Joined ${date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };

  return (
    <Box
      bg={bgColor}
      boxShadow="sm"
      rounded="lg"
      overflow="hidden"
      mb={8}
      borderWidth="1px"
      borderColor={borderColor}
    >
      {/* Header background */}
      <Box bg={headerBg} h="80px" position="relative" />

      <Container maxW="container.lg" px={{ base: 4, md: 8 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "stretch" }}
          mt={{ base: -12, md: -16 }}
          mb={6}
          pb={6}
          position="relative"
        >
          {/* Avatar section */}
          <Box
            textAlign="center"
            alignSelf={{ md: "flex-start" }}
            position="relative"
            mr={{ md: 8 }}
            mb={{ base: 6, md: 0 }}
          >
            <Avatar
              size="2xl"
              name={userData?.name || "User"}
              src={userData?.avatar || ""}
              mb={2}
              border="4px solid"
              borderColor={bgColor}
              boxShadow="lg"
            />

            {/* Role badge */}
            <Tooltip
              label={`${userData?.role || "User"} account`}
              placement="top"
            >
              <Badge
                position="absolute"
                bottom={2}
                right={0}
                colorScheme={getRoleBadgeColor(userData?.role)}
                fontSize="0.8em"
                py={1}
                px={2}
                borderRadius="full"
                boxShadow="sm"
                textTransform="capitalize"
              >
                {userData?.role || "User"}
              </Badge>
            </Tooltip>
          </Box>

          {/* User info section */}
          <Box flex={1}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "center", md: "flex-start" }}
              wrap="wrap"
              mb={4}
            >
              {/* Name and badges */}
              <Box
                mb={{ base: 4, md: 0 }}
                textAlign={{ base: "center", md: "left" }}
              >
                <Heading as="h1" size="xl" color={textColor} mb={1}>
                  {userData?.name || "User"}
                </Heading>

                <HStack spacing={2} mb={2}>
                  <Badge colorScheme="green" py={1} px={2} borderRadius="full">
                    Active Account
                  </Badge>
                  <Badge colorScheme="gray" py={1} px={2} borderRadius="full">
                    <Icon as={FaCalendarAlt} mr={1} fontSize="xs" />
                    {formatJoinDate()}
                  </Badge>
                </HStack>

                <Flex align="center" color={subtleText}>
                  <Icon as={FaEnvelope} mr={2} />
                  <Text fontSize="md">
                    {userData?.email || "user@example.com"}
                  </Text>
                </Flex>
              </Box>

              {/* Action buttons */}
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={3}
                align={{ base: "center", md: "flex-end" }}
                mt={{ base: 2, md: 0 }}
              >
                <Button
                  leftIcon={<FaEdit />}
                  colorScheme="blue"
                  onClick={onEditClick}
                  size="md"
                  boxShadow="sm"
                >
                  Edit Profile
                </Button>
                <Button
                  leftIcon={<FaKey />}
                  variant="outline"
                  colorScheme="blue"
                  size="md"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                </Button>
              </Stack>
            </Flex>

            {/* Additional user info cards */}
            {userData?.bio && (
              <Box
                bg={cardBg}
                p={4}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                mt={4}
              >
                <Text fontWeight="medium" mb={1} color={subtleText}>
                  Bio
                </Text>
                <Text color={textColor}>{userData.bio}</Text>
              </Box>
            )}
          </Box>
        </Flex>
      </Container>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </Box>
  );
};

export default ProfileHeader;
