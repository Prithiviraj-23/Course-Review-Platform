import React from "react";
import {
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  VStack,
  Divider,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Container,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import { FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ searchQuery, onSearchChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user =
    useSelector((state) => state.auth.user) ||
    JSON.parse(localStorage.getItem("user"));
  const { isOpen, onToggle, onClose } = useDisclosure();

  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navbarShadow = useColorModeValue(
    "0 2px 10px rgba(0,0,0,0.05)",
    "0 2px 10px rgba(0,0,0,0.2)"
  );
  const brandColor = useColorModeValue("blue.500", "blue.300");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      bg={bgColor}
      px={{ base: 4, md: 6 }}
      py={3}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow={navbarShadow}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          {/* Mobile Hamburger */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onToggle}
            icon={<HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
            mr={2}
          />

          {/* Logo and Name */}
          <Flex align="center" mr={{ base: 0, md: 8 }} cursor="pointer">
            <Icon as={FaBook} boxSize={6} color={brandColor} mr={2} />
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, blue.500, blue.600)"
              bgClip="text"
              display={{ base: "none", sm: "block" }}
            >
              CourseReviews
            </Text>
          </Flex>

          {/* Desktop Nav Links - Removed as there are no valid routes */}
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            {/* Navigation buttons removed */}
          </HStack>

          {/* Spacer */}
          <Box flex={1} ml={4} mr={4} display={{ base: "none", md: "block" }} />

          {/* Search Bar */}
          <InputGroup
            maxW={{ base: "full", md: "md" }}
            mx={{ base: 2, md: 0 }}
            flex={{ base: 1, md: "auto" }}
          >
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search courses..."
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="full"
              size="sm"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
              }}
            />
          </InputGroup>

          {/* User Profile */}
          <Menu placement="bottom-end" closeOnBlur>
            <MenuButton
              as={IconButton}
              icon={
                <Avatar
                  name={user?.name}
                  src={user?.profileImage}
                  size="sm"
                  boxShadow="sm"
                />
              }
              variant="ghost"
              ml={{ base: 2, md: 4 }}
              aria-label="User menu"
              _hover={{ bg: hoverBgColor }}
            />
            <MenuList
              zIndex={100}
              boxShadow="lg"
              borderColor={borderColor}
              p={1}
            >
              <Box px={3} py={2}>
                <Text fontWeight="medium">{user?.name}</Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {user?.email}
                </Text>
              </Box>
              <Divider my={2} />
              <MenuItem icon={<FaUser />} onClick={() => navigate("/profile")}>
                My Profile
              </MenuItem>
              {/* My Reviews and Analytics menu items removed */}
              <Divider my={2} />
              <MenuItem
                icon={<FaSignOutAlt />}
                onClick={handleLogout}
                color="red.500"
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="center">
              <Icon as={FaBook} boxSize={5} color={brandColor} mr={2} />
              <Text fontWeight="bold">CourseReviews</Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack align="stretch" spacing={0}>
              {/* Home and My Reviews buttons removed */}
              <Button
                variant="ghost"
                leftIcon={<FaUser />}
                justifyContent="flex-start"
                borderRadius={0}
                py={6}
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                Profile
              </Button>
              <Divider />
              <Button
                variant="ghost"
                leftIcon={<FaSignOutAlt />}
                justifyContent="flex-start"
                borderRadius={0}
                py={6}
                color="red.500"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
