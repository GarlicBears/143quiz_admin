import React, { useState, useEffect } from 'react';
import { SimpleGrid, GridItem, Box } from '@chakra-ui/react';
import ChartComponent from '../Components/common/Chart';
import axiosInstance from '../API/axiosInstance';

interface VisitorData {
  date: string;
  count: number;
}

interface VisitorResponse {
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalCount: number;
  visitors: VisitorData[];
}

interface TotalVisitorsResponse {
  totalVisitors: number;
}

interface VisitorState {
  daily: VisitorData[];
  weekly: VisitorData[];
  monthly: VisitorData[];
  total: number;
}

const Visitor: React.FC = () => {
  const [visitorData, setVisitorData] = useState<VisitorState>({
    daily: [],
    weekly: [],
    monthly: [],
    total: 0,
  });

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const dailyResponse = await axiosInstance.get<VisitorResponse>(
          '/admin/stat/dailyVisitors',
        );
        const weeklyResponse = await axiosInstance.get<VisitorResponse>(
          '/admin/stat/weeklyVisitors',
        );
        const monthlyResponse = await axiosInstance.get<VisitorResponse>(
          '/admin/stat/monthlyVisitors',
        );
        const totalResponse = await axiosInstance.get<TotalVisitorsResponse>(
          '/admin/stat/totalVisitors',
        );

        setVisitorData({
          daily: dailyResponse.data.visitors,
          weekly: weeklyResponse.data.visitors,
          monthly: monthlyResponse.data.visitors,
          total: totalResponse.data.totalVisitors,
        });
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitorData();
  }, []);

  const chartDataConfig = [
    { label: '일별 방문자 수', data: visitorData.daily },
    { label: '주별 방문자 수', data: visitorData.weekly },
    { label: '월별 방문자 수', data: visitorData.monthly },
  ];

  return (
    <Box>
      <Box py={10} px={6} bgColor={'#f7f7f7'}>
        <h2>전체 방문자 수: {visitorData.total}</h2>
      </Box>
      <SimpleGrid columns={2} spacing={4}>
        {chartDataConfig.map((chart, index) => (
          <GridItem key={index} colSpan={1}>
            <Box py={10} px={6} bgColor={'#f7f7f7'}>
              <ChartComponent
                type="line"
                data={{
                  labels: chart.data.map(item => item.date),
                  datasets: [
                    {
                      label: chart.label,
                      data: chart.data.map(item => item.count),
                      fill: false,
                      borderColor: 'blue',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    // title is now under plugins
                    title: {
                      display: true,
                      text: chart.label,
                    },
                  },
                }}
              />
            </Box>
          </GridItem>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Visitor;
