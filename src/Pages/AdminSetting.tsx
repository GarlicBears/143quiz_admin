import React, { useState, useMemo, useEffect } from 'react';
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
import axiosInstance from '../api/axiosInstance';

interface DataItem {
  adminId: number;
  adminEmail: string;
  adminActive: string;
  createdAt: string;
  updatedAt: string;
}

interface SortConfig {
  key: keyof DataItem;
  direction: 'ascending' | 'descending';
}

const AdminSetting = () => {
  const [data, setData] = useState<DataItem[]>([]);

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

  // 관리자 회원 목록 조회
  useEffect(() => {
    axiosInstance.get('/admin/').then(res => {
      setData(res.data.admins);
      console.log(res.data);
      setTotalPages(res.data.totalPage);
    });
  }, []);

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

  // 관리자 이메일 검색 기능
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  // 정렬 기능
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
      setSelectedRows(data.map(item => item.adminId));
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
      id => !(data.find(row => row.adminId === id)?.adminActive === '탈퇴'),
    );
    setDeleteRowIds(deletableRows);
    onOpen();
  };

  const confirmDelete = () => {
    console.log('이 회원을 삭제하시겠습니까?', deleteRowIds);
    axiosInstance
      .delete(`/admin/delete/${deleteRowIds}`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
    // setData(prevData =>
    //   prevData.filter(row => !deleteRowIds.includes(row.adminId)),
    // );
    setSelectedRows([]);
    onClose();
  };

  const changePermission = (id: number, newPermission: string) => {
    setData(prevData =>
      prevData.map(row =>
        row.adminId === id ? { ...row, 권한: newPermission } : row,
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
                    icon={renderSortIcon('adminId')}
                    onClick={() => requestSort('adminId')}
                    aria-label="Sort ID"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  이메일
                  <IconButton
                    icon={renderSortIcon('adminEmail')}
                    onClick={() => requestSort('adminEmail')}
                    aria-label="Sort 이메일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  관리자생성일
                  <IconButton
                    icon={renderSortIcon('createdAt')}
                    onClick={() => requestSort('createdAt')}
                    aria-label="Sort 관리자생성일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  관리자수정일
                  <IconButton
                    icon={renderSortIcon('updatedAt')}
                    onClick={() => requestSort('updatedAt')}
                    aria-label="Sort 마지막관리자수정일"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  관리자상태
                  <IconButton
                    icon={renderSortIcon('adminActive')}
                    onClick={() => requestSort('adminActive')}
                    aria-label="Sort 관리자상태"
                    size="xs"
                    ml={2}
                  />
                </Th>
                {/*<Th textAlign="center" fontWeight="bold" fontSize="1rem">*/}
                {/*  권한*/}
                {/*  <IconButton*/}
                {/*    icon={renderSortIcon('권한')}*/}
                {/*    onClick={() => requestSort('권한')}*/}
                {/*    aria-label="Sort 권한"*/}
                {/*    size="xs"*/}
                {/*    ml={2}*/}
                {/*  />*/}
                {/*</Th>*/}
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
                <Tr key={row.adminId}>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={selectedRows.includes(row.adminId)}
                      onChange={() => handleSelectRow(row.adminId)}
                    />
                  </Td>
                  <Td textAlign="center">{row.adminId}</Td>
                  {/*<Td textAlign="center">{row.관리자명}</Td>*/}
                  <Td textAlign="center">{row.adminEmail}</Td>
                  <Td textAlign="center">{row.createdAt}</Td>
                  <Td textAlign="center">{row.updatedAt}</Td>
                  <Td textAlign="center">{row.adminActive}</Td>
                  {/*<Td textAlign="center">{row.권한}</Td>*/}
                  <Td textAlign="center">
                    {/*<Button*/}
                    {/*  colorScheme="blue"*/}
                    {/*  onClick={() =>*/}
                    {/*    changePermission(*/}
                    {/*      row.adminId,*/}
                    {/*      row.권한 === '열람' ? '편집' : '열람',*/}
                    {/*    )*/}
                    {/*  }*/}
                    {/*  isDisabled={!currentUserCanChangePermissions}*/}
                    {/*>*/}
                    {/*  권한변경*/}
                    {/*</Button>*/}
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(row.adminId)}
                      // isDisabled={
                      //   row.adminActive === 'active' || row.권한 === '관리자'
                      // }
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
