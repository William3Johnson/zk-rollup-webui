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
import { Box, IconButton, Table, TableContainer, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import { userState } from 'atom/userState';
import {
  INIT_CURRENT_PAGE,
  TABLE_PAGE_SIZE,
  TRANSFTER_TOKEN_URL,
  WITHDRAW_TOKEN_URL,
} from 'common/constants';
import TransferIcon from 'components/icons/TransferIcon';
import WithdrawIcon from 'components/icons/WithdrawIcon';
import { ethers } from 'ethers';
import { useFetchAccountByName } from 'hooks/api/useFetchAccountByName';
import { useFetchAssets } from 'hooks/api/useFetchAssets';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { format4, getPrice, getValue } from 'utils/tools';

interface IL2Token {
  id: number;
  token: string;
  price: string;
  amount: string;
  value: string;
}

export const ZkTokenTable: React.FC = () => {
  const user = useRecoilValue(userState);
  const router = useRouter();

  const { data: accountInfo } = useFetchAccountByName(user.l2.name);
  const [l2Token, setL2Token] = useState<IL2Token[]>([]);
  const { data: currentPricesInfo } = useFetchAssets();

  const { pages, pagesCount, currentPage, setCurrentPage, isDisabled } = usePagination({
    total: accountInfo?.assetList.length,
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

  useEffect(() => {
    (async () => {
      if (!accountInfo) return;

      const userAssets = accountInfo.meta.assets;
      const res: IL2Token[] = [];

      if (!currentPricesInfo || !currentPricesInfo.assets) return;

      userAssets.forEach((asset) => {
        const assetPrice = asset.price;
        const amount = format4(ethers.BigNumber.from(asset.balance)) || '0';
        const value = getValue(assetPrice, amount);

        const temp: IL2Token = {
          id: asset.id,
          token: asset.name,
          price: getPrice(assetPrice),
          amount,
          value,
        };

        res.push(temp);
      });

      setL2Token(res);
    })();
  }, [accountInfo, currentPricesInfo]);

  return (
    <Box>
      <TableContainer mt='15px'>
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
              <Td color='#76808F'>Action</Td>
            </Tr>
          </Thead>
          <Tbody>
            {l2Token
              .slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE)
              .map((token) => {
                return (
                  <Tr key={token.id}>
                    <Td>{token.token}</Td>
                    <Td>${token.price}</Td>
                    <Td>{token.amount}</Td>
                    <Td>${token.value}</Td>
                    <Td>
                      {/* <IconButton
                                aria-label='swap'
                                title='swap'
                                icon={<AtomSwapIcon />}
                                size='sm'
                                bg='#F5F5F5'
                                marginRight='5px'
                                onClick={() => {
                                  router.push(SWAP_URL);
                                }}
                              /> */}
                      <IconButton
                        aria-label='transfer'
                        title='transfer'
                        icon={<TransferIcon />}
                        size='sm'
                        bg='#F5F5F5'
                        marginRight='5px'
                        onClick={() => {
                          router.push({
                            pathname: TRANSFTER_TOKEN_URL,
                            query: {
                              id: token.id,
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
                            pathname: WITHDRAW_TOKEN_URL,
                            query: {
                              id: token.id,
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
      {accountInfo?.meta.assets.length !== 0 && (
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          isDisabled={isDisabled}
          onPageChange={(nextPage) => {
            setCurrentPage(nextPage);
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
