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
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Use dispatch and selector
import { loginUser } from "../features/auth/authSlice"; // Import loginUser action
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Get loading and error from Redux

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await dispatch(loginUser(form)); // Dispatch the login action
      if (res.type === "auth/loginUser/fulfilled") {
        toast({ title: "Login successful!", status: "success" });
        navigate("/dashboard"); // Navigate to a protected page after login
      }
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Login failed",
        status: "error",
      });
    }
  };

  return (
    <Flex align="center" justify="center" minH="100vh" bg="gray.50" p="4">
      <Box
        maxW="md"
        w="100%"
        p="6"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
      >
        <Heading mb="6" textAlign="center">
          Login
        </Heading>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
