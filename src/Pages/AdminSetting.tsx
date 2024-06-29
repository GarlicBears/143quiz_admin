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
  Checkbox,
  useDisclosure,
  Input,
  VStack,
  HStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import ConfirmModal from '../Components/common/ConfirmModal';
import Pagination from '../Components/common/Pagination';

interface DataItem {
  id: number;
  관리자명: string;
  이메일: string;
  관리자생성일: string;
  마지막관리자수정일: string | null;
  관리자상태: string;
  권한: string;
}

interface SortConfig {
  key: keyof DataItem;
  direction: 'ascending' | 'descending';
}

const AdminSetting = () => {
  const [data, setData] = useState<DataItem[]>([
    {
      id: 1,
      관리자명: 'test1',
      이메일: 'dsafsfd@gamol.com',
      관리자생성일: `2023-01-01`,
      마지막관리자수정일: `2024-01-01`,
      관리자상태: `정상`,
      권한: '열람',
    },
    {
      id: 2,
      관리자명: 'test2',
      이메일: 'asdf@gamol.com',
      관리자생성일: `2023-02-01`,
      마지막관리자수정일: `2024-02-01`,
      관리자상태: `정상`,
      권한: '편집',
    },
    {
      id: 3,
      관리자명: 'test3',
      이메일: 'eeeeee@gamol.com',
      관리자생성일: `2024-01-04`,
      마지막관리자수정일: `2024-03-01`,
      관리자상태: `탈퇴`,
      권한: '열람',
    },
    {
      id: 4,
      관리자명: 'admin1',
      이메일: 'admin@gamol.com',
      관리자생성일: `2021-01-01`,
      마지막관리자수정일: `2024-05-01`,
      관리자상태: `정상`,
      권한: '편집',
    },
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteRowIds, setDeleteRowIds] = useState<number[]>([]);
  const currentUserCanChangePermissions = true; // 현재 유저의 권한 변경 가능 여부 (예시)

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

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
    return <ChevronDownIcon />;
  };

  const filteredData = useMemo(() => {
    return data.filter(
      item =>
        item.관리자명.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.이메일.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;

      sortableItems.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === null && bValue !== null) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (aValue !== null && bValue === null) {
          return direction === 'ascending' ? 1 : -1;
        }
        if (aValue === null && bValue === null) {
          return 0;
        }

        if (aValue! < bValue!) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (aValue! > bValue!) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(item => item.id));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id],
    );
  };

  const handleDelete = (id: number) => {
    setDeleteRowIds([id]);
    onOpen();
  };

  const handleBulkDelete = () => {
    const deletableRows = selectedRows.filter(
      id =>
        !(
          data.find(row => row.id === id)?.관리자상태 === '탈퇴' ||
          data.find(row => row.id === id)?.권한 === '관리자'
        ),
    );
    setDeleteRowIds(deletableRows);
    onOpen();
  };

  const confirmDelete = () => {
    console.log('이 회원을 삭제하시겠습니까?', deleteRowIds);
    setData(prevData => prevData.filter(row => !deleteRowIds.includes(row.id)));
    setSelectedRows([]);
    onClose();
  };

  const changePermission = (id: number, newPermission: string) => {
    setData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, 권한: newPermission } : row,
      ),
    );
  };

  // 페이지네이션 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Input
            placeholder="관리자명 또는 이메일 검색"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </HStack>
        <TableContainer>
          <Table
            variant="simple"
            size="sm"
            colorScheme="blackAlpha"
            border="1px"
            borderColor="gray.400"
          >
            <Thead>
              <Tr>
                <Th textAlign="center">
                  <Checkbox
                    isChecked={selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  ID
                  <IconButton
                    icon={renderSortIcon('id')}
                    onClick={() => requestSort('id')}
                    aria-label="Sort ID"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  관리자명
                  <IconButton
                    icon={renderSortIcon('관리자명')}
                    onClick={() => requestSort('관리자명')}
                    aria-label="Sort 관리자명"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  이메일
                  <IconButton
                    icon={renderSortIcon('이메일')}
                    onClick={() => requestSort('이메일')}
                    aria-label="Sort 이메일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  관리자생성일
                  <IconButton
                    icon={renderSortIcon('관리자생성일')}
                    onClick={() => requestSort('관리자생성일')}
                    aria-label="Sort 관리자생성일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  마지막관리자수정일
                  <IconButton
                    icon={renderSortIcon('마지막관리자수정일')}
                    onClick={() => requestSort('마지막관리자수정일')}
                    aria-label="Sort 마지막관리자수정일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  관리자상태
                  <IconButton
                    icon={renderSortIcon('관리자상태')}
                    onClick={() => requestSort('관리자상태')}
                    aria-label="Sort 관리자상태"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  권한
                  <IconButton
                    icon={renderSortIcon('권한')}
                    onClick={() => requestSort('권한')}
                    aria-label="Sort 권한"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center">
                  <Button
                    colorScheme="red"
                    onClick={handleBulkDelete}
                    isDisabled={selectedRows.length === 0}
                  >
                    선택삭제
                  </Button>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedData.map(row => (
                <Tr key={row.id}>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </Td>
                  <Td textAlign="center">{row.id}</Td>
                  <Td textAlign="center">{row.관리자명}</Td>
                  <Td textAlign="center">{row.이메일}</Td>
                  <Td textAlign="center">{row.관리자생성일}</Td>
                  <Td textAlign="center">{row.마지막관리자수정일}</Td>
                  <Td textAlign="center">{row.관리자상태}</Td>
                  <Td textAlign="center">{row.권한}</Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="blue"
                      onClick={() =>
                        changePermission(
                          row.id,
                          row.권한 === '열람' ? '편집' : '열람',
                        )
                      }
                      isDisabled={!currentUserCanChangePermissions}
                    >
                      권한변경
                    </Button>
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(row.id)}
                      isDisabled={
                        row.관리자상태 === '탈퇴' || row.권한 === '관리자'
                      }
                    >
                      삭제
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      <Flex justify="center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Flex>
      <ConfirmModal
        body="이 회원을 삭제하시겠습니까?"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminSetting;
