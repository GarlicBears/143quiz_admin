import { useState, useEffect } from 'react';
import axiosInstance from '../API/axiosInstance';

interface StatBoxProps {
  label: string;
  value: string | number;
  unit?: string;
}

interface DashboardStatsResponse {
  totalVisitors: number;
  dailyActiveUsers: number;
  dailyGamePlays: number;
  totalUsers: number;
  averageRating: number;
}

const useDashboardStats = () => {
  const [stats, setStats] = useState<StatBoxProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const res = await axiosInstance.get<DashboardStatsResponse>(
          '/admin/stat/dashboard',
        );
        const data = res.data;
        const statsData: StatBoxProps[] = [
          { label: '총 방문자 수', value: data.totalVisitors, unit: '명' },
          {
            label: '일일 활성 사용자',
            value: data.dailyActiveUsers,
            unit: '명',
          },
          {
            label: '일일 게임 플레이 수',
            value: data.dailyGamePlays,
            unit: '회',
          },
          { label: '총 사용자 수', value: data.totalUsers, unit: '명' },
          { label: '평균 평점', value: data.averageRating, unit: '점' },
        ];
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching general data:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchGeneralData();
  }, []);

  return { stats, error };
};

export default useDashboardStats;
