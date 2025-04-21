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
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaStar } from "react-icons/fa";

const CourseAnalytics = ({ analytics }) => {
  const bgColor = useColorModeValue("white", "gray.700");

  if (!analytics) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={bgColor}
        boxShadow="sm"
      >
        <Text>No analytics data available yet.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg={bgColor} boxShadow="sm">
      <Heading size="md" mb={4}>
        Review Analytics
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <Stat>
          <StatLabel>Total Reviews</StatLabel>
          <StatNumber>{analytics.totalReviews}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Positive Reviews</StatLabel>
          <StatNumber>{analytics.positiveReviews}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {analytics.totalReviews
              ? (
                  (analytics.positiveReviews / analytics.totalReviews) *
                  100
                ).toFixed(1)
              : 0}
            %
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Negative Reviews</StatLabel>
          <StatNumber>{analytics.negativeReviews}</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            {analytics.totalReviews
              ? (
                  (analytics.negativeReviews / analytics.totalReviews) *
                  100
                ).toFixed(1)
              : 0}
            %
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box mb={4}>
        <Flex align="center" mb={2}>
          <FaStar style={{ color: "gold" }} />
          <Text ml={2} fontWeight="bold">
            Rating Distribution
          </Text>
        </Flex>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Box key={rating} mb={2}>
            <Flex align="center" mb={1}>
              <Text width="15px" mr={2}>
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
                size="sm"
                width="100%"
                borderRadius="md"
              />
              <Text ml={2} width="30px">
                {analytics.ratingDistribution[rating] || 0}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>

      {(analytics.topPositiveKeywords?.length > 0 ||
        analytics.topNegativeKeywords?.length > 0) && (
        <Box>
          <Divider my={3} />
          <Heading size="sm" mb={2}>
            Common Feedback Themes
          </Heading>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <Flex align="center" flex={1}>
              <Box color="green.500" mr={2}>
                <FaThumbsUp />
              </Box>
              <Text>
                {analytics.topPositiveKeywords?.length > 0
                  ? analytics.topPositiveKeywords.join(", ")
                  : "No positive keywords found"}
              </Text>
            </Flex>
            <Flex align="center" flex={1}>
              <Box color="red.500" mr={2}>
                <FaThumbsDown />
              </Box>
              <Text>
                {analytics.topNegativeKeywords?.length > 0
                  ? analytics.topNegativeKeywords.join(", ")
                  : "No negative keywords found"}
              </Text>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default CourseAnalytics;
