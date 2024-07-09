import { useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';

interface TopicItem {
  topicId: number;
  topicText: string;
  topicStatus: string;
  topicCreationDate: string;
  topicUpdateDate: string;
  topicQuestionCount: number;
  imageUrl?: string;
}

interface SortConfig {
  key: keyof TopicItem;
  direction: 'ascending' | 'descending';
}

const useTopicSetting = () => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteRowIds, setDeleteRowIds] = useState<number[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [excel, setExcel] = useState<File | null>(null);
  const [uploadTopicId, setUploadTopicId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const getTopicData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/admin/topics');
      const data = response.data;
      console.log('Fetched topic data:', data);
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

  const requestSort = (key: keyof TopicItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
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

        if (aValue === undefined) return direction === 'ascending' ? -1 : 1;
        if (bValue === undefined) return direction === 'ascending' ? 1 : -1;

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

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === topics.length
        ? []
        : topics.map(item => item.topicId),
    );
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/topic/${id}`);
      const data = response.data;
      console.log('Deleted topic:', data);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }

    setDeleteRowIds([id]);
  };

  const handleBulkDelete = () => {
    const deletableRows = selectedRows.filter(
      id =>
        topics.find(topic => topic.topicId === id)?.topicStatus !==
        '삭제된 주제',
    );
    setDeleteRowIds(deletableRows);
  };

  const confirmDelete = async () => {
    try {
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
  };

  const handleUpload = async (
    event: React.MouseEvent<HTMLButtonElement>,
    topicId?: number,
  ) => {
    event.preventDefault();

    if (excel && image) {
      const excelFormData = new FormData();
      excelFormData.append('excel', excel);
      const imageFormData = new FormData();
      imageFormData.append('image', image);

      try {
        const excelResponse = await axiosInstance.post(
          '/admin/topic/upload-excel',
          { excelFormData, imageFormData },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log(excelResponse.data);
        getTopicData();
        setExcel(null);
        const imageUrl = excelResponse.data.imageUrl;
        setTopics(prevData =>
          prevData.map(topic =>
            topic.topicId === topicId ? { ...topic, imageUrl } : topic,
          ),
        );
        setImage(null);
        setUploadTopicId(null);
      } catch (error) {
        console.error('Error uploading excel:', error);
      }
    }
  };

  return {
    topics,
    sortConfig,
    selectedRows,
    image,
    excel,
    uploadTopicId,
    currentPage,
    totalPages,
    itemsPerPage,
    setImage,
    setExcel,
    setUploadTopicId,
    setCurrentPage,
    handleSelectAll,
    handleSelectRow,
    handleDelete,
    handleBulkDelete,
    confirmDelete,
    handleUpload,
    requestSort,
    sortedData,
    setDeleteRowIds,
  };
};

export default useTopicSetting;
