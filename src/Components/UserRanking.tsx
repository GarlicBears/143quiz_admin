import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

interface UserRankingProps {
  data: {
    userId: number;
    nickname: string;
    totalBadges: number;
    totalHearts: number;
    rank: number;
  }[];
}

const UserRanking: React.FC<UserRankingProps> = ({ data }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Nickname</Th>
            <Th>Total Badges</Th>
            <Th>Total Hearts</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(user => (
            <Tr key={user.userId}>
              <Td>{user.rank}</Td>
              <Td>{user.nickname}</Td>
              <Td>{user.totalBadges}</Td>
              <Td>{user.totalHearts}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UserRanking;
