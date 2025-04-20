import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { fetchCourses } from "../features/course/courseSlice";
import Navbar from "../components/Navbar";
import { debounce } from "lodash";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch courses initially
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Set all courses to filtered list when fetched
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Filter courses with debounce
  const handleSearch = useCallback(
    debounce((query) => {
      const lowerQuery = query.toLowerCase();
      const filtered = courses.filter((course) =>
        course.title.toLowerCase().includes(lowerQuery)
      );
      setFilteredCourses(filtered);
    }, 300),
    [courses]
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <Box>
      {/* Pass props to Navbar */}
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <Box p="6">
        <Heading mb="6">Welcome, {user?.name}</Heading>
        <Heading size="lg" mb="4">
          Courses
        </Heading>

        {loading ? (
          <SimpleGrid columns={3} spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} height="200px" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={3} spacing={4}>
            {filteredCourses.map((course) => (
              <Box
                key={course.id}
                p="5"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
              >
                <Text fontSize="xl" fontWeight="bold">
                  {course.title}
                </Text>
                <Text mt="2">{course.description}</Text>
                <Button mt="4" colorScheme="blue" width="full">
                  Enroll
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
