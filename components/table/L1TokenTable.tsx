import { Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useGetBanlance } from 'hooks/useGetBanlance';
import { format4 } from 'utils/tools';

export const L1TokenTable = () => {
  const banlance = useGetBanlance();

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Td w='150px' color='#76808F'>
              Token
            </Td>
            <Td w='150px' color='#76808F'>
              Price
            </Td>
            <Td color='#76808F'>Amount</Td>
            <Td color='#76808F'>Value</Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td w='25%'>BNB</Td>
            <Td w='25%'>${banlance.price}</Td>
            <Td w='25%'>{format4(ethers.utils.parseUnits(banlance.amount || '0'))}</Td>
            <Td w='25%'>${banlance.value}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
