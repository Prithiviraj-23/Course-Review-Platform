import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Button,
  SimpleGrid,
  Skeleton,
  Text,
  Heading,
  Flex,
  Icon,
  HStack,
  VStack,
  Badge,
  Tag,
  TagLeftIcon,
  TagLabel,
  useColorModeValue,
  Fade,
  InputGroup,
  Input,
  InputRightElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Tooltip,
  useDisclosure,
  IconButton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  FaStar,
  FaCalendarAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUpAlt,
  FaChevronDown,
  FaEdit,
  FaBookOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReviewModal from "./ReviewModal";
import CourseCard from "./CourseCard";

const StudentView = ({ userReviews, loading, fetchUserContent }) => {
  const navigate = useNavigate();
  const { isOpen: isVisible, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  // Review state
  const [reviewCourseId, setReviewCourseId] = useState(null);
  const [reviewCourseName, setReviewCourseName] = useState("");
  const [currentReview, setCurrentReview] = useState(null);

  // Filter and sort state
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [hasError, setHasError] = useState(false);

  // Theme colors
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const subtleColor = useColorModeValue("gray.600", "gray.400");
  const reviewSummaryBg = useColorModeValue("gray.50", "gray.750");
  const skeletonStartColor = useColorModeValue("gray.50", "gray.700");
  const skeletonEndColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  // Process and filter reviews
  useEffect(() => {
    try {
      if (Array.isArray(userReviews)) {
        let processed = userReviews.map((course) => ({
          ...course,
          averageRating:
            typeof course.averageRating === "number" ? course.averageRating : 0,
        }));

        // Apply search filter if needed
        if (searchTerm.trim() !== "") {
          const term = searchTerm.toLowerCase();
          processed = processed.filter(
            (course) =>
              (course.title && course.title.toLowerCase().includes(term)) ||
              (course.description &&
                course.description.toLowerCase().includes(term)) ||
              (course.review?.comment &&
                course.review.comment.toLowerCase().includes(term))
          );
        }

        // Apply sorting
        switch (sortBy) {
          case "recent":
            processed.sort(
              (a, b) =>
                new Date(b.review?.createdAt || 0) -
                new Date(a.review?.createdAt || 0)
            );
            break;
          case "highest":
            processed.sort((a, b) => b.averageRating - a.averageRating);
            break;
          case "lowest":
            processed.sort((a, b) => a.averageRating - b.averageRating);
            break;
          default:
            break;
        }

        setFilteredReviews(processed);
        setHasError(false);
      }
    } catch (error) {
      console.error("Error processing reviews:", error);
      setHasError(true);
    }
  }, [userReviews, searchTerm, sortBy]);

  // Handle adding/editing reviews
  const handleAddReview = (courseId, courseName, existingReview = null) => {
    setReviewCourseId(courseId);
    setReviewCourseName(courseName);
    setCurrentReview(existingReview);
  };

  // Get the rating label based on value
  const getRatingLabel = (rating) => {
    if (rating >= 4) return "Recommended";
    if (rating >= 3) return "Good";
    return "Needs Improvement";
  };

  // Get color scheme based on rating
  const getRatingColorScheme = (rating) => {
    if (rating >= 4) return "green";
    if (rating >= 3) return "yellow";
    return "red";
  };

  // Handle review modal close
  const handleCloseModal = () => {
    setReviewCourseId(null);
    setCurrentReview(null);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("recent");
  };

  return (
    <Container maxW="container.xl" py={6} px={{ base: 4, md: 6 }}>
      {/* Header Section */}
      <Box
        bg={headerBg}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        mb={6}
        boxShadow="sm"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
          justify="space-between"
          wrap="wrap"
          gap={4}
        >
          <Box>
            <HStack spacing={2} mb={1}>
              <Icon as={FaStar} color={iconColor} boxSize={6} />
              <Heading as="h2" size="lg">
                My Course Reviews
              </Heading>
              {!loading && (
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  borderRadius="full"
                  px={2}
                >
                  {filteredReviews.length}
                </Badge>
              )}
            </HStack>
            <Text color={subtleColor}>
              Track and manage your course feedback
            </Text>
          </Box>

          <Flex gap={3} wrap="wrap">
            <Button
              leftIcon={<FaBookOpen />}
              colorScheme="blue"
              variant="solid"
              onClick={() => navigate("/dashboard")}
              size="md"
            >
              Browse Courses
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Search and Filter Section */}
      {!loading && filteredReviews.length > 0 && (
        <Flex
          mb={6}
          gap={4}
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
        >
          {/* Search Input */}
          <InputGroup maxW={{ base: "full", md: "320px" }}>
            <Input
              placeholder="Search your reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
              borderRadius="md"
            />
            <InputRightElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputRightElement>
          </InputGroup>

          {/* Sort Options */}
          <HStack spacing={2}>
            <Text
              fontSize="sm"
              color={subtleColor}
              display={{ base: "none", md: "block" }}
            >
              Sort by:
            </Text>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="md"
              maxW="180px"
              bg={cardBg}
              borderRadius="md"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </Select>

            {(searchTerm || sortBy !== "recent") && (
              <Tooltip label="Reset filters">
                <IconButton
                  icon={<Icon as={FaFilter} />}
                  onClick={resetFilters}
                  variant="ghost"
                  colorScheme="blue"
                  aria-label="Reset filters"
                />
              </Tooltip>
            )}
          </HStack>
        </Flex>
      )}

      {/* Error State */}
      {hasError && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          There was an error processing your reviews. Please refresh the page.
        </Alert>
      )}

      {/* Content Section */}
      <Box>
        {loading ? (
          <Fade in={true}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  height="360px"
                  borderRadius="lg"
                  startColor={skeletonStartColor}
                  endColor={skeletonEndColor}
                  boxShadow="md"
                >
                  <Box h="full" />
                </Skeleton>
              ))}
            </SimpleGrid>
          </Fade>
        ) : filteredReviews.length > 0 ? (
          <Fade in={isVisible} transition={{ enter: { duration: 0.5 } }}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredReviews.map((course, index) => (
                <Box
                  key={course._id || index}
                  transform="auto"
                  _hover={{ translateY: "-4px" }}
                  transition="all 0.3s ease"
                  boxShadow="md"
                  borderRadius="lg"
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor={borderColor}
                  bg={cardBg}
                >
                  <CourseCard
                    course={course}
                    onAddReview={() =>
                      handleAddReview(course._id, course.title)
                    }
                    isInstructorView={false}
                    isOwnCourse={false}
                  />

                  <Box
                    p={4}
                    borderTop="1px solid"
                    borderColor={borderColor}
                    bg={reviewSummaryBg}
                  >
                    <HStack justify="space-between" mb={2}>
                      <HStack spacing={1}>
                        <Icon
                          as={FaStar}
                          color={
                            (course.averageRating || 0) >= 4
                              ? "yellow.400"
                              : (course.averageRating || 0) >= 3
                              ? "orange.400"
                              : "red.400"
                          }
                        />
                        <Text fontWeight="bold">
                          {course.averageRating !== undefined
                            ? course.averageRating.toFixed(1)
                            : "0.0"}
                        </Text>
                        <Text fontSize="sm" color={subtleColor}>
                          • Your rating
                        </Text>
                      </HStack>
                      <Tag
                        size="sm"
                        colorScheme={getRatingColorScheme(
                          course.averageRating || 0
                        )}
                        borderRadius="full"
                      >
                        <TagLeftIcon
                          as={
                            (course.averageRating || 0) >= 3
                              ? FaThumbsUp
                              : FaThumbsDown
                          }
                        />
                        <TagLabel>
                          {getRatingLabel(course.averageRating || 0)}
                        </TagLabel>
                      </Tag>
                    </HStack>

                    <Text fontSize="sm" noOfLines={2} color={subtleColor}>
                      {course.review?.comment || "No comment provided"}
                    </Text>

                    <Flex justify="space-between" align="center" mt={3}>
                      <Tooltip label="Edit your review">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<FaEdit />}
                          onClick={() =>
                            handleAddReview(
                              course._id,
                              course.title,
                              course.review
                            )
                          }
                        >
                          Edit Review
                        </Button>
                      </Tooltip>
                      <HStack spacing={1}>
                        <Icon
                          as={FaCalendarAlt}
                          fontSize="xs"
                          color="gray.500"
                        />
                        <Text fontSize="xs" color="gray.500">
                          {course.review?.createdAt
                            ? new Date(
                                course.review.createdAt
                              ).toLocaleDateString()
                            : "No date"}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Fade>
        ) : searchTerm ? (
          // Empty search results state
          <Box
            p={8}
            textAlign="center"
            borderWidth="1px"
            borderRadius="lg"
            bg={emptyStateBg}
          >
            <VStack spacing={4}>
              <Icon as={FaSearch} boxSize={10} color="gray.400" />
              <Heading size="md">No Matching Reviews</Heading>
              <Text>No reviews match your search criteria</Text>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            </VStack>
          </Box>
        ) : (
          // Empty state (no reviews)
          <Box
            p={8}
            textAlign="center"
            borderWidth="1px"
            borderRadius="lg"
            bg={emptyStateBg}
          >
            <VStack spacing={4}>
              <Icon as={FaStar} boxSize={10} color="blue.400" opacity={0.7} />
              <Heading size="md">No Reviews Found</Heading>
              <Text>You haven't reviewed any courses yet</Text>
              <Button
                colorScheme="blue"
                onClick={() => navigate("/dashboard")}
                leftIcon={<FaBookOpen />}
              >
                Browse Courses
              </Button>
            </VStack>
          </Box>
        )}
      </Box>

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!reviewCourseId}
        onClose={handleCloseModal}
        courseId={reviewCourseId || ""}
        courseName={reviewCourseName}
        existingReview={currentReview}
        refreshCourseData={fetchUserContent}
      />
    </Container>
  );
};

export default StudentView;
