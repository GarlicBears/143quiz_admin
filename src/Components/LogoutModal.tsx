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

  const handleLogout = () => {
    axiosInstance.delete('/admin/logout').then(() => {
      console.log('로그아웃 되었습니다.');
    });

    // 쿠키 전부 삭제하기
    const allCookies = Cookies.get();
    console.log('쿠키 목록:', allCookies);
    for (const cookieName in allCookies) {
      Cookies.remove(cookieName, { path: '/' });
    }

    onClose();
    navigate('/login');
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
