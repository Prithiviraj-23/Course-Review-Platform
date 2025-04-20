import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, SimpleGrid, Heading, Skeleton } from "@chakra-ui/react";
import { fetchCourses } from "../features/course/courseSlice";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { debounce } from "lodash";
import { useDisclosure } from "@chakra-ui/react";
import ReviewModal from "../components/ReviewModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

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

  const handleAddReview = (courseId) => {
    setSelectedCourseId(courseId);
    onOpen();
  };

  const refreshCourseData = () => {
    // Fetch updated course data after submitting review
    dispatch(fetchCourses());
  };

  return (
    <Box>
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
              <CourseCard
                key={course._id}
                course={course}
                onAddReview={handleAddReview}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
      <ReviewModal
        isOpen={isOpen}
        onClose={onClose} // Use onClose from useDisclosure
        courseId={selectedCourseId}
        refreshCourseData={refreshCourseData} // Pass refresh function
      />
    </Box>
  );
};

export default Dashboard;
