import { useState, useEffect } from 'react';
import { ChartData } from 'chart.js';
import axiosInstance from '../api/axiosInstance';

interface DailyVisitorsResponse {
  visitors: {
    date: string;
    count: number;
  }[];
}

const useDailyVisitors = () => {
  const [dailyVisitorsData, setDailyVisitorsData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [
      {
        label: '일별 방문자 수',
        data: [],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyVisitorsData = async () => {
      try {
        const res = await axiosInstance.get<DailyVisitorsResponse>(
          '/admin/stat/dailyVisitors',
        );
        const visitors = res.data.visitors;
        const labels = visitors.map(visitor => visitor.date);
        const data = visitors.map(visitor => visitor.count);

        setDailyVisitorsData({
          labels,
          datasets: [
            {
              label: '일별 방문자 수',
              data,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgba(255, 99, 132, 0.2)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching daily visitors data:', error);
        setError('일별 방문자 수 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchDailyVisitorsData();
  }, []);

  return { dailyVisitorsData, error };
};

export default useDailyVisitors;
