import React from 'react';
import { Button, Flex, IconButton } from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@chakra-ui/icons';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Flex as="nav" justify="center" mt={4} align="center">
      <IconButton
        icon={<ArrowLeftIcon />}
        onClick={() => onPageChange(1)}
        isDisabled={currentPage === 1}
        aria-label="Go to first page"
        mx={1}
      />
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        aria-label="Go to previous page"
        mx={1}
      />
      {pages.map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          isActive={page === currentPage}
          mx={1}
          size="sm"
        >
          {page}
        </Button>
      ))}
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        aria-label="Go to next page"
        mx={1}
      />
      <IconButton
        icon={<ArrowRightIcon />}
        onClick={() => onPageChange(totalPages)}
        isDisabled={currentPage === totalPages}
        aria-label="Go to last page"
        mx={1}
      />
    </Flex>
  );
};

export default Pagination;
