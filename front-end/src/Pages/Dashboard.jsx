import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Skeleton,
  Button,
  Flex,
  Container,
  VStack,
  HStack,
  Icon,
  useDisclosure,
  useColorModeValue,
  Divider,
  Badge,
  Fade,
} from "@chakra-ui/react";
import {
  fetchCourses,
  fetchInstructorCourses,
} from "../features/course/courseSlice";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { debounce } from "lodash";
import ReviewModal from "../components/ReviewModal";
import PostModal from "../components/PostModal";
import { FaGraduationCap, FaPlus, FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Modal controls
  const { isOpen, onOpen, onClose } = useDisclosure(); // for review modal
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure(); // for create course modal

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");

  // Theme colors
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const sectionBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const skeletonStartColor = useColorModeValue("gray.100", "gray.700");
  const skeletonEndColor = useColorModeValue("gray.300", "gray.600");

  // Fetch courses on load
  useEffect(() => {
    if (user?.role === "instructor") {
      dispatch(fetchInstructorCourses(user._id));
    } else {
      dispatch(fetchCourses());
    }
  }, [dispatch, user]);

  // Update filtered courses when courses change
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((query) => {
      const lowerQuery = query.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerQuery) ||
          (course.description &&
            course.description.toLowerCase().includes(lowerQuery))
      );
      setFilteredCourses(filtered);
    }, 300),
    [courses]
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Review and refresh handlers
  const handleAddReview = (courseId, courseName) => {
    setSelectedCourseId(courseId);
    setSelectedCourseName(courseName);
    onOpen();
  };

  const refreshCourseData = () => {
    if (user?.role === "instructor") {
      dispatch(fetchInstructorCourses(user._id));
    } else {
      dispatch(fetchCourses());
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <Container maxW="container.xl" py={8}>
        {/* Welcome Header */}
        <Box bg={headerBg} p={6} borderRadius="xl" mb={8} boxShadow="sm">
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <VStack align={{ base: "center", md: "flex-start" }} spacing={1}>
              <HStack>
                <Icon as={FaGraduationCap} color={accentColor} boxSize={6} />
                <Heading size="lg">Welcome, {user?.name}</Heading>
              </HStack>
              <Text color="gray.600">
                {user?.role === "instructor"
                  ? "Manage your courses and reviews"
                  : "Find and review great courses"}
              </Text>
            </VStack>

            {user?.role === "instructor" && (
              <Button
                colorScheme="blue"
                size="md"
                onClick={onCreateOpen}
                leftIcon={<Icon as={FaPlus} />}
                px={6}
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
              >
                Create New Course
              </Button>
            )}
          </Flex>
        </Box>

        {/* Courses Section */}
        <Box mb={8}>
          <Flex justify="space-between" align="center" mb={5}>
            <HStack>
              <Heading size="md">
                {user?.role === "instructor"
                  ? "Your Courses"
                  : "Available Courses"}
              </Heading>
              {!loading && (
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  borderRadius="full"
                  px={2}
                >
                  {filteredCourses.length}
                </Badge>
              )}
            </HStack>

            {searchQuery && (
              <HStack spacing={2}>
                <Icon as={FaSearch} color="gray.500" />
                <Text color="gray.500" fontSize="sm">
                  {filteredCourses.length === 0
                    ? "No results found"
                    : `${filteredCourses.length} result(s) for "${searchQuery}"`}
                </Text>
              </HStack>
            )}
          </Flex>

          {loading ? (
            <Fade in={true}>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                {[...Array(6)].map((_, index) => (
                  <Skeleton
                    key={index}
                    height="320px"
                    borderRadius="lg"
                    startColor={skeletonStartColor}
                    endColor={skeletonEndColor}
                    boxShadow="sm"
                  />
                ))}
              </SimpleGrid>
            </Fade>
          ) : filteredCourses.length > 0 ? (
            <Fade in={true} transition={{ enter: { duration: 0.3 } }}>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                {filteredCourses.map((course) => (
                  <Box
                    key={course._id}
                    transform="auto"
                    _hover={{ translateY: "-4px" }}
                    transition="all 0.3s ease"
                  >
                    <CourseCard
                      course={course}
                      onAddReview={() =>
                        handleAddReview(course._id, course.title)
                      }
                      isInstructorView={user.role === "instructor"}
                      isOwnCourse={user._id === course.instructor?._id}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Fade>
          ) : (
            <Box
              p={10}
              textAlign="center"
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              bg={sectionBg}
            >
              <VStack spacing={4}>
                <Icon as={FaSearch} boxSize={10} color="gray.400" />
                <Heading size="md">No courses found</Heading>
                <Text color="gray.500">
                  {searchQuery
                    ? "Try different search terms or filters"
                    : user?.role === "instructor"
                    ? "Start by creating your first course"
                    : "Check back soon for new courses"}
                </Text>

                {user?.role === "instructor" && !searchQuery && (
                  <Button
                    colorScheme="blue"
                    mt={2}
                    onClick={onCreateOpen}
                    leftIcon={<Icon as={FaPlus} />}
                  >
                    Create First Course
                  </Button>
                )}
              </VStack>
            </Box>
          )}
        </Box>
      </Container>

      {/* Modals */}
      <ReviewModal
        isOpen={isOpen}
        onClose={onClose}
        courseId={selectedCourseId || ""}
        courseName={selectedCourseName}
        refreshCourseData={refreshCourseData}
      />

      <PostModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        refreshCourseData={refreshCourseData}
      />
    </Box>
  );
};

export default Dashboard;
