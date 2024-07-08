import { useState, useEffect } from 'react';
import axiosInstance from '../API/axiosInstance';

interface UserRankingProps {
  userId: number;
  nickname: string;
  totalBadges: number;
  totalHearts: number;
  rank: number;
}

const useUserRanking = () => {
  const [userRankingData, setUserRankingData] = useState<UserRankingProps[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRankingData = async () => {
      try {
        const res = await axiosInstance.get<UserRankingProps[]>(
          '/admin/stat/userRanking',
        );
        setUserRankingData(res.data);
      } catch (error) {
        console.error('Error fetching user ranking data:', error);
        setError('사용자 랭킹 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchUserRankingData();
  }, []);

  return { userRankingData, error };
};

export default useUserRanking;
