import React, { useState } from 'react';
import CommonHeader from '../Components/common/CommonHeader';
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('로그인');
    setErrorMsg('아이디 또는 비밀번호가 일치하지 않습니다.');
  };
  return (
    <>
      <CommonHeader />
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginY={10}
        >
          <Text>안녕하세요,</Text>
          <Text>143 초성게임 관리자 로그인 페이지입니다.</Text>
        </Flex>
        <Flex justifyContent="center">
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <form onSubmit={handleLogin}>
              <FormControl id="username">
                <HStack>
                  <FormLabel width="50%" fontWeight="bold">
                    아이디
                  </FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </HStack>
              </FormControl>
              <FormControl id="password" mt={4}>
                <HStack>
                  <FormLabel width="50%" fontWeight="bold">
                    비밀번호
                  </FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </HStack>
              </FormControl>
              <Text mt={2} fontSize="sm" color="red">
                {errorMsg}
              </Text>
              <Button
                type="submit"
                colorScheme="gray"
                size="lg"
                mt={4}
                width="full"
              >
                로그인
              </Button>
            </form>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Login;
