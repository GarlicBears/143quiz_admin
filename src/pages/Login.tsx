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
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .post('/admin/login', {
        email,
        password,
      })
      .then(response => {
        const accessToken = response.headers['authorization'];
        if (accessToken) {
          Cookies.set('accessToken', accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'Strict',
          });
          navigate('/');
        } else {
          toast({
            title: '로그인 실패',
            description: '인증 토큰을 받지 못했습니다.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch(error => {
        console.error('로그인 에러:', error);
        toast({
          title: '로그인 실패',
          description: '이메일 또는 비밀번호가 일치하지 않습니다.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
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
              <FormControl id="email">
                <HStack>
                  <FormLabel width="50%" fontWeight="bold">
                    이메일
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                    onChange={e => setPassword(e.target.value)}
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
