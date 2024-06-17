import React from 'react';
import { SimpleGrid, Text, Flex, GridItem } from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <SimpleGrid columns={5} spacing={4}>
      <GridItem colSpan={1}>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={10}
          px={6}
          bgColor={'#f7f7f7'}
        >
          <Text fontSize="2xl" mb={4}>
            1
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={4}>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={10}
          px={6}
          bgColor={'#f7f7f7'}
        >
          <Text fontSize="2xl" mb={4}>
            4
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={3}>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={10}
          px={6}
          bgColor={'#f7f7f7'}
        >
          <Text fontSize="2xl" mb={4}>
            3
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={2}>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={10}
          px={6}
          bgColor={'#f7f7f7'}
        >
          <Text fontSize="2xl" mb={4}>
            2
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={2}>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={10}
          px={6}
          bgColor={'#f7f7f7'}
        >
          <Text fontSize="2xl" mb={4}>
            2
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={3}>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={10}
          px={6}
          bgColor={'#f7f7f7'}
        >
          <Text fontSize="2xl" mb={4}>
            3
          </Text>
        </Flex>
      </GridItem>
    </SimpleGrid>
  );
};
export default Dashboard;
