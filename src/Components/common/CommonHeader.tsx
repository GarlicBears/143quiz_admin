import { Flex, Image, Text, Box } from '@chakra-ui/react';
import React from 'react';
import toolsImage from '../../Asset/image/tools.png';

const CommonHeader = () => {
  return (
    <Flex
      bg="gray.200"
      p="4"
      mb="4"
      textAlign="center"
      height="100px"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        boxSize="80px"
        bg="white"
        borderRadius="full"
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin="16px"
      >
        <Image src={toolsImage} alt="logo" margin="4" />
      </Box>
      <Text fontSize="2xl" fontWeight="bold">
        143 초성 게임
      </Text>
    </Flex>
  );
};

export default CommonHeader;
