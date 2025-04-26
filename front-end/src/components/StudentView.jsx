import React, { useState } from "react";
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
  useColorModeValue,
  Badge,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Button,
  Collapse,
  Tooltip,
  StatHelpText,
} from "@chakra-ui/react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaSmile,
  FaMeh,
  FaFrown,
  FaChartPie,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
} from "react-icons/fa";

const CourseAnalytics = ({ course, stats = null, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const infoIconColor = useColorModeValue("blue.500", "blue.300");

  // Extract key metrics from course and stats
  const totalReviews = stats?.totalReviews || course?.reviewCount || 0;
  const averageRating = stats?.averageRating || course?.averageRating || 0;
  
  // Has reviews check
  const hasReviews = totalReviews > 0 || averageRating > 0 || (stats?.ratingDistribution && Object.values(stats.ratingDistribution).some(v => v > 0));

  // Format rating distribution from the stats
  const ratingDistribution = React.useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (stats?.ratingDistribution) {
      Object.entries(stats.ratingDistribution).forEach(([rating, count]) => {
        const numRating = parseInt(rating);
        if (numRating >= 1 && numRating <= 5) {
          distribution[numRating] = count;
        }
      });
    }

    return distribution;
  }, [stats]);

  // Calculate sentiment metrics
  const sentimentMetrics = React.useMemo(() => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    if (stats?.sentiment) {
      positive = stats.sentiment.positive || 0;
      negative = stats.sentiment.negative || 0;
      neutral = stats.sentiment.neutral || 0;
    }
    
    const total = positive + negative + neutral || 1; // Avoid division by zero

    return {
      positive,
      negative,
      neutral,
      positivePercentage: ((positive / total) * 100).toFixed(1),
      negativePercentage: ((negative / total) * 100).toFixed(1),
      neutralPercentage: ((neutral / total) * 100).toFixed(1),
    };
  }, [stats]);

  // Calculate average sentiment
  const averageSentiment = React.useMemo(() => {
    if (!stats) return 0;

    const positive = stats.sentiment?.positive || 0;
    const negative = stats.sentiment?.negative || 0;
    const total = totalReviews || 1; // Avoid division by zero

    return (positive - negative) / total;
  }, [stats, totalReviews]);

  // Extract keywords from reviews
  const extractKeywords = React.useMemo(() => {
    return {
      positiveKeywords: stats?.keywords?.positive || ["helpful", "clear", "engaging"],
      negativeKeywords: stats?.keywords?.negative || ["difficult", "confusing"],
    };
  }, [stats]);

  if (isLoading) {
    return (
      <Card variant="outline" bg={bgColor} boxShadow="sm">
        <CardHeader>
          <Flex align="center">
            <Icon as={FaChartPie} color="purple.500" boxSize={5} mr={2} />
            <Heading size="md">Course Analytics</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex justify="center" align="center" h="200px">
            <Text fontSize="lg" color="gray.500">
              Loading course analytics...
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  if (!course) {
    return (
      <Card variant="outline" bg={bgColor} boxShadow="sm">
        <CardHeader>
          <Flex align="center">
            <Icon as={FaChartPie} color="purple.500" boxSize={5} mr={2} />
            <Heading size="md">Course Analytics</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex justify="center" align="center" h="200px">
            <Text fontSize="lg" color="gray.500">
              No course data available.
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
        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "space-between" }}
          alignItems={{ base: "center", md: "center" }}
          mb={2}
          wrap="wrap"
        >
          <HStack spacing={2} mb={{ base: 4, md: 0 }}>
            <Icon as={FaChartPie} color="purple.500" boxSize={5} />
            <Heading size="md">{course.title} Analytics</Heading>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <Icon as={isExpanded ? FaChevronUp : FaChevronDown} />
            </Button>
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
              <StatNumber fontSize="2xl">{totalReviews}</StatNumber>
            </Stat>

            <Stat textAlign="center" size="sm" minW="100px">
              <StatLabel fontSize="xs" fontWeight="medium" color="gray.500">
                Avg. Rating
              </StatLabel>
              <StatNumber fontSize="2xl">
                {hasReviews ? (
                  <Flex alignItems="center" justifyContent="center">
                    <Text mr={1}>{Number(averageRating).toFixed(1)}</Text>
                    <Icon as={FaStar} color="gold" />
                  </Flex>
                ) : (
                  "N/A"
                )}
              </StatNumber>
            </Stat>
          </HStack>
        </Flex>
      </CardHeader>

      <Collapse in={isExpanded} animateOpacity>
        <CardBody pt={4}>
          {/* Rest of component remains the same */}
          {/* Sentiment Analysis Section */}
          <Box mb={6} p={4} bg={sectionBg} borderRadius="md" boxShadow="sm">
            <Flex align="center" mb={4}>
              <Badge
                colorScheme="purple"
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="md"
              >
                SENTIMENT
              </Badge>
              <Text ml={2} fontWeight="bold" fontSize="md">
                Sentiment Analysis
              </Text>
              <Tooltip
                label="Analysis of review text to determine positive, neutral, or negative sentiment"
                placement="top"
              >
                <Icon as={FaInfoCircle} ml={2} color={infoIconColor} />
              </Tooltip>
            </Flex>

            {sentimentMetrics.positive > 0 || sentimentMetrics.negative > 0 ? (
              <>
                <Flex align="center" mb={4}>
                  <Text>Average Sentiment Score: </Text>
                  <Badge
                    ml={2}
                    colorScheme={
                      averageSentiment > 0
                        ? "green"
                        : averageSentiment < 0
                        ? "red"
                        : "gray"
                    }
                  >
                    {averageSentiment.toFixed(1)}
                  </Badge>
                  <Text ml={2}>
                    {averageSentiment > 1
                      ? "Very Positive"
                      : averageSentiment > 0
                      ? "Positive"
                      : averageSentiment < -1
                      ? "Very Negative"
                      : averageSentiment < 0
                      ? "Negative"
                      : "Neutral"}
                  </Text>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
                  <Box>
                    <Flex align="center" mb={1}>
                      <Icon as={FaSmile} color="green.500" mr={2} />
                      <Text>Positive</Text>
                      <Badge colorScheme="green" ml={2}>
                        {sentimentMetrics.positivePercentage}%
                      </Badge>
                    </Flex>
                    <Progress
                      value={sentimentMetrics.positivePercentage}
                      colorScheme="green"
                      height="8px"
                      borderRadius="full"
                    />
                  </Box>

                  <Box>
                    <Flex align="center" mb={1}>
                      <Icon as={FaMeh} color="gray.500" mr={2} />
                      <Text>Neutral</Text>
                      <Badge colorScheme="gray" ml={2}>
                        {sentimentMetrics.neutralPercentage}%
                      </Badge>
                    </Flex>
                    <Progress
                      value={sentimentMetrics.neutralPercentage}
                      colorScheme="gray"
                      height="8px"
                      borderRadius="full"
                    />
                  </Box>

                  <Box>
                    <Flex align="center" mb={1}>
                      <Icon as={FaFrown} color="red.500" mr={2} />
                      <Text>Negative</Text>
                      <Badge colorScheme="red" ml={2}>
                        {sentimentMetrics.negativePercentage}%
                      </Badge>
                    </Flex>
                    <Progress
                      value={sentimentMetrics.negativePercentage}
                      colorScheme="red"
                      height="8px"
                      borderRadius="full"
                    />
                  </Box>
                </SimpleGrid>
              </>
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                Not enough review data to perform sentiment analysis.
              </Text>
            )}
          </Box>

          {/* Rating Distribution Section */}
          <Box mb={6} p={4} bg={sectionBg} borderRadius="md" boxShadow="sm">
            <Flex align="center" mb={4}>
              <Badge
                colorScheme="orange"
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="md"
              >
                RATINGS
              </Badge>
              <Text ml={2} fontWeight="bold" fontSize="md">
                Rating Distribution
              </Text>
            </Flex>

            {hasReviews ? (
              <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating] || 0;
                  const percentage = totalReviews
                    ? ((count / totalReviews) * 100).toFixed(0)
                    : 0;
                  return (
                    <Box key={rating}>
                      <Flex align="center" mb={1} justify="space-between">
                        <Flex>
                          <Text>{rating}</Text>
                          <Icon as={FaStar} color="gold" ml={1} />
                        </Flex>
                        <Badge>{count}</Badge>
                      </Flex>
                      <Progress
                        value={percentage}
                        colorScheme={
                          rating > 3
                            ? "green"
                            : rating === 3
                            ? "yellow"
                            : "red"
                        }
                        height="8px"
                        borderRadius="full"
                      />
                    </Box>
                  );
                })}
              </SimpleGrid>
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                No rating data available yet.
              </Text>
            )}
          </Box>

          {/* Keywords Section */}
          <Box p={4} bg={sectionBg} borderRadius="md" boxShadow="sm">
            <Flex align="center" mb={4}>
              <Badge
                colorScheme="blue"
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="md"
              >
                KEYWORDS
              </Badge>
              <Text ml={2} fontWeight="bold" fontSize="md">
              Common Keywords from Reviews
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Flex align="center" mb={2}>
                  <Icon as={FaThumbsUp} color="green.500" mr={2} />
                  <Text fontWeight="medium">Positive Mentions</Text>
                </Flex>
                <Flex wrap="wrap" gap={2}>
                  {extractKeywords.positiveKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      colorScheme="green"
                      variant="subtle"
                      px={2}
                      py={1}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </Flex>
              </Box>

              <Box>
                <Flex align="center" mb={2}>
                  <Icon as={FaThumbsDown} color="red.500" mr={2} />
                  <Text fontWeight="medium">Negative Mentions</Text>
                </Flex>
                <Flex wrap="wrap" gap={2}>
                  {extractKeywords.negativeKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      colorScheme="red"
                      variant="subtle"
                      px={2}
                      py={1}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            </SimpleGrid>
          </Box>
        </CardBody>
      </Collapse>
    </Card>
  );
};

export default CourseAnalytics;