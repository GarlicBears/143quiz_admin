// src/Pages/Dashboard.tsx
import React from 'react';
import {
  SimpleGrid,
  GridItem,
  Box,
  Flex,
  Text,
  HStack,
} from '@chakra-ui/react';
import ChartComponent from '../Components/common/Chart';
import { ChartData, ChartOptions } from 'chart.js';
interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
}
import { chartData } from '../Asset/MockData';

const StatBox: React.FC<StatBoxProps> = ({ label, value, unit }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      py={10}
      px={6}
      bgColor={'#f7f7f7'}
      boxShadow="md"
    >
      <Text fontWeight="bold">{label}</Text>
      <HStack>
        <Text fontSize="36px" fontWeight="bold">
          {value}
        </Text>
        {unit && <Text color="gray">{unit}</Text>}
      </HStack>
    </Flex>
  );
};

const chartOptions: ChartOptions<'line' | 'bar' | 'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart Example',
    },
  },
};


const chartData = {
  line: {
    labels: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    datasets: [
      {
        label: '월별 방문자 수',
        data: [65, 59, 80, 81, 56, 55, 40, 60, 70, 160, 56, 33],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  },
  bar: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Bar Dataset',
        data: [35, 49, 60, 71, 46, 55, 30],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  },
  doughnut: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Doughnut Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  },
};

const Dashboard: React.FC = () => {
  const stats = [
    { label: '총 방문자 수', value: '43,333', unit: '명' },
    { label: '일일 활성 사용자 수', value: '400', unit: '명' },
    { label: '사용자 이탈율', value: '12.22', unit: '%' },
    { label: '사용자 유지율', value: '77.78', unit: '%' },
  ];

  return (
    <SimpleGrid columns={5} spacing={4}>
      {stats.map((stat, index) => (
        <GridItem key={index} colSpan={1}>
          <StatBox label={stat.label} value={stat.value} unit={stat.unit} />
        </GridItem>
      ))}
      <GridItem colSpan={3}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="bar"
            data={chartData.bar}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={2}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="doughnut"
            data={chartData.doughnut}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={5}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <ChartComponent
            type="line"
            data={chartData.line}
            options={chartOptions}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={2}>
        <Box py={10} px={6} bgColor={'#f7f7f7'}>
          <StatBox label="기타" value={2} />
        </Box>
      </GridItem>
      <GridItem colSpan={3}>
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

export default Dashboard;
