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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/api/auth/login`,
        form
      );
      toast({ title: "Login successful!", status: "success" });
      // Store JWT token or any session information here if needed
      navigate("/dashboard"); // Navigate to a protected page after login
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Login failed",
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
          <Button colorScheme="blue" width="full" onClick={handleSubmit}>
            Login
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
