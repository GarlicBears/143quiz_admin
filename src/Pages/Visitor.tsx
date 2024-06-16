// src/Pages/Visitor.tsx

import React from 'react';
import { SimpleGrid, GridItem, Box } from '@chakra-ui/react';
import ChartComponent from '../Components/common/Chart';
import { chartData, chartOptions } from '../Asset/MockData';

const Visitor: React.FC = () => {
  return (
    <SimpleGrid columns={2} spacing={4}>
      <GridItem colSpan={1}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};

export default Visitor;
