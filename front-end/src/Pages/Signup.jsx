import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Heading,
  VStack,
  useToast,
  Select,
  Flex,
  Text,
  Link,
  Divider,
  FormErrorMessage,
  useColorModeValue,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaChalkboardTeacher,
} from "react-icons/fa";

const Signup = () => {
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Hooks
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const highlightColor = useColorModeValue("blue.500", "blue.300");

  // Form handling
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    }

    if (!form.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email is invalid";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(signupUser(form));

      if (signupUser.fulfilled.match(resultAction)) {
        toast({
          title: "Account created successfully!",
          description: "You can now log in with your credentials.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        navigate("/login"); // Make sure this route exists
      } else {
        toast({
          title: "Signup failed",
          description:
            resultAction.payload || "Something went wrong. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh"
      overflow="hidden"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={{ base: 3, md: 6 }}
    >
      <Box
        w={{ base: "full", sm: "420px" }}
        maxW="md"
        p={{ base: 4, sm: 6 }}
        borderWidth="1px"
        borderRadius="xl"
        borderColor={borderColor}
        boxShadow="lg"
        bg={cardBg}
        overflow="auto"
        maxH={{ base: "90vh", md: "85vh" }}
      >
        <VStack spacing={4} align="stretch">
          <VStack spacing={1}>
            <Heading as="h1" fontSize="xl" textAlign="center">
              Create Your Account
            </Heading>
            <Text color={mutedTextColor} fontSize="sm" textAlign="center">
              Join our community to review and explore courses
            </Text>
          </VStack>
          <Divider />
          <VStack spacing={3} align="stretch">
            {/* Name Field */}
            <FormControl isInvalid={!!formErrors.name} isRequired size="sm">
              <FormLabel fontSize="xs" mb={1}>
                Full Name
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUser} color="gray.400" boxSize={3.5} />
                </InputLeftElement>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  onKeyPress={handleKeyPress}
                />
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                {formErrors.name}
              </FormErrorMessage>
            </FormControl>
            {/* Email Field */}
            <FormControl isInvalid={!!formErrors.email} isRequired size="sm">
              <FormLabel fontSize="xs" mb={1}>
                Email Address
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaEnvelope} color="gray.400" boxSize={3.5} />
                </InputLeftElement>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  onKeyPress={handleKeyPress}
                />
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                {formErrors.email}
              </FormErrorMessage>
            </FormControl>
            {/* Password Field */}
            <FormControl isInvalid={!!formErrors.password} isRequired size="sm">
              <FormLabel fontSize="xs" mb={1}>
                Password
              </FormLabel>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="gray.400" boxSize={3.5} />
                </InputLeftElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  onKeyPress={handleKeyPress}
                />
                <InputRightElement
                  cursor="pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    as={showPassword ? FaEyeSlash : FaEye}
                    color="gray.500"
                    boxSize={3.5}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                {formErrors.password}
              </FormErrorMessage>
            </FormControl>
            {/* Role Selection */}
            <FormControl isRequired size="sm">
              <FormLabel fontSize="xs" mb={1}>
                I am a:
              </FormLabel>
              <Select
                name="role"
                value={form.role}
                onChange={handleChange}
                size="sm"
                icon={
                  <Box as="span" mr={1} opacity={0.5}>
                    ▼
                  </Box>
                }
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </Select>
            </FormControl>
            {/* Role Description */}
            <Box
              p={2}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="md"
            >
              <HStack spacing={2} align="flex-start">
                <Icon
                  as={
                    form.role === "student"
                      ? FaGraduationCap
                      : FaChalkboardTeacher
                  }
                  color={highlightColor}
                  boxSize={4}
                  mt={0.5}
                />
                <Text fontSize="xs" color={mutedTextColor}>
                  {form.role === "student"
                    ? "Browse courses and leave helpful reviews."
                    : "Create courses and view student feedback."}
                </Text>
              </HStack>
            </Box>
            {/* Signup Button */}
            <Button
              colorScheme="blue"
              size="sm"
              width="full"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Creating..."
              mt={1}
              fontWeight="semibold"
              _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
              transition="all 0.2s"
            >
              Create Account
            </Button>
          </VStack>
          <Divider />
          {/* Login Link */}
          <Text fontSize="xs" textAlign="center" color={mutedTextColor}>
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to="/login" // Make sure this matches your route
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
            >
              Sign in here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
