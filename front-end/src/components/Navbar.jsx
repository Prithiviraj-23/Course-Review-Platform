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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ searchQuery, onSearchChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box bg="blue.500" p="4" color="white">
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold" color="black">
          AppName
        </Text>

        {/* Search Bar */}
        <InputGroup maxWidth="400px" borderRadius="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.600" />
          </InputLeftElement>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses..."
            bg="white"
            color="gray.800"
            borderRadius="md"
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
            }}
            _hover={{
              borderColor: "blue.400",
            }}
          />
        </InputGroup>

        {/* Profile Icon with Popover */}
        <Popover placement="bottom-end" closeOnBlur={true}>
          <PopoverTrigger>
            <IconButton
              icon={
                <Avatar name={user?.name} src={user?.profileImage} size="sm" />
              }
              aria-label="User Profile"
              variant="link"
              cursor="pointer"
              _hover={{ bg: "blue.600" }}
            />
          </PopoverTrigger>
          <PopoverContent maxWidth="fit-content" padding="4">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader p="2" fontSize="sm">
              {user?.name} {/* Display user name */}
            </PopoverHeader>
            <PopoverBody p="2">
              <Text color="black" mb="2" onClick={() => navigate("/profile")}>
                Profile
              </Text>
              <Text color="black" onClick={handleLogout}>
                Logout
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Box>
  );
};

export default Navbar;
