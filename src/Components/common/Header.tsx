import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return '143 초성게임 관리자 페이지';
      case '/visitors':
        return '방문자 통계';
      case '/gamestats':
        return '게임 통계';
      case '/usersetting':
        return '유저 관리';
      default:
        return '143 초성게임 관리자 페이지';
    }
  };

  return (
    <Box bg="gray.200" p="4" borderRadius="md" mb="4" textAlign="center">
      <Text fontSize="2xl" fontWeight="bold">
        {getPageTitle()}

      </Text>
    </Box>
  );
};

export default Header;
