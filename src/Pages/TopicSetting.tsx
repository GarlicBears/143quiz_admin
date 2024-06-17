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
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import ConfirmModal from '../Components/common/ConfirmModal';

interface TopicItem {
  id: number;
  주제명: string;
  주제최초생성일자: string;
  포함된문제수: number;
  상태: string;
  삭제일자: string | null;
}

interface SortConfig {
  key: keyof TopicItem;
  direction: 'ascending' | 'descending';
}

const TopicSetting = () => {
  const [topics, setTopics] = useState<TopicItem[]>([
    // 초기 데이터 예시
  ]);

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteRowIds, setDeleteRowIds] = useState<number[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [excel, setExcel] = useState<File | null>(null);

  const requestSort = (key: keyof TopicItem) => {
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
    const sortableItems = [...topics];
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
  }, [topics, sortConfig]);

  const handleSelectAll = () => {
    if (selectedRows.length === topics.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(topics.map(item => item.id));
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
      id => topics.find(topic => topic.id === id)?.상태 !== '삭제된 주제',
    );
    setDeleteRowIds(deletableRows);
    onOpen();
  };

  const confirmDelete = () => {
    console.log('이 주제를 삭제하시겠습니까?', deleteRowIds);
    setTopics(prevData =>
      prevData.map(topic =>
        deleteRowIds.includes(topic.id)
          ? {
              ...topic,
              상태: '삭제된 주제',
              삭제일자: new Date().toISOString(),
            }
          : topic,
      ),
    );
    setSelectedRows([]);
    onClose();
  };

  const handleUpload = () => {
    if (image && excel) {
      // 이미지와 엑셀 파일을 업로드하여 새로운 주제를 생성하는 로직을 추가하세요.
      // 예시로, 새로운 주제를 추가하는 코드를 작성했습니다.
      const newTopic: TopicItem = {
        id: topics.length + 1,
        주제명: `New Topic ${topics.length + 1}`,
        주제최초생성일자: new Date().toISOString(),
        포함된문제수: 0, // 실제 문제 수를 엑셀 파일에서 파싱하여 설정
        상태: '정상',
        삭제일자: null,
      };
      setTopics([...topics, newTopic]);
      setImage(null);
      setExcel(null);
    }
  };

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
          <Button onClick={handleUpload} isDisabled={!image || !excel}>
            업로드
          </Button>
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
                <Th textAlign="center">
                  <Button onClick={() => requestSort('id')}>ID</Button>
                </Th>
                <Th textAlign="center">
                  <Button onClick={() => requestSort('주제명')}>주제명</Button>
                </Th>
                <Th textAlign="center">
                  <Button onClick={() => requestSort('주제최초생성일자')}>
                    주제 최초 생성일자
                  </Button>
                </Th>
                <Th textAlign="center">
                  <Button onClick={() => requestSort('포함된문제수')}>
                    포함된 문제 수
                  </Button>
                </Th>
                <Th textAlign="center">
                  <Button onClick={() => requestSort('상태')}>상태</Button>
                </Th>
                <Th textAlign="center">
                  <Button onClick={() => requestSort('삭제일자')}>
                    삭제일자
                  </Button>
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
                <Tr key={topic.id}>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={selectedRows.includes(topic.id)}
                      onChange={() => handleSelectRow(topic.id)}
                    />
                  </Td>
                  <Td textAlign="center">{topic.id}</Td>
                  <Td textAlign="center">{topic.주제명}</Td>
                  <Td textAlign="center">{topic.주제최초생성일자}</Td>
                  <Td textAlign="center">{topic.포함된문제수}</Td>
                  <Td textAlign="center">{topic.상태}</Td>
                  <Td textAlign="center">{topic.삭제일자}</Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(topic.id)}
                      isDisabled={topic.상태 === '삭제된 주제'}
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
