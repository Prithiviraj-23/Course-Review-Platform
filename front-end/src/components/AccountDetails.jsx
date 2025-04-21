import React from "react";
import {
  Box,
  Heading,
  Stack,
  Text,
  Divider,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

const AccountDetails = ({ userData }) => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Account Details
      </Heading>
      <Divider mb={4} />
      <Stack spacing={6}>
        {userData?.bio && (
          <Box>
            <Text fontWeight="bold">Bio</Text>
            <Text>{userData.bio}</Text>
          </Box>
        )}

        <Box>
          <Text fontWeight="bold">Member Since</Text>
          <Text>
            {userData?.createdAt
              ? new Date(userData.createdAt).toLocaleDateString()
              : "N/A"}
          </Text>
        </Box>

        {userData?.preferences?.department && (
          <Box>
            <Text fontWeight="bold">Department</Text>
            <Text>{userData.preferences.department}</Text>
          </Box>
        )}

        {userData?.preferences?.interests &&
          userData.preferences.interests.length > 0 && (
            <Box>
              <Text fontWeight="bold" mb={2}>
                Interests
              </Text>
              <Wrap>
                {userData.preferences.interests.map((interest, index) => (
                  <WrapItem key={index}>
                    <Tag
                      size="md"
                      colorScheme="teal"
                      borderRadius="full"
                      variant="solid"
                    >
                      <TagLabel>{interest}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}
      </Stack>
    </>
  );
};

export default AccountDetails;
