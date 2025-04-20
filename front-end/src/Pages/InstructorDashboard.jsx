import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  SimpleGrid,
  Heading,
  Skeleton,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { fetchInstructorCourses } from "../features/course/courseSlice"; // You need to implement this thunk
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { debounce } from "lodash";
// import CreateCourseModal from "../components/CreateCourseModal"; // Create this component
// import EditCourseModal from "../components/EditCourseModal"; // Create this component (optional for now)

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  useEffect(() => {
    if (user?.role === "instructor") {
      dispatch(fetchInstructorCourses(user._id)); // Backend should support filtering by instructorId
    }
  }, [dispatch, user]);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

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
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <Box p="6">
        <Flex justify="space-between" align="center" mb="6">
          <Heading>Welcome, {user?.name}</Heading>
          <Button colorScheme="teal" onClick={onCreateOpen}>
            Add New Course
          </Button>
        </Flex>

        <Heading size="lg" mb="4">
          Your Courses
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
              <CourseCard
                key={course._id}
                course={course}
                isInstructorView={true} // Optional flag to show Edit/Delete buttons
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Create Course Modal */}
      {/* <CreateCourseModal isOpen={isCreateOpen} onClose={onCreateClose} /> */}
    </Box>
  );
};

export default InstructorDashboard;
