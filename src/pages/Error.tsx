import React from 'react';
import CommonHeader from '../Components/common/CommonHeader';
import { Button, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <>
      <CommonHeader />
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Text margin={8}>해당 페이지가 존재하지 않습니다.</Text>
        <Button>
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </Flex>
    </>
  );
};

export default Error;
