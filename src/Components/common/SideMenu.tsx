import React from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useLocation, Link } from 'react-router-dom';
import gridImage from '../../Asset/image/grid.png';
import visitImage from '../../Asset/image/visit.png';
import gameImage from '../../Asset/image/game.png';
import userImage from '../../Asset/image/user.png';
import adminImage from '../../Asset/image/admin.png';
import editImage from '../../Asset/image/edit.png';
import logoutImage from '../../Asset/image/logout.png';
import toolsImage from '../../Asset/image/tools.png';

interface NavItemProps {
  label: string;
  to: string;
  icon?: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, to, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Flex
      as={Link}
      to={to}
      align="center"
      p="2"
      m="2"
      borderRadius="md"
      cursor="pointer"
      bg={isActive ? 'blue.500' : 'transparent'}
      color={isActive ? 'white' : 'black'}
      _hover={{ bg: 'gray.200', color: 'black' }}
    >
      {icon && <Image src={icon} boxSize="20px" mr="2" />}
        <Text fontSize="lg" fontWeight="bold">{label}</Text>
    </Flex>
  );
};

const SideMenu: React.FC = () => {
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
      <NavItem label="게임 통계" to="/game-stats" icon={gameImage} />
      <NavItem label="유저 관리" to="/user-management" icon={userImage} />
      <NavItem label="관리자 관리" to="/admin-management" icon={adminImage} />
      <NavItem label="주제 관리" to="/topic-management" icon={editImage} />
      <NavItem label="로그아웃" to="/logout" icon={logoutImage} />
    </Box>
  );
};

export default SideMenu;
