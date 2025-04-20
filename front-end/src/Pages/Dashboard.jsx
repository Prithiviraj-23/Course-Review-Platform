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
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {filteredCourses.map((course) => (
              <Box
                key={course._id}
                p="5"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
                boxShadow="md"
              >
                {/* Image */}
                {course.imageUrl && (
                  <Box mb="3">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}

                {/* Title */}
                <Text fontSize="xl" fontWeight="bold" mb="1">
                  {course.title}
                </Text>

                {/* Instructor */}
                <Text fontSize="sm" color="gray.600" mb="1">
                  Instructor:{" "}
                  <strong>{course.instructor?.name || "N/A"}</strong>
                </Text>

                {/* Rating */}
                <Text fontSize="sm" color="gray.600" mb="1">
                  Rating:{" "}
                  {course.averageRating > 0 ? (
                    <>
                      {"⭐".repeat(Math.round(course.averageRating))}
                      <span> ({course.averageRating.toFixed(1)})</span>
                    </>
                  ) : (
                    "No ratings yet"
                  )}
                </Text>

                {/* Department & Difficulty */}
                <Text fontSize="sm" color="gray.600">
                  Dept: <strong>{course.department?.trim()}</strong>
                </Text>
                <Text fontSize="sm" color="gray.600" mb="2">
                  Difficulty: <strong>{course.difficulty?.trim()}</strong>
                </Text>

                {/* Tags */}
                {course.tags?.length > 0 && (
                  <Box mt="2" mb="3" display="flex" flexWrap="wrap" gap="2">
                    {course.tags.map((tag, idx) => (
                      <Box
                        key={idx}
                        px="2"
                        py="1"
                        fontSize="xs"
                        bg="blue.50"
                        borderRadius="md"
                        color="blue.700"
                        whiteSpace="nowrap"
                      >
                        {tag.trim()}
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Enroll Button */}
                <Button mt="2" colorScheme="blue" width="full">
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
