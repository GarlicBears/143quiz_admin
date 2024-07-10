import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './common/ConfirmModal';
import { Box, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import axiosInstance from '../api/axiosInstance';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      axiosInstance.delete('/admin/logout');
      console.log('로그아웃 되었습니다.');

      // 쿠키 전부 삭제하기
      Cookies.remove('accessToken');
      const cookieOptions = {
        domain: 'localhost8080:/', // 쿠키를 설정할 때 사용한 도메인으로 변경
        path: '/login', // 쿠키를 설정할 때 사용한 경로로 변경
      };
      Cookies.remove('refreshToken', cookieOptions);

      onClose();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 에러', error);
    }
  };

  return (
    <ConfirmModal
      body={
        <Box textAlign="center">
          <Text marginY={8}>로그아웃 하시겠습니까?</Text>
        </Box>
      }
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleLogout}
    />
  );
};

export default LogoutModal;
