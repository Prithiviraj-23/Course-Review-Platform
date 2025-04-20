import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/api/auth/signup`,
        form
      );
      toast({ title: "Signup successful!", status: "success" });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Signup failed",
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
          Sign Up
        </Heading>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
          </FormControl>
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
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </Select>
          </FormControl>
          <Button colorScheme="blue" width="full" onClick={handleSubmit}>
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
