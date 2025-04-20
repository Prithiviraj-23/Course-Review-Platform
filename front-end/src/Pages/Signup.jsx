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
import { useDispatch, useSelector } from "react-redux"; // Use dispatch and selector
import { signupUser } from "../features/auth/authSlice"; // Import signupUser action
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Get loading and error from Redux

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await dispatch(signupUser(form)); // Dispatch the signup action
      if (res.type === "auth/signupUser/fulfilled") {
        toast({ title: "Signup successful!", status: "success" });
        navigate("/login");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Signup failed",
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
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
