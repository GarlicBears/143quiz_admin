import { Box, Text } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
  return (
    <Box bg="gray.200" p="4" borderRadius="md" mb="4" textAlign="center">
      <Text fontSize="2xl" fontWeight="bold">
        Admin Page
      </Text>
    </Box>
  );
};

export default Header;
