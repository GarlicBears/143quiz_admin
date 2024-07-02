import React, { useState } from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import gridImage from '../../Asset/image/grid.png';
import visitImage from '../../Asset/image/visit.png';
import gameImage from '../../Asset/image/game.png';
import userImage from '../../Asset/image/user.png';
import adminImage from '../../Asset/image/admin.png';
import editImage from '../../Asset/image/edit.png';
import logoutImage from '../../Asset/image/logout.png';
import toolsImage from '../../Asset/image/tools.png';
import ConfirmModal from '../common/ConfirmModal';
import axiosInstance from '../../API/axiosInstance';

interface NavItemProps {
  label: string;
  to: string;
  icon?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, to, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Flex
      as={to !== '/logout' ? Link : undefined}
      to={to !== '/logout' ? to : undefined}
      align="center"
      p="2"
      m="2"
      borderRadius="md"
      cursor="pointer"
      bg={isActive ? 'blue.500' : 'transparent'}
      color={isActive ? 'white' : 'black'}
      _hover={{ bg: 'gray.200', color: 'black' }}
      onClick={onClick}
    >
      {icon && <Image src={icon} boxSize="20px" mr="2" />}
      <Text fontSize="lg" fontWeight="bold">
        {label}
      </Text>
    </Flex>
  );
};

const SideMenu: React.FC = () => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.delete('/admin/logout'); // 로그아웃 API 호출
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // 쿠키 삭제
      // navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      closeLogoutModal();
    }
  };

  return (
    <Box w="250px" bg="gray.100" p="4">
      <Flex direction="column" align="center" mb="4">
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
        <Text>관리자ID, 직급</Text>
      </Flex>
      <NavItem label="대시보드" to="/" icon={gridImage} />
      <NavItem label="방문자 수" to="/visitors" icon={visitImage} />
      <NavItem label="게임 통계" to="/gamestats" icon={gameImage} />
      <NavItem label="유저 관리" to="/usersetting" icon={userImage} />
      <NavItem label="관리자 관리" to="/adminsetting" icon={adminImage} />
      <NavItem label="주제 관리" to="/topicsetting" icon={editImage} />
      <NavItem
        label="로그아웃"
        to="/logout"
        icon={logoutImage}
        onClick={openLogoutModal}
      />

      <ConfirmModal
        body="정말 로그아웃 하시겠습니까?"
        isOpen={isLogoutModalOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
      />
    </Box>
  );
};

export default SideMenu;
