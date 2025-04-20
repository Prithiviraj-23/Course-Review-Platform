import React, { useEffect, useState, useCallback } from "react";
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
import {
  fetchCourses,
  fetchInstructorCourses,
  deleteCourse,
} from "../features/course/courseSlice";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { debounce } from "lodash";
import ReviewModal from "../components/ReviewModal";
import PostModal from "../components/PostModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure(); // for review modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure(); // for create course modal
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    if (user?.role === "instructor") {
      dispatch(fetchInstructorCourses(user._id)); // Fetch instructor's courses
    } else {
      dispatch(fetchCourses()); // Fetch all courses for students
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

  const handleAddReview = (courseId) => {
    setSelectedCourseId(courseId);
    onOpen();
  };

  const handleDeleteCourse = (courseId) => {
    // Prompt for confirmation before deleting the course

    dispatch(deleteCourse(courseId)); // Dispatch the delete action
  };

  const refreshCourseData = () => {
    if (user?.role === "instructor") {
      dispatch(fetchInstructorCourses(user._id)); // Refresh instructor's courses
    } else {
      dispatch(fetchCourses()); // Refresh all courses for students
    }
  };

  return (
    <Box>
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <Box p="6">
        <Flex justify="space-between" align="center" mb="6">
          <Heading>Welcome, {user?.name}</Heading>
          {user?.role === "instructor" && (
            <Button colorScheme="teal" onClick={onCreateOpen}>
              Add New Course
            </Button>
          )}
        </Flex>

        <Heading size="lg" mb="4">
          {user?.role === "instructor" ? "Your Courses" : "All Courses"}
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
                onAddReview={user?.role === "student" ? handleAddReview : null}
                isInstructorView={user?.role === "instructor"}
                onDelete={handleDeleteCourse} // Pass delete function to CourseCard
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Modals */}
      <ReviewModal
        isOpen={isOpen}
        onClose={onClose}
        courseId={selectedCourseId}
      />
      <PostModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        refreshCourseData={refreshCourseData} // Pass refresh function to PostModal
      />
    </Box>
  );
};

export default Dashboard;
