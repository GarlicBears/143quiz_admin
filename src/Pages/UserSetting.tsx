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
import axiosInstance from '../API/axiosInstance';
import Pagination from '../Components/common/Pagination';

interface User {
  userId: number;
  email: string;
  nickname: string;
  birthYear: number;
  age: number;
  gender: string;
  location: string;
  active: string;
}

interface DataItem {
  id: number;
  nickname: string;
  email: string;
  birthYear: number;
  age: number;
  gender: string;
  location: string;
  active: string;
}

interface SortConfig {
  key: keyof DataItem;
  direction: 'ascending' | 'descending';
}

const UserSetting: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteRowIds, setDeleteRowIds] = useState<number[]>([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // 유저 데이터 조회
  useEffect(() => {
    getUserData();
  }, [currentPage, sortConfig, itemsPerPage]);

  const getUserData = async () => {
    const sortKey = sortConfig?.key ?? 'userId';
    const sortDirection = sortConfig?.direction ?? 'ascending';

    try {
      const res = await axiosInstance.get<{
        sort: string;
        pageNumber: number;
        pageSize: number;
        totalPage: number;
        totalCount: number;
        users: User[];
      }>('/admin/users', {
        params: {
          sort: `${sortKey}${sortDirection === 'ascending' ? 'Asc' : 'Desc'}`,
          pageNumber: currentPage - 1,
          pageSize: itemsPerPage,
        },
      });

      const users = res.data.users.map(user => ({
        id: user.userId,
        nickname: user.nickname,
        email: user.email,
        birthYear: user.birthYear,
        age: user.age,
        gender: user.gender,
        location: user.location,
        active: user.active,
      }));

      setData(users);
      setTotalPages(res.data.totalPage);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
    return <ChevronDownIcon />;
  };

  // 선택 삭제 기능
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
      id => data.find(row => row.id === id)?.active !== 'inactive',
    );
    setDeleteRowIds(deletableRows);
    onOpen();
  };

  const confirmDelete = async () => {
    console.log('confirmDelete user:', ...deleteRowIds);
    try {
      // 각 사용자에 대해 삭제 요청을 서버로 보냄
      for (const id of deleteRowIds) {
        console.log(`/admin/user/${id}`);
        await axiosInstance.delete(`/admin/user/${id}`);
      }
      console.log('Users deleted successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
    }

    // 상태 업데이트
    setData(prevData => prevData.filter(row => !deleteRowIds.includes(row.id)));
    setSelectedRows([]);
    onClose();
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
            placeholder="유저명 또는 이메일 검색"
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
                  유저명
                  <IconButton
                    icon={renderSortIcon('nickname')}
                    onClick={() => requestSort('nickname')}
                    aria-label="Sort 유저명"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  이메일
                  <IconButton
                    icon={renderSortIcon('email')}
                    onClick={() => requestSort('email')}
                    aria-label="Sort 이메일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  생년
                  <IconButton
                    icon={renderSortIcon('birthYear')}
                    onClick={() => requestSort('birthYear')}
                    aria-label="Sort 생년"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  나이
                  <IconButton
                    icon={renderSortIcon('age')}
                    onClick={() => requestSort('age')}
                    aria-label="Sort 나이"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  성별
                  <IconButton
                    icon={renderSortIcon('gender')}
                    onClick={() => requestSort('gender')}
                    aria-label="Sort 성별"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  위치
                  <IconButton
                    icon={renderSortIcon('location')}
                    onClick={() => requestSort('location')}
                    aria-label="Sort 위치"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  상태
                  <IconButton
                    icon={renderSortIcon('active')}
                    onClick={() => requestSort('active')}
                    aria-label="Sort 상태"
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
              {data.map(row => (
                <Tr key={row.id}>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </Td>
                  <Td textAlign="center">{row.id}</Td>
                  <Td textAlign="center">{row.nickname}</Td>
                  <Td textAlign="center">{row.email}</Td>
                  <Td textAlign="center">{row.birthYear}</Td>
                  <Td textAlign="center">{row.age}</Td>
                  <Td textAlign="center">{row.gender}</Td>
                  <Td textAlign="center">{row.location}</Td>
                  <Td textAlign="center">{row.active}</Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(row.id)}
                      isDisabled={row.active === 'inactive'}
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

export default UserSetting;
