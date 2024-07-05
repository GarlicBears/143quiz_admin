import { useState, useEffect } from 'react';
import { ChartData } from 'chart.js';
import axiosInstance from '../API/axiosInstance';

interface MonthlyVisitorsResponse {
  visitors: {
    date: string;
    count: number;
  }[];
}

const useMonthlyVisitors = () => {
  const [monthlyVisitorsData, setMonthlyVisitorsData] = useState<
    ChartData<'line'>
  >({
    labels: [],
    datasets: [
      {
        label: '월별 방문자 수',
        data: [],
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyVisitorsData = async () => {
      try {
        const res = await axiosInstance.get<MonthlyVisitorsResponse>(
          '/admin/stat/monthlyVisitors',
        );
        const visitors = res.data.visitors;
        const labels = visitors.map(visitor => visitor.date);
        const data = visitors.map(visitor => visitor.count);

        setMonthlyVisitorsData({
          labels,
          datasets: [
            {
              label: '월별 방문자 수',
              data,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching monthly visitors data:', error);
        setError('월별 방문자 수 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchMonthlyVisitorsData();
  }, []);

  return { monthlyVisitorsData, error };
};

export default useMonthlyVisitors;
