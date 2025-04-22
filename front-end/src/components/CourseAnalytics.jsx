import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  Divider,
  useColorModeValue,
  Badge,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Icon,
} from "@chakra-ui/react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaSmile,
  FaMeh,
  FaFrown,
  FaChartPie,
} from "react-icons/fa";

const CourseAnalytics = ({ analytics, reviews }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");

  // Calculate sentiment-based metrics if reviews are provided
  const sentimentMetrics = React.useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        positive: 0,
        negative: 0,
        neutral: 0,
        positivePercentage: 0,
        negativePercentage: 0,
        neutralPercentage: 0,
      };
    }

    const positive = reviews.filter((review) => review.sentiment > 0).length;
    const negative = reviews.filter((review) => review.sentiment < 0).length;
    const neutral = reviews.filter((review) => review.sentiment === 0).length;
    const total = reviews.length;
    console.log(positive);
    return {
      positive,
      negative,
      neutral,
      positivePercentage: ((positive / total) * 100).toFixed(1),
      negativePercentage: ((negative / total) * 100).toFixed(1),
      neutralPercentage: ((neutral / total) * 100).toFixed(1),
    };
  }, [reviews]);

  if (!analytics) {
    return (
      <Card variant="outline" bg={bgColor} boxShadow="sm">
        <CardBody p={6}>
          <Flex justify="center" align="center" h="200px">
            <Text fontSize="lg" color="gray.500">
              No analytics data available yet.
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      variant="outline"
      bg={bgColor}
      boxShadow="md"
      borderColor={borderColor}
    >
      <CardHeader pb={0}>
        {/* Header with Analytics Title, Total Reviews and Rating */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "space-between" }}
          alignItems={{ base: "center", md: "center" }}
          mb={2}
          wrap="wrap"
        >
          <HStack spacing={2} mb={{ base: 4, md: 0 }}>
            <Icon as={FaChartPie} color="purple.500" boxSize={5} />
            <Heading size="md">Review Analytics</Heading>
          </HStack>

          <HStack
            spacing={{ base: 4, md: 8 }}
            bg={sectionBg}
            p={3}
            borderRadius="md"
            shadow="sm"
          >
            <Stat textAlign="center" size="sm" minW="100px">
              <StatLabel fontSize="xs" fontWeight="medium" color="gray.500">
                Total Reviews
              </StatLabel>
              <StatNumber fontSize="2xl">{analytics.totalReviews}</StatNumber>
            </Stat>

            <Stat textAlign="center" size="sm" minW="100px">
              <StatLabel fontSize="xs" fontWeight="medium" color="gray.500">
                Avg. Rating
              </StatLabel>
              <StatNumber fontSize="2xl">
                {analytics.totalReviews ? (
                  <Flex alignItems="center" justifyContent="center">
                    <Text mr={1}>{analytics.averageRating.toFixed(1)}</Text>
                    <FaStar color="gold" />
                  </Flex>
                ) : (
                  "N/A"
                )}
              </StatNumber>
            </Stat>
          </HStack>
        </Flex>
      </CardHeader>

      <CardBody pt={4}>
        {/* Sentiment-based metrics */}
        <Box mb={6} p={4} bg={sectionBg} borderRadius="md" boxShadow="sm">
          <Flex align="center" mb={4}>
            <Badge
              colorScheme="purple"
              fontSize="0.8em"
              px={2}
              py={1}
              borderRadius="md"
            >
              NEW
            </Badge>
            <Text ml={2} fontWeight="bold" fontSize="md">
              Sentiment Analysis
            </Text>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={4}>
            <Flex
              align="center"
              p={2}
              bg={bgColor}
              borderRadius="md"
              boxShadow="xs"
            >
              <Box color="green.500" mr={3} fontSize="1.8em">
                <FaSmile />
              </Box>
              <Box>
                <Text fontWeight="bold">Positive</Text>
                <Text>
                  {sentimentMetrics.positive} reviews (
                  {sentimentMetrics.positivePercentage}%)
                </Text>
              </Box>
            </Flex>

            <Flex
              align="center"
              p={2}
              bg={bgColor}
              borderRadius="md"
              boxShadow="xs"
            >
              <Box color="gray.500" mr={3} fontSize="1.8em">
                <FaMeh />
              </Box>
              <Box>
                <Text fontWeight="bold">Neutral</Text>
                <Text>
                  {sentimentMetrics.neutral} reviews (
                  {sentimentMetrics.neutralPercentage}%)
                </Text>
              </Box>
            </Flex>

            <Flex
              align="center"
              p={2}
              bg={bgColor}
              borderRadius="md"
              boxShadow="xs"
            >
              <Box color="red.500" mr={3} fontSize="1.8em">
                <FaFrown />
              </Box>
              <Box>
                <Text fontWeight="bold">Negative</Text>
                <Text>
                  {sentimentMetrics.negative} reviews (
                  {sentimentMetrics.negativePercentage}%)
                </Text>
              </Box>
            </Flex>
          </SimpleGrid>

          {/* Sentiment progress bar */}
          <Box mt={4} px={2}>
            <Flex>
              <Progress
                value={sentimentMetrics.positivePercentage}
                colorScheme="green"
                size="md"
                flex={sentimentMetrics.positive || 0.5}
                borderLeftRadius="md"
                borderRightRadius={
                  sentimentMetrics.neutral === 0 &&
                  sentimentMetrics.negative === 0
                    ? "md"
                    : "none"
                }
                mr={
                  sentimentMetrics.neutral > 0 || sentimentMetrics.negative > 0
                    ? "1px"
                    : 0
                }
              />
              {sentimentMetrics.neutral > 0 && (
                <Progress
                  value={sentimentMetrics.neutralPercentage}
                  colorScheme="gray"
                  size="md"
                  flex={sentimentMetrics.neutral}
                  borderRadius={
                    sentimentMetrics.positive === 0
                      ? "md 0 0 md"
                      : sentimentMetrics.negative === 0
                      ? "0 md md 0"
                      : "none"
                  }
                  mr={sentimentMetrics.negative > 0 ? "1px" : 0}
                />
              )}
              {sentimentMetrics.negative > 0 && (
                <Progress
                  value={sentimentMetrics.negativePercentage}
                  colorScheme="red"
                  size="md"
                  flex={sentimentMetrics.negative || 0.5}
                  borderLeftRadius={
                    sentimentMetrics.positive === 0 &&
                    sentimentMetrics.neutral === 0
                      ? "md"
                      : "none"
                  }
                  borderRightRadius="md"
                />
              )}
            </Flex>
            <Flex justify="space-between" mt={2}>
              <Text fontSize="xs" fontWeight="medium">
                Positive
              </Text>
              <Text fontSize="xs" fontWeight="medium">
                Negative
              </Text>
            </Flex>
          </Box>
        </Box>

        {/* Rating distribution */}
        <Box mb={6} p={4} bg={sectionBg} borderRadius="md" boxShadow="sm">
          <Flex align="center" mb={4}>
            <Icon as={FaStar} color="gold" mr={2} />
            <Text fontWeight="bold" fontSize="md">
              Rating Distribution
            </Text>
          </Flex>

          {[5, 4, 3, 2, 1].map((rating) => (
            <Box key={rating} mb={3}>
              <Flex align="center" mb={1}>
                <Text width="15px" mr={3} fontWeight="bold">
                  {rating}
                </Text>
                <Progress
                  value={
                    analytics.totalReviews
                      ? ((analytics.ratingDistribution[rating] || 0) /
                          analytics.totalReviews) *
                        100
                      : 0
                  }
                  colorScheme={
                    rating > 3 ? "green" : rating === 3 ? "yellow" : "red"
                  }
                  size="md"
                  width="100%"
                  borderRadius="md"
                />
                <Text ml={3} width="40px" textAlign="right">
                  {analytics.ratingDistribution[rating] || 0}
                </Text>
              </Flex>
            </Box>
          ))}
        </Box>

        {/* Common Feedback Themes */}
        {(analytics.topPositiveKeywords?.length > 0 ||
          analytics.topNegativeKeywords?.length > 0) && (
          <Box p={4} bg={sectionBg} borderRadius="md" boxShadow="sm">
            <Heading size="sm" mb={4}>
              Common Feedback Themes
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Flex
                align="flex-start"
                bg={bgColor}
                p={3}
                borderRadius="md"
                boxShadow="xs"
              >
                <Box color="green.500" mr={3} mt={1}>
                  <Icon as={FaThumbsUp} />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Positive Feedback
                  </Text>
                  <Text>
                    {analytics.topPositiveKeywords?.length > 0
                      ? analytics.topPositiveKeywords.join(", ")
                      : "No positive keywords found"}
                  </Text>
                </Box>
              </Flex>

              <Flex
                align="flex-start"
                bg={bgColor}
                p={3}
                borderRadius="md"
                boxShadow="xs"
              >
                <Box color="red.500" mr={3} mt={1}>
                  <Icon as={FaThumbsDown} />
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={1}>
                    Negative Feedback
                  </Text>
                  <Text>
                    {analytics.topNegativeKeywords?.length > 0
                      ? analytics.topNegativeKeywords.join(", ")
                      : "No negative keywords found"}
                  </Text>
                </Box>
              </Flex>
            </SimpleGrid>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default CourseAnalytics;
