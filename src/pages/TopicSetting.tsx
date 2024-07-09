import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import ConfirmModal from '../Components/common/ConfirmModal';
import Pagination from '../Components/common/Pagination';
import useTopicSetting from '../hooks/useTopicSetting'; // 커스텀 훅 임포트

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
  const {
    topics,
    sortConfig,
    selectedRows,
    // image,
    // excel,
    // uploadTopicId,
    currentPage,
    totalPages,
    setImage,
    setExcel,
    // setUploadTopicId,
    setCurrentPage,
    handleSelectAll,
    handleSelectRow,
    handleDelete,
    handleBulkDelete,
    confirmDelete,
    handleUpload,
    requestSort,
    sortedData,
  } = useTopicSetting();

  const { isOpen, onClose } = useDisclosure();

  const renderSortIcon = (key: keyof (typeof topics)[0]) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      );
    }
    return <ChevronDownIcon />;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <Button onClick={event => handleUpload(event)}>업로드</Button>
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
                    icon={renderSortIcon('topicQuestionCount')}
                    onClick={() => requestSort('topicQuestionCount')}
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
                {/*<Th textAlign="center">이미지 업로드</Th>*/}
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
                  <Td textAlign="center">{topic.topicQuestionCount}</Td>
                  <Td textAlign="center">{topic.topicStatus}</Td>
                  <Td textAlign="center">
                    {formatDate(topic.topicUpdateDate)}
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(topic.topicId)}
                      isDisabled={topic.topicStatus === 'inactive'}
                    >
                      삭제
                    </Button>
                  </Td>
                  {/*<Td textAlign="center">*/}
                  {/*  <Button*/}
                  {/*    colorScheme="blue"*/}
                  {/*    onClick={() => {*/}
                  {/*      setUploadTopicId(topic.topicId);*/}
                  {/*      handleImageUpload(topic.topicId);*/}
                  {/*    }}*/}
                  {/*    isDisabled={!image || uploadTopicId !== topic.topicId}*/}
                  {/*  >*/}
                  {/*    {topic.imageUrl && (*/}
                  {/*      <img*/}
                  {/*        src={topic.imageUrl}*/}
                  {/*        alt={`Topic ${topic.topicId} 이미지`}*/}
                  {/*        style={{ width: '50px', height: '50px' }}*/}
                  {/*      />*/}
                  {/*    )}*/}
                  {/*  </Button>*/}
                  {/*</Td>*/}
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
        body="정말로 이 주제 및 하위 문제를 삭제하시겠습니까?"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default TopicSetting;
