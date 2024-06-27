import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  FormControl,
  FormLabel,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import ConfirmModal from '../Components/common/ConfirmModal';
import axios from 'axios';
import axiosInstance from '../API/axiosInstance';

interface TopicItem {
  topicId: number;
  topicText: string;
  topicStatus: string;
  topicCreationDate: string;
  topicUpdateDate: string;
  topicUsageCount: number;
}

interface SortConfig {
  key: keyof TopicItem;
  direction: 'ascending' | 'descending';
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleString('ko-KR', options).replace(',', '');
};

const TopicSetting = () => {
  // 상태 선언
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteRowIds, setDeleteRowIds] = useState<number[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [excel, setExcel] = useState<File | null>(null);

  // API 호출 함수
  const getTopicData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/admin/topics');
      const data = response.data;
      if (Array.isArray(data.topics)) {
        setTopics(data.topics);
      } else {
        console.error('Response data does not contain topics array:', data);
      }
    } catch (error) {
      console.error('Error fetching topic data:', error);
    }
  }, []);

  useEffect(() => {
    getTopicData();
  }, [getTopicData]);

  // 정렬 요청 함수
  const requestSort = (key: keyof TopicItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    const sortableItems = [...topics];
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      sortableItems.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue === null) return direction === 'ascending' ? -1 : 1;
        if (bValue === null) return direction === 'ascending' ? 1 : -1;
        return direction === 'ascending'
          ? aValue < bValue
            ? -1
            : 1
          : aValue > bValue
            ? -1
            : 1;
      });
    }
    return sortableItems;
  }, [topics, sortConfig]);

  // 모든 행 선택/선택 해제 함수
  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === topics.length
        ? []
        : topics.map(item => item.topicId),
    );
  };

  // 특정 행 선택/선택 해제 함수
  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id],
    );
  };

  // TODO : 서버의 주제 삭제 기능 구현
  // 특정 주제 삭제 요청 함수
  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/topic/${id}`);
      const data = response.data;
      console.log('Deleted topic:');
      console.log(data);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }

    setDeleteRowIds([id]);
    onOpen();
  };

  // 선택된 주제 일괄 삭제 요청 함수
  const handleBulkDelete = () => {
    const deletableRows = selectedRows.filter(
      id =>
        topics.find(topic => topic.topicId === id)?.topicStatus !==
        '삭제된 주제',
    );
    setDeleteRowIds(deletableRows);
    onOpen();
  };

  // 주제 삭제 확인 및 실제 삭제 함수
  const confirmDelete = async () => {
    try {
      // 각 주제에 대해 삭제 요청을 서버로 보냄
      for (const id of deleteRowIds) {
        await axiosInstance.delete(`/admin/topic/${id}`);
      }
    } catch (error) {
      console.error('Error deleting topics:', error);
    }
    setTopics(prevData =>
      prevData.map(topic =>
        deleteRowIds.includes(topic.topicId)
          ? {
              ...topic,
              topicStatus: '삭제된 주제',
              topicUpdateDate: new Date().toISOString(),
            }
          : topic,
      ),
    );
    setSelectedRows([]);
    onClose();
  };

  // 이미지 및 엑셀 파일 업로드 처리 함수
  // TODO: 이미지 및 엑셀 파일 업로드 및 서버에 저장하기 구현
  // TODO : 이미지 업로드 및 서버에 저장하기
  const handleUpload = async () => {
    // if (image && excel) {
    try {
      axiosInstance.post('/admin/topic/upload-excel', excel).then(res => {
        console.log(res);
      });
    } catch (error) {
      console.error('Error uploading excel:', error);
    }
    if (excel) {
      const newTopic: TopicItem = {
        topicId: topics.length + 1,
        topicText: `New Topic ${topics.length + 1}`,
        topicCreationDate: new Date().toISOString(),
        topicUpdateDate: new Date().toISOString(),
        topicUsageCount: 0,
        topicStatus: '정상',
      };
      setTopics([...topics, newTopic]);
      setImage(null);
      setExcel(null);
    }
  };

  // 정렬 아이콘 렌더링 함수
  const renderSortIcon = (key: keyof TopicItem) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      );
    }
    return <ChevronDownIcon />;
  };

  // JSX 렌더링
  return (
    <>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>이미지 업로드</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={e =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>엑셀 업로드</FormLabel>
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={e =>
                setExcel(e.target.files ? e.target.files[0] : null)
              }
            />
          </FormControl>
          {/*<Button onClick={handleUpload} isDisabled={!image || !excel}>*/}
          <Button onClick={handleUpload}>업로드</Button>
        </HStack>
        <TableContainer>
          <Table
            variant="simple"
            size="md"
            colorScheme="blackAlpha"
            border="1px"
            borderColor="gray.400"
          >
            <TableCaption>주제 관리 테이블</TableCaption>
            <Thead>
              <Tr>
                <Th textAlign="center">
                  <Checkbox
                    isChecked={selectedRows.length === topics.length}
                    onChange={handleSelectAll}
                  />
                </Th>
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
                  생성일자
                  <IconButton
                    icon={renderSortIcon('topicCreationDate')}
                    onClick={() => requestSort('topicCreationDate')}
                    aria-label="Sort 주제 최초 생성일자"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  문제 수
                  <IconButton
                    icon={renderSortIcon('topicUsageCount')}
                    onClick={() => requestSort('topicUsageCount')}
                    aria-label="Sort 문제 수"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  상태
                  <IconButton
                    icon={renderSortIcon('topicStatus')}
                    onClick={() => requestSort('topicStatus')}
                    aria-label="Sort 상태"
                    size="xs"
                    ml={2}
                  />
                </Th>
                <Th textAlign="center" fontWeight="bold" fontSize="1rem">
                  수정일자
                  <IconButton
                    icon={renderSortIcon('topicUpdateDate')}
                    onClick={() => requestSort('topicUpdateDate')}
                    aria-label="Sort 삭제일자"
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
              {sortedData.map(topic => (
                <Tr key={topic.topicId}>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={selectedRows.includes(topic.topicId)}
                      onChange={() => handleSelectRow(topic.topicId)}
                    />
                  </Td>
                  <Td textAlign="center">{topic.topicId}</Td>
                  <Td textAlign="center">{topic.topicText}</Td>
                  <Td textAlign="center">
                    {formatDate(topic.topicCreationDate)}
                  </Td>
                  <Td textAlign="center">{topic.topicUsageCount}</Td>
                  <Td textAlign="center">{topic.topicStatus}</Td>
                  <Td textAlign="center">
                    {formatDate(topic.topicUpdateDate)}
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(topic.topicId)}
                      isDisabled={topic.topicStatus === '삭제된 주제'}
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
      <ConfirmModal
        body="정말로 이 주제 및 하위 문제를 삭제하시겠습니까?"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default TopicSetting;
