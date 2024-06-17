import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './common/ConfirmModal';
import { Box, Text } from '@chakra-ui/react';
// import Cookies from 'js-cookie';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Cookies.remove('accessToken'); // 주석을 풀어 쿠키를 삭제할 수 있습니다.
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
