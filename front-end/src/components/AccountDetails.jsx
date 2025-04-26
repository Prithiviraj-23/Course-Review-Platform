import React from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Badge,
  Flex,
  Icon,
  Divider,
  List,
  ListItem,
  ListIcon,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaUserShield,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBookReader,
  FaIdCard,
  FaEnvelope,
  FaClock,
  FaUserCog,
} from "react-icons/fa";

const AccountDetails = ({ userData }) => {
  // Color scheme
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtleTextColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const badgeColor = useColorModeValue("blue.50", "blue.900");
  
  // Role-specific settings
  const getRoleIcon = (role) => {
    switch (role) {
      case "instructor":
        return FaChalkboardTeacher;
      case "student":
        return FaGraduationCap;
      default:
        return FaUserCog;
    }
  };
  
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "instructor":
        return "purple";
      case "student":
        return "blue";
      default:
        return "gray";
    }
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Account status (assuming active if we have data)
  const isAccountActive = !!userData;
  
  // Calculate account age
  const getAccountAge = () => {
    if (!userData?.createdAt) return "N/A";
    
    const createdDate = new Date(userData.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  // Get user capabilities based on role
  const getUserCapabilities = (role) => {
    switch (role) {
      case "instructor":
        return [
          "Create and manage courses",
          "View analytics for your courses",
          "Respond to student reviews",
          "Create educational content",
        ];
      case "student":
        return [
          "Enroll in courses",
          "Submit course reviews",
          "Track learning progress",
          "Interact with instructors",
        ];
      default:
        return ["Limited platform access"];
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Flex align="center" mb={4}>
        <Icon as={FaIdCard} boxSize={5} color="blue.500" mr={3} />
        <Heading size="md" color={textColor}>
          Account Details
        </Heading>
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={6}
      >
        {/* Basic Information */}
        <GridItem>
          <Box
            bg={sectionBg}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex align="center" mb={3}>
              <Icon as={FaUserShield} mr={2} color="blue.500" />
              <Text fontWeight="bold" fontSize="lg">
                Basic Information
              </Text>
            </Flex>
            <Divider mb={4} />
            
            <List spacing={3}>
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Full Name:</Text>
                  <Text fontWeight="medium">{userData?.name || "N/A"}</Text>
                </Flex>
              </ListItem>
              
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Email:</Text>
                  <Flex align="center">
                    <Icon as={FaEnvelope} mr={1} color="blue.500" fontSize="xs" />
                    <Text fontWeight="medium">{userData?.email || "N/A"}</Text>
                  </Flex>
                </Flex>
              </ListItem>
              
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Account Type:</Text>
                  <Badge
                    colorScheme={getRoleBadgeColor(userData?.role)}
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={getRoleIcon(userData?.role)} mr={1} />
                    <Text textTransform="capitalize">{userData?.role || "User"}</Text>
                  </Badge>
                </Flex>
              </ListItem>
              
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Status:</Text>
                  <Badge
                    colorScheme={isAccountActive ? "green" : "red"}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Flex align="center">
                      <Icon
                        as={isAccountActive ? FaCheckCircle : FaTimesCircle}
                        mr={1}
                      />
                      <Text>{isAccountActive ? "Active" : "Inactive"}</Text>
                    </Flex>
                  </Badge>
                </Flex>
              </ListItem>
            </List>
          </Box>
        </GridItem>

        {/* Account Timeline */}
        <GridItem>
          <Box
            bg={sectionBg}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex align="center" mb={3}>
              <Icon as={FaCalendarAlt} mr={2} color="blue.500" />
              <Text fontWeight="bold" fontSize="lg">
                Account Timeline
              </Text>
            </Flex>
            <Divider mb={4} />
            
            <List spacing={3}>
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Created:</Text>
                  <Flex align="center">
                    <Icon as={FaClock} color="blue.500" mr={1} fontSize="xs" />
                    <Text fontWeight="medium">
                      {formatDate(userData?.createdAt)}
                    </Text>
                  </Flex>
                </Flex>
              </ListItem>
              
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Last Updated:</Text>
                  <Text fontWeight="medium">
                    {formatDate(userData?.updatedAt)}
                  </Text>
                </Flex>
              </ListItem>
              
              <ListItem>
                <Flex align="center" justify="space-between">
                  <Text color={subtleTextColor}>Account Age:</Text>
                  <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                    {getAccountAge()}
                  </Badge>
                </Flex>
              </ListItem>
            </List>
          </Box>
        </GridItem>

        {/* Role Capabilities */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Box
            bg={sectionBg}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex align="center" mb={3}>
              <Icon
                as={getRoleIcon(userData?.role)}
                mr={2}
                color="blue.500"
              />
              <Text fontWeight="bold" fontSize="lg">
                {userData?.role ? `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} Capabilities` : "User Capabilities"}
              </Text>
            </Flex>
            <Divider mb={4} />
            
            <List spacing={2}>
              {getUserCapabilities(userData?.role).map((capability, index) => (
                <ListItem key={index}>
                  <Flex align="center">
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    <Text>{capability}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        </GridItem>
      </Grid>
    </VStack>
  );
};

export default AccountDetails;