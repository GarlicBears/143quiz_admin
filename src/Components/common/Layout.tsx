import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import SideMenu from './SideMenu';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <Flex h="100vh">
      <SideMenu />
      <Box flex="1" p="4">
        <Header />
        <Outlet />
      </Box>
    </Flex>
  );
};
export default Layout;
