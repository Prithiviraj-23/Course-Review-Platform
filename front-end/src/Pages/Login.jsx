import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Divider,
  useColorModeValue,
  Image,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Theme colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.700");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await dispatch(loginUser(form));
      if (res.type === "auth/loginUser/fulfilled") {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      toast({
        title: "Login failed",
        description: error || "Please check your credentials and try again.",
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
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      align="center"
      justify="center"
      p={{ base: 4, md: 8 }}
    >
      <Box
        w={{ base: "full", sm: "400px" }}
        maxW="md"
        p={{ base: 5, sm: 8 }}
        borderWidth="1px"
        borderRadius="xl"
        boxShadow="lg"
        bg={cardBg}
      >
        <VStack spacing={6} align="stretch">
          {/* Logo/Branding */}
          <Box textAlign="center" mb={2}>
            <Image
              src="/logo.png"
              alt="Course Review Logo"
              h="60px"
              mx="auto"
              fallback={
                <Box textAlign="center" p={2}>
                  <Heading as="h1" size="xl" color="blue.500">
                    CourseReviews
                  </Heading>
                </Box>
              }
            />
          </Box>

          <VStack spacing={1} align="center" mb={2}>
            <Heading
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
            >
              Welcome Back
            </Heading>
            <Text color={mutedColor} fontSize="sm">
              Please sign in to access your account
            </Text>
          </VStack>

          <Divider my={2} />

          <VStack spacing={4} align="stretch">
            {/* Email Field */}
            <FormControl isInvalid={!!formErrors.email} isRequired>
              <FormLabel fontSize="sm">Email Address</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaEnvelope color="gray.300" />
                </InputLeftElement>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  borderRadius="md"
                  onKeyPress={handleKeyPress}
                />
              </InputGroup>
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            </FormControl>

            {/* Password Field */}
            <FormControl isInvalid={!!formErrors.password} isRequired>
              <Flex justify="space-between" align="center">
                <FormLabel fontSize="sm" mb={1}>
                  Password
                </FormLabel>
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  fontSize="xs"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot Password?
                </Link>
              </Flex>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaLock color="gray.300" />
                </InputLeftElement>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  borderRadius="md"
                  onKeyPress={handleKeyPress}
                />
                <InputRightElement
                  cursor="pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash color="gray.500" />
                  ) : (
                    <FaEye color="gray.500" />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
            </FormControl>

            {/* Login Button */}
            <Button
              colorScheme="blue"
              size="md"
              width="full"
              onClick={handleSubmit}
              isLoading={loading}
              mt={2}
              fontWeight="bold"
              _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
              transition="all 0.2s"
              loadingText="Signing in..."
            >
              Sign In
            </Button>
          </VStack>

          <Divider my={2} />

          {/* Registration Link */}
          <Text fontSize="sm" textAlign="center" color={mutedColor}>
            Don't have an account?{" "}
            <Link
              as={RouterLink}
              to="/signup"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
            >
              Create account
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
