import React, { useState, useMemo } from 'react';
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
} from '@chakra-ui/react';

interface DataItem {
  id: number;
  주제명: string;
  게임실행횟수: number;
  게임완료율: string;
  게임당평균소요시간: string;
  정답률: string;
}

interface SortConfig {
  key: keyof DataItem;
  direction: 'ascending' | 'descending';
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([
    {
      id: 1,
      주제명: '동물1',
      게임실행횟수: 28,
      게임완료율: `65%`,
      게임당평균소요시간: `3.12 분`,
      정답률: `90%`,
    },
    {
      id: 2,
      주제명: '동물2',
      게임실행횟수: 34,
      게임완료율: `55%`,
      게임당평균소요시간: `10.10 분`,
      정답률: `90%`,
    },
    {
      id: 3,
      주제명: '나무',
      게임실행횟수: 22,
      게임완료율: `55%`,
      게임당평균소요시간: `13.12 분`,
      정답률: `90%`,
    },
    {
      id: 4,
      주제명: '장소',
      게임실행횟수: 45,
      게임완료율: `35%`,
      게임당평균소요시간: `9.12 분`,
      정답률: `90%`,
    },
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  return (
    <TableContainer>
      <Table
        variant="simple"
        size="md"
        colorScheme="blackAlpha"
        border="1px"
        borderColor="gray.400"
      >
        <TableCaption>Sortable Data Table</TableCaption>
        <Thead>
          <Tr>
            <Th textAlign="center">
              <Button onClick={() => requestSort('id')}>ID</Button>
            </Th>
            <Th textAlign="center">
              <Button onClick={() => requestSort('주제명')}>주제명</Button>
            </Th>
            <Th textAlign="center">
              <Button onClick={() => requestSort('게임실행횟수')}>
                게임실행횟수
              </Button>
            </Th>
            <Th textAlign="center">
              <Button onClick={() => requestSort('게임완료율')}>
                게임완료율
              </Button>
            </Th>
            <Th textAlign="center">
              <Button onClick={() => requestSort('게임당평균소요시간')}>
                게임당평균소요시간
              </Button>
            </Th>
            <Th textAlign="center">
              <Button onClick={() => requestSort('정답률')}>정답률</Button>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map(row => (
            <Tr key={row.id}>
              <Td textAlign="center">{row.id}</Td>
              <Td textAlign="center">{row.주제명}</Td>
              <Td textAlign="center">{row.게임실행횟수}</Td>
              <Td textAlign="center">{row.게임완료율}</Td>
              <Td textAlign="center">{row.게임당평균소요시간}</Td>
              <Td textAlign="center">{row.정답률}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
