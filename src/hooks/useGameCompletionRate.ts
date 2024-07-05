import { useState, useEffect } from 'react';
import { ChartData } from 'chart.js';
import axiosInstance from '../api/axiosInstance';

interface GameCompletionRateResponse {
  stats: {
    title: string;
    totalPlayTime: number;
  }[];
}

const useGameCompletionRate = () => {
  const [gameCompletionData, setGameCompletionData] = useState<
    ChartData<'doughnut'>
  >({
    labels: [],
    datasets: [
      {
        label: '게임 완료율',
        data: [],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameCompletionRateData = async () => {
      try {
        const res =
          await axiosInstance.get<GameCompletionRateResponse>(
            '/admin/stat/game',
          );
        const stats = res.data.stats;
        const labels = stats.map(stat => stat.title);
        const data = stats.map(stat => stat.totalPlayTime);

        setGameCompletionData({
          labels,
          datasets: [
            {
              label: '게임 완료율',
              data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
              ],
              hoverOffset: 4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching game completion rate data:', error);
        setError('게임 완료율 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchGameCompletionRateData();
  }, []);

  return { gameCompletionData, error };
};

export default useGameCompletionRate;
