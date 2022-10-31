import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from '@ajna/pagination';
import { Box, Link, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import { BSCSCAN_ACCOUNT_ADDRESS, INIT_CURRENT_PAGE, TABLE_PAGE_SIZE } from 'common/constants';
import { useGetAccountNfts } from 'hooks/zkbnb/useGetAccountNfts';
import React, { useState } from 'react';

export const L1NftTable: React.FC = () => {
  const accountNftList = useGetAccountNfts();

  const [page, setPage] = useState<number>(INIT_CURRENT_PAGE);

  const { pages, pagesCount, currentPage, setCurrentPage, isDisabled } = usePagination({
    total: accountNftList.length,
    limits: {
      outer: 2,
      inner: 2,
    },
    initialState: {
      pageSize: TABLE_PAGE_SIZE,
      isDisabled: false,
      currentPage: INIT_CURRENT_PAGE,
    },
  });

  return (
    <Box>
      <TableContainer mt='15px'>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Td w='150px' color='#76808F'>
                Token ID
              </Td>
              <Td w='150px' color='#76808F'>
                NFT Address
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            {accountNftList?.map((nft) => {
              return (
                <Tr key={nft.nftIndex}>
                  <Td>{nft.nftIndex}</Td>
                  <Td>
                    <Link
                      target='_blank'
                      href={`${BSCSCAN_ACCOUNT_ADDRESS}${nft.nftAddress}`}
                      color='#5445FF'
                    >
                      {nft.nftAddress}
                    </Link>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {accountNftList.length !== 0 && (
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          isDisabled={isDisabled}
          onPageChange={(nextPage) => {
            setCurrentPage(nextPage);
            setPage(nextPage);
          }}
        >
          <PaginationContainer align='center' justify='right' p={4} w='full'>
            <PaginationPrevious
              _hover={{
                bg: '#5445FF',
                color: '#F5F5F5',
              }}
              bg='#F5F5F5'
              color='#1E2026'
              h='24px'
              fontSize='14px'
              marginRight='4px'
            >
              <p>&lt; Previous</p>
            </PaginationPrevious>

            <PaginationPageGroup
              isInline
              align='center'
              separator={<PaginationSeparator bg='#F5F5F5' fontSize='sm' h='24px' jumpSize={4} />}
            >
              {pages.map((page: number) => (
                <PaginationPage
                  minW='24px'
                  h='24px'
                  key={`pagination_page_${page}`}
                  page={page}
                  marginRight='4px'
                  fontSize='sm'
                  bg='#F5F5F5'
                  _hover={{
                    bg: '#5445FF',
                    color: '#F5F5F5',
                  }}
                  _current={{
                    bg: '#5445FF',
                    color: '#F5F5F5',
                  }}
                />
              ))}
            </PaginationPageGroup>
            <PaginationNext
              _hover={{
                bg: '#5445FF',
                color: '#F5F5F5',
              }}
              bg='#F5F5F5'
              color='#1E2026'
              h='24px'
              fontSize='14px'
            >
              <p>Next &gt;</p>
            </PaginationNext>
          </PaginationContainer>
        </Pagination>
      )}
    </Box>
  );
};
