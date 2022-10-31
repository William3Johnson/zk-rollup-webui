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
import {
  Box,
  HStack,
  IconButton,
  Image,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { userState } from 'atom/userState';
import {
  INIT_CURRENT_PAGE,
  NFT_MARKET_PLACE_ASSET,
  TABLE_PAGE_SIZE,
  TRANSFTER_NFT_URL,
  WITHDRAW_NFT_URL,
  ZERO_NFT_PRICE,
} from 'common/constants';
import TransferIcon from 'components/icons/TransferIcon';
import WithdrawIcon from 'components/icons/WithdrawIcon';
import { useFetchNftsByAccountName } from 'hooks/api/useFetchNftsByAccountName';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

export const ZkNftTable: React.FC = () => {
  const user = useRecoilValue(userState);
  const router = useRouter();

  const [page, setPage] = useState<number>(INIT_CURRENT_PAGE);
  const { data: nfts } = useFetchNftsByAccountName(user.l2.name, page);

  const { pages, pagesCount, currentPage, setCurrentPage, isDisabled } = usePagination({
    total: nfts?.total,
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
                NFT Name
              </Td>
              <Td w='150px' color='#76808F'>
                Token ID
              </Td>
              <Td color='#76808F'>Price(BNB)</Td>
              <Td color='#76808F'>Action</Td>
            </Tr>
          </Thead>
          <Tbody>
            {nfts?.assets.map((nft) => {
              return (
                <Tr key={nft.value}>
                  <Td>
                    <HStack>
                      <Image
                        boxSize='24px'
                        src={nft.image}
                        alt={nft.label}
                        fallback={<Box width='24px' height='24px' bg='gray.100' />}
                      />
                      <Link
                        color='#5445FF'
                        target='_blank'
                        href={`${NFT_MARKET_PLACE_ASSET}/${nft.id}`}
                      >
                        {nft.label}
                      </Link>
                    </HStack>
                  </Td>
                  <Td>{nft.value}</Td>
                  <Td>{nft.price || ZERO_NFT_PRICE}</Td>
                  <Td>
                    <IconButton
                      aria-label='transfer'
                      title='transfer'
                      icon={<TransferIcon />}
                      size='sm'
                      bg='#F5F5F5'
                      marginRight='5px'
                      onClick={() => {
                        router.push({
                          pathname: TRANSFTER_NFT_URL,
                          query: {
                            id: nft.nftId,
                          },
                        });
                      }}
                    />
                    <IconButton
                      aria-label='withdraw'
                      title='withdraw'
                      icon={<WithdrawIcon boxSize={18} />}
                      size='sm'
                      fontSize='30px'
                      bg='#F5F5F5'
                      onClick={() => {
                        router.push({
                          pathname: WITHDRAW_NFT_URL,
                          query: {
                            id: nft.nftId,
                          },
                        });
                      }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {nfts?.total !== 0 && (
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
