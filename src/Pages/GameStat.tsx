import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import Pagination from '../Components/common/Pagination';

interface DataItem {
  topicId: number;
  topicText: string;
  topicUsageCount: number;
  topicQuestionCount: string;
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
        case 'topicQuestionCount':
          sortValue = `questionCount${dir}`;
          break;
        case 'topicId':
        default:
          sortValue = `id${dir}`;
          break;
      }
    }

    try {
      const response = await axios.get('/admin/stat/game', {
        params: {
          sort: sortValue,
          pageNumber: currentPage - 1,
          pageSize: itemsPerPage,
        },
      });
      const { topics, totalPage } = response.data;
      setData(topics);
      setTotalPages(totalPage);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortConfig, currentPage]);

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
              <Th textAlign="center">
                <Button onClick={() => requestSort('topicId')}>ID</Button>
              </Th>
              <Th textAlign="center">
                <Button onClick={() => requestSort('topicText')}>주제명</Button>
              </Th>
              <Th textAlign="center">
                <Button onClick={() => requestSort('topicUsageCount')}>
                  게임실행횟수
                </Button>
              </Th>
              <Th textAlign="center">
                <Button onClick={() => requestSort('topicQuestionCount')}>
                  게임완료율
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(row => (
              <Tr key={row.topicId}>
                <Td textAlign="center">{row.topicId}</Td>
                <Td textAlign="center">{row.topicText}</Td>
                <Td textAlign="center">{row.topicUsageCount}</Td>
                <Td textAlign="center">{row.topicQuestionCount}</Td>
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
