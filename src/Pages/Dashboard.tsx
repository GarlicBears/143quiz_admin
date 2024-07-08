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
import UserRanking from '../Components/UserRanking';
import useDashboardStats from '../hooks/useDashboardStats';
import useDailyVisitors from '../hooks/useDailyVisitors';
import useMonthlyVisitors from '../hooks/useMonthlyVisitors';
import useGameCompletionRate from '../hooks/useGameCompletionRate';
import useUserRanking from '../hooks/useUserRanking';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
}

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

const createChartOptions = <T extends ChartType>(
  label: string,
): ChartOptions<T> => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: label,
      },
    },
  } as ChartOptions<T>;
};

const Dashboard: React.FC = () => {
  const { stats, error: statsError } = useDashboardStats();
  const { dailyVisitorsData, error: dailyVisitorsError } = useDailyVisitors();
  const { monthlyVisitorsData, error: monthlyVisitorsError } =
    useMonthlyVisitors();
  const { gameCompletionData, error: gameCompletionError } =
    useGameCompletionRate();
  const { userRankingData, error: userRankingError } = useUserRanking();

  return (
    <>
      {(statsError ||
        dailyVisitorsError ||
        monthlyVisitorsError ||
        gameCompletionError ||
        userRankingError) && (
        <Box color="red">
          {statsError ||
            dailyVisitorsError ||
            monthlyVisitorsError ||
            gameCompletionError ||
            userRankingError}
        </Box>
      )}
      <SimpleGrid columns={5} spacing={4}>
        {stats.map((stat, index) => (
          <GridItem key={index} colSpan={1}>
            <StatBox label={stat.label} value={stat.value} unit={stat.unit} />
          </GridItem>
        ))}
        <GridItem colSpan={3}>
          <Box
            py={10}
            px={6}
            bgColor={'#f7f7f7'}
            display="flex"
            justifyContent="center"
          >
            <ChartComponent
              type="bar"
              data={dailyVisitorsData as ChartData<'bar'>}
              options={createChartOptions<'bar'>(
                dailyVisitorsData.datasets[0].label!,
              )}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box
            py={10}
            px={6}
            bgColor={'#f7f7f7'}
            display="flex"
            justifyContent="center"
          >
            <ChartComponent
              type="doughnut"
              data={gameCompletionData as ChartData<'doughnut'>}
              options={createChartOptions<'doughnut'>(
                gameCompletionData.datasets[0].label!,
              )}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <Box
            py={10}
            px={6}
            bgColor={'#f7f7f7'}
            display="flex"
            justifyContent="center"
          >
            <ChartComponent
              type="line"
              data={monthlyVisitorsData as ChartData<'line'>}
              options={createChartOptions<'line'>(
                monthlyVisitorsData.datasets[0].label!,
              )}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          <Box
            py={10}
            px={6}
            bgColor={'#f7f7f7'}
            display="flex"
            justifyContent="center"
          >
            <UserRanking data={userRankingData} />
          </Box>
        </GridItem>
      </SimpleGrid>
    </>
  );
};

export default Dashboard;
