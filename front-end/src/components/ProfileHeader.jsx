import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  Avatar,
  Divider,
  Badge,
} from "@chakra-ui/react";

const ProfileHeader = ({ userData, onEditClick }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

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

  return (
    <Box
      bg={bgColor}
      boxShadow="xl"
      rounded="lg"
      p={6}
      overflow="hidden"
      mb={8}
    >
      <Flex direction={{ base: "column", md: "row" }} align="center">
        <Box textAlign="center" mb={{ base: 6, md: 0 }} mr={{ md: 8 }}>
          <Avatar
            size="2xl"
            name={userData?.name || "User"}
            src={userData?.avatar || ""}
            mb={4}
          />
          <Stack spacing={2}>
            <Badge colorScheme="green" fontSize="0.8em" p={1}>
              Active Account
            </Badge>
            <Badge
              colorScheme={getRoleBadgeColor(userData?.role)}
              fontSize="0.8em"
              p={1}
            >
              {userData?.role?.charAt(0).toUpperCase() +
                userData?.role?.slice(1) || "User"}
            </Badge>
          </Stack>
        </Box>

        <VStack align="start" flex={1}>
          <Heading as="h1" size="xl" color={textColor}>
            {userData?.name}
          </Heading>
          <Text color="gray.500" fontSize="lg">
            {userData?.email}
          </Text>
          <Divider my={4} />
          <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={2}>
            <Button colorScheme="blue" onClick={onEditClick}>
              Edit Profile
            </Button>
            <Button variant="outline">Change Password</Button>
          </Stack>
        </VStack>
      </Flex>
    </Box>
  );
};

export default ProfileHeader;
