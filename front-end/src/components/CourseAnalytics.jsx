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
  Skeleton,
  SkeletonText,
  useToken,
  Divider,
  ScaleFade,
  SlideFade,
  chakra,
} from "@chakra-ui/react";
import {
  FaStar,
  FaSmile,
  FaMeh,
  FaFrown,
  FaChartPie,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";

const CourseAnalytics = ({ course, stats = null, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Enhanced color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const infoIconColor = useColorModeValue("blue.500", "blue.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const highlightColor = useColorModeValue("blue.50", "blue.900");

  // Get token colors for progress gradients
  const [green300, green500, yellow300, yellow500, red300, red500] = useToken(
    "colors",
    ["green.300", "green.500", "yellow.300", "yellow.500", "red.300", "red.500"]
  );

  // Extract key metrics from course and stats
  const totalReviews = stats?.totalReviews || course?.reviewCount || 0;
  const averageRating = stats?.averageRating || course?.averageRating || 0;

  // Has reviews check
  const hasReviews =
    totalReviews > 0 ||
    averageRating > 0 ||
    (stats?.ratingDistribution &&
      Object.values(stats.ratingDistribution).some((v) => v > 0));

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

  // Get sentiment label based on score
  const getSentimentLabel = (score) => {
    if (score > 1) return "Very Positive";
    if (score > 0) return "Positive";
    if (score < -1) return "Very Negative";
    if (score < 0) return "Negative";
    return "Neutral";
  };

  // Get sentiment color based on score
  const getSentimentColor = (score) => {
    if (score > 1) return "green.600";
    if (score > 0) return "green.400";
    if (score < -1) return "red.600";
    if (score < 0) return "red.400";
    return "gray.500";
  };

  if (isLoading) {
    return (
      <Card
        variant="outline"
        bg={bgColor}
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
      >
        <CardHeader bg={highlightColor} pb={4}>
          <Flex align="center">
            <SkeletonText noOfLines={1} width="200px" />
          </Flex>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            <Skeleton height="100px" borderRadius="md" />
            <Skeleton height="100px" borderRadius="md" />
          </SimpleGrid>
          <Skeleton height="150px" borderRadius="md" mb={6} />
          <Skeleton height="150px" borderRadius="md" />
        </CardBody>
      </Card>
    );
  }

  if (!course) {
    return (
      <Card variant="outline" bg={bgColor} boxShadow="md" borderRadius="lg">
        <CardHeader pb={0}>
          <Flex align="center">
            <Icon as={FaChartPie} color="blue.500" boxSize={6} mr={3} />
            <Heading size="md">Course Analytics</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={10}
            px={6}
            textAlign="center"
          >
            <Icon as={FaChartLine} boxSize={12} color="gray.300" mb={4} />
            <Heading as="h3" size="md" mb={2} color={subTextColor}>
              No Course Selected
            </Heading>
            <Text color={subTextColor}>
              Select a course to view detailed analytics
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <ScaleFade in={true} initialScale={0.95}>
      <Card
        variant="outline"
        bg={bgColor}
        boxShadow="lg"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.2s ease"
        _hover={{ boxShadow: "xl" }}
      >
        <CardHeader
          pb={0}
          bg={highlightColor}
          borderBottomWidth={isExpanded ? "1px" : "0"}
          borderBottomColor={borderColor}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent={{ base: "center", md: "space-between" }}
            alignItems={{ base: "center", md: "center" }}
            wrap="wrap"
            py={2}
          >
            <HStack spacing={3} mb={{ base: 4, md: 0 }} alignItems="center">
              <Icon as={FaChartPie} color="blue.500" boxSize={6} />
              <Heading size="md" color={headingColor}>
                {course.title}
              </Heading>
              <Badge
                colorScheme="blue"
                variant="subtle"
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="md"
              >
                Analytics
              </Badge>
            </HStack>

            <HStack
              spacing={{ base: 4, md: 8 }}
              bg={sectionBg}
              p={4}
              borderRadius="lg"
              shadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stat textAlign="center" size="md" minW="120px">
                <StatLabel
                  fontSize="xs"
                  fontWeight="semibold"
                  color={subTextColor}
                >
                  Total Reviews
                </StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold">
                  {totalReviews}
                </StatNumber>
              </Stat>

              <Stat textAlign="center" size="md" minW="120px">
                <StatLabel
                  fontSize="xs"
                  fontWeight="semibold"
                  color={subTextColor}
                >
                  Avg. Rating
                </StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold">
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

          <Flex
            justify="center"
            mt={4}
            borderTopWidth="1px"
            borderTopColor={borderColor}
          >
            <Button
              size="sm"
              variant="ghost"
              width="100%"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse" : "Expand"}
              leftIcon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              fontWeight="medium"
              color={subTextColor}
              _hover={{ bg: "transparent", color: "blue.500" }}
              transition="all 0.2s"
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </Button>
          </Flex>
        </CardHeader>

        <Collapse in={isExpanded} animateOpacity>
          <CardBody pt={6} pb={8} px={{ base: 4, md: 6 }}>
            {/* Sentiment Analysis Section */}
            <SlideFade in={isExpanded} offsetY="20px">
              <Box
                mb={6}
                p={5}
                bg={sectionBg}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex align="center" mb={5} justify="space-between" wrap="wrap">
                  <Flex align="center">
                    <Icon as={FaSmile} mr={3} fontSize="xl" color="blue.500" />
                    <Heading size="md" color={headingColor}>
                      Sentiment Analysis
                    </Heading>
                  </Flex>
                  <Tooltip
                    label="Analysis of review text to determine positive, neutral, or negative sentiment"
                    placement="top"
                    hasArrow
                  >
                    <Flex
                      align="center"
                      bg={highlightColor}
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                    >
                      <Icon as={FaInfoCircle} mr={1} color={infoIconColor} />
                      <Text>What is this?</Text>
                    </Flex>
                  </Tooltip>
                </Flex>

                {sentimentMetrics.positive > 0 ||
                sentimentMetrics.negative > 0 ? (
                  <>
                    <Flex
                      align="center"
                      mb={5}
                      p={4}
                      borderRadius="md"
                      bg={useColorModeValue("white", "gray.800")}
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Text fontWeight="medium" mr={3}>
                        Overall Sentiment:
                      </Text>
                      <Badge
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontWeight="bold"
                        color={getSentimentColor(averageSentiment)}
                        bg={useColorModeValue(
                          `${
                            getSentimentColor(averageSentiment).split(".")[0]
                          }.50`,
                          `${
                            getSentimentColor(averageSentiment).split(".")[0]
                          }.900`
                        )}
                      >
                        {getSentimentLabel(averageSentiment)}
                      </Badge>
                      <Text ml={3} color={subTextColor}>
                        Score: {averageSentiment.toFixed(1)}
                      </Text>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                      <Box>
                        <Flex align="center" mb={2} justify="space-between">
                          <Flex align="center">
                            <Icon
                              as={FaSmile}
                              color="green.500"
                              mr={2}
                              boxSize={5}
                            />
                            <Text fontWeight="semibold">Positive</Text>
                          </Flex>
                          <Badge
                            colorScheme="green"
                            fontSize="md"
                            px={2}
                            borderRadius="md"
                          >
                            {sentimentMetrics.positivePercentage}%
                          </Badge>
                        </Flex>
                        <Progress
                          value={sentimentMetrics.positivePercentage}
                          sx={{
                            "& > div": {
                              background: `linear-gradient(90deg, ${green300} 0%, ${green500} 100%)`,
                            },
                          }}
                          height="12px"
                          borderRadius="full"
                          hasStripe
                          isAnimated
                        />
                      </Box>

                      <Box>
                        <Flex align="center" mb={2} justify="space-between">
                          <Flex align="center">
                            <Icon
                              as={FaMeh}
                              color="gray.500"
                              mr={2}
                              boxSize={5}
                            />
                            <Text fontWeight="semibold">Neutral</Text>
                          </Flex>
                          <Badge
                            colorScheme="gray"
                            fontSize="md"
                            px={2}
                            borderRadius="md"
                          >
                            {sentimentMetrics.neutralPercentage}%
                          </Badge>
                        </Flex>
                        <Progress
                          value={sentimentMetrics.neutralPercentage}
                          colorScheme="gray"
                          height="12px"
                          borderRadius="full"
                          hasStripe
                          isAnimated
                        />
                      </Box>

                      <Box>
                        <Flex align="center" mb={2} justify="space-between">
                          <Flex align="center">
                            <Icon
                              as={FaFrown}
                              color="red.500"
                              mr={2}
                              boxSize={5}
                            />
                            <Text fontWeight="semibold">Negative</Text>
                          </Flex>
                          <Badge
                            colorScheme="red"
                            fontSize="md"
                            px={2}
                            borderRadius="md"
                          >
                            {sentimentMetrics.negativePercentage}%
                          </Badge>
                        </Flex>
                        <Progress
                          value={sentimentMetrics.negativePercentage}
                          sx={{
                            "& > div": {
                              background: `linear-gradient(90deg, ${red300} 0%, ${red500} 100%)`,
                            },
                          }}
                          height="12px"
                          borderRadius="full"
                          hasStripe
                          isAnimated
                        />
                      </Box>
                    </SimpleGrid>
                  </>
                ) : (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    py={10}
                    textAlign="center"
                    bg={useColorModeValue("white", "gray.800")}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <Icon as={FaMeh} boxSize={12} color="gray.300" mb={4} />
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      color={subTextColor}
                    >
                      Not enough review data to perform sentiment analysis
                    </Text>
                    <Text fontSize="sm" color={subTextColor} mt={2}>
                      Sentiment analysis requires multiple reviews with text
                      content
                    </Text>
                  </Flex>
                )}
              </Box>
            </SlideFade>

            {/* Rating Distribution Section */}
            <SlideFade in={isExpanded} offsetY="20px" delay={0.1}>
              <Box
                p={5}
                bg={sectionBg}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Flex align="center" mb={5}>
                  <Icon
                    as={FaChartBar}
                    mr={3}
                    fontSize="xl"
                    color="orange.500"
                  />
                  <Heading size="md" color={headingColor}>
                    Rating Distribution
                  </Heading>
                </Flex>

                {hasReviews ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 5 }}
                    spacing={5}
                    alignItems="end"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingDistribution[rating] || 0;
                      const percentage = totalReviews
                        ? ((count / totalReviews) * 100).toFixed(0)
                        : 0;

                      // Determine color and gradient based on rating
                      let startColor, endColor;
                      if (rating > 3) {
                        startColor = green300;
                        endColor = green500;
                      } else if (rating === 3) {
                        startColor = yellow300;
                        endColor = yellow500;
                      } else {
                        startColor = red300;
                        endColor = red500;
                      }

                      return (
                        <Box
                          key={rating}
                          bg={useColorModeValue("white", "gray.800")}
                          p={3}
                          borderRadius="md"
                          boxShadow="sm"
                        >
                          <Flex align="center" mb={2} justify="space-between">
                            <Flex align="center">
                              <Text fontWeight="bold" fontSize="lg" mr={1}>
                                {rating}
                              </Text>
                              <Icon as={FaStar} color="gold" />
                            </Flex>
                            <chakra.span
                              px={2}
                              py={1}
                              borderRadius="md"
                              fontWeight="bold"
                              fontSize="sm"
                              bg={useColorModeValue("gray.100", "gray.700")}
                            >
                              {count}
                            </chakra.span>
                          </Flex>
                          <Box position="relative" h="100px" mt={2}>
                            <Progress
                              value={percentage}
                              sx={{
                                "& > div": {
                                  background: `linear-gradient(to top, ${startColor} 0%, ${endColor} 100%)`,
                                },
                              }}
                              height={`${Math.max(percentage, 5)}%`}
                              width="100%"
                              borderRadius="md"
                              position="absolute"
                              bottom="0"
                              transition="height 0.3s ease"
                              hasStripe={percentage > 0}
                            />
                            <Flex
                              position="absolute"
                              bottom="0"
                              left="0"
                              right="0"
                              justify="center"
                              pb={1}
                            >
                              <Badge
                                colorScheme={
                                  rating > 3
                                    ? "green"
                                    : rating === 3
                                    ? "yellow"
                                    : "red"
                                }
                                fontSize="sm"
                                px={2}
                                py={0}
                              >
                                {percentage}%
                              </Badge>
                            </Flex>
                          </Box>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                ) : (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    py={10}
                    textAlign="center"
                    bg={useColorModeValue("white", "gray.800")}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <Icon
                      as={FaChartBar}
                      boxSize={12}
                      color="gray.300"
                      mb={4}
                    />
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      color={subTextColor}
                    >
                      No rating data available yet
                    </Text>
                    <Text fontSize="sm" color={subTextColor} mt={2}>
                      Ratings will appear here as students review the course
                    </Text>
                  </Flex>
                )}
              </Box>
            </SlideFade>
          </CardBody>
        </Collapse>
      </Card>
    </ScaleFade>
  );
};

export default CourseAnalytics;
