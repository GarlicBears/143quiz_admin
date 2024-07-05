import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import axiosInstance from '../API/axiosInstance';
import Pagination from '../Components/common/Pagination';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface DataItem {
  topicId: number;
  topicText: string;
  topicUsageCount: number;
  topicQuestionCount: string;
  topicAverageCompletePlayRate: string;
  topicAverageCorrectionRate: string;
  topicCompleteCount: number;
}

interface SortConfig {
  key: keyof DataItem;
  direction: 'ascending' | 'descending';
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    let sortValue = 'usageCountAsc';
    if (sortConfig) {
      const { key, direction } = sortConfig;
      const dir = direction === 'ascending' ? 'Asc' : 'Desc';
      switch (key) {
        case 'topicText':
          sortValue = `title${dir}`;
          break;
        case 'topicUsageCount':
          sortValue = `usageCount${dir}`;
          break;
        case 'topicAverageCompletePlayRate':
          sortValue = `averageCompletePlayRate${dir}`;
          break;
        case 'topicAverageCorrectionRate':
          sortValue = `averageCorrectionRate${dir}`;
          break;
        case 'topicCompleteCount':
          sortValue = `completeCount${dir}`;
          break;
        default:
          sortValue = `updatedAt${dir}`;
          break;
      }
    }

    try {
      const response = await axiosInstance.get('/admin/stat/game', {
        params: {
          sort: sortValue,
          pageNumber: currentPage - 1,
          pageSize: itemsPerPage,
        },
      });
      const { stats, totalPage } = response.data;
      const topics = stats.map((topic: any) => ({
        topicId: topic.topicId,
        topicText: topic.title,
        topicUsageCount: topic.usageCount,
        topicQuestionCount: topic.completeCount,
        topicAverageCompletePlayRate: parseFloat(
          topic.averageCompletePlayRate,
        ).toFixed(2),
        topicAverageCorrectionRate: parseFloat(
          topic.averageCorrectionRate,
        ).toFixed(2),
        topicCompleteCount: topic.completeCount,
      }));
      setData(topics);
      setTotalPages(totalPage);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortConfig, currentPage]);

  // 정렬 기능
  const requestSort = (key: keyof DataItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof DataItem) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      );
    }
    return <ChevronUpIcon />;
  };

  return (
    <>
      <TableContainer>
        <Table
          variant="simple"
          size="md"
          colorScheme="blackAlpha"
          border="1px"
          borderColor="gray.400"
        >
          <TableCaption>게임 통계 테이블</TableCaption>
          <Thead>
            <Tr>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                ID
                <IconButton
                  icon={renderSortIcon('topicId')}
                  onClick={() => requestSort('topicId')}
                  aria-label="Sort ID"
                  size="xs"
                  ml={2}
                />
              </Th>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                주제명
                <IconButton
                  icon={renderSortIcon('topicText')}
                  onClick={() => requestSort('topicText')}
                  aria-label="Sort 주제명"
                  size="xs"
                  ml={2}
                />
              </Th>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                게임실행횟수
                <IconButton
                  icon={renderSortIcon('topicUsageCount')}
                  onClick={() => requestSort('topicUsageCount')}
                  aria-label="Sort 게임실행횟수"
                  size="xs"
                  ml={2}
                />
              </Th>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                문제 수
                <IconButton
                  icon={renderSortIcon('topicQuestionCount')}
                  onClick={() => requestSort('topicQuestionCount')}
                  aria-label="Sort 문제 수"
                  size="xs"
                  ml={2}
                />
              </Th>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                평균게임완료율
                <IconButton
                  icon={renderSortIcon('topicAverageCompletePlayRate')}
                  onClick={() => requestSort('topicAverageCompletePlayRate')}
                  aria-label="Sort 평균게임완료율"
                  size="xs"
                  ml={2}
                />
              </Th>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                평균정답률
                <IconButton
                  icon={renderSortIcon('topicAverageCorrectionRate')}
                  onClick={() => requestSort('topicAverageCorrectionRate')}
                  aria-label="Sort 평균정답률"
                  size="xs"
                  ml={2}
                />
              </Th>
              <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                게임완료횟수
                <IconButton
                  icon={renderSortIcon('topicCompleteCount')}
                  onClick={() => requestSort('topicCompleteCount')}
                  aria-label="Sort 게임완료횟수"
                  size="xs"
                  ml={2}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map(row => (
              <Tr key={row.topicId}>
                <Td textAlign="center">{row.topicId}</Td>
                <Td textAlign="center">{row.topicText}</Td>
                <Td textAlign="center">{row.topicUsageCount}</Td>
                <Td textAlign="center">{row.topicQuestionCount}</Td>
                <Td textAlign="center">{row.topicAverageCompletePlayRate}</Td>
                <Td textAlign="center">{row.topicAverageCorrectionRate}</Td>
                <Td textAlign="center">{row.topicCompleteCount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify="center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Flex>
    </>
  );
};

export default DataTable;
