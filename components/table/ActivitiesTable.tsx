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
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  TableContainer,
  Table as ChTable,
  Thead,
  Tr,
  Td,
  Tbody,
  Link,
  Box,
  IconButton,
} from '@chakra-ui/react';
import { userState } from 'atom/userState';
import {
  INIT_CURRENT_PAGE,
  NFT_MARKET_PLACE_ASSET,
  TABLE_PAGE_SIZE,
  ZK_TRACE_TX_ADDRESS,
} from 'common/constants';
import { From, To } from 'components/FromTo';
import DepositIcon from 'components/icons/DepositIcon';
import TransferIcon from 'components/icons/TransferIcon';
import WithdrawIcon from 'components/icons/WithdrawIcon';
import { ethers } from 'ethers';
import { useFetchGasFeeAssets } from 'hooks/api/useFetchGasFeeAssets';
import { useFetchTxsByName } from 'hooks/api/useFetchTxsByName';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { fromNow } from 'utils/time';
import { format8, getAssetById } from 'utils/tools';
import { getTxStatus, isNFT } from 'utils/txFormat';

export const ActivitiesTable: React.FC = () => {
  const login = useRecoilValue(userState);
  const [page, setPage] = useState<number>(INIT_CURRENT_PAGE);

  const { data: txsInfo } = useFetchTxsByName(page, login.l2.name);
  const { data: gasFees } = useFetchGasFeeAssets();

  const { pages, pagesCount, currentPage, setCurrentPage, isDisabled } = usePagination({
    total: txsInfo?.total,
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
    <>
      <TableContainer>
        <ChTable variant='simple'>
          <Thead>
            <Tr>
              <Td w='150px' color='#76808F'>
                Activity Type
              </Td>
              <Td w='150px' color='#76808F'>
                From
              </Td>
              <Td color='#76808F'>To</Td>
              <Td color='#76808F'>Amount</Td>
              <Td color='#76808F'>Token ID</Td>
              <Td color='#76808F'>Gas Price(L2)</Td>
              <Td color='#76808F'>Create Time</Td>
              <Td color='#76808F'>Status</Td>
            </Tr>
          </Thead>
          <Tbody>
            {txsInfo?.txs.map((tx, index) => {
              const typeMsg = TxTypeMap[tx.type].typeMsg;
              const Icon = TxTypeMap[tx.type].icon;
              const statusInfo = getTxStatus(tx.status);

              return (
                <Tr key={index}>
                  <Td>
                    {Icon && <Icon w='14px' />} {typeMsg}
                  </Td>

                  <From tx={tx} />

                  <To tx={tx} />

                  <Td>
                    {tx.amount === '0' ? (
                      '-'
                    ) : (
                      <>
                        {format8(ethers.BigNumber.from(tx.amount))}
                        {tx.asset_name}
                      </>
                    )}
                  </Td>
                  <Td>
                    {isNFT(tx.type) ? (
                      <>
                        {
                          <Link
                            target='_blank'
                            href={`${NFT_MARKET_PLACE_ASSET}/nftIndex/${tx.nft_index}`}
                            color='#5445FF'
                          >
                            #{tx.nft_index}
                          </Link>
                        }
                      </>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>
                    <>
                      {format8(ethers.BigNumber.from(tx.gas_fee))}
                      {gasFees && getAssetById(gasFees.assets, tx.gas_fee_asset_id)?.symbol}
                    </>
                  </Td>
                  <Td>{fromNow(tx.created_at)}</Td>
                  <Td>
                    <Box as='span' color={statusInfo.color} marginRight='5px'>
                      {statusInfo.text}
                    </Box>
                    <IconButton
                      as='a'
                      href={`${ZK_TRACE_TX_ADDRESS}${tx.hash}`}
                      target='_blank'
                      size='sm'
                      color=''
                      bg='#F5F5F5'
                      aria-label='explorer'
                      icon={<ExternalLinkIcon />}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </ChTable>
      </TableContainer>
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
    </>
  );
};

interface ITxType {
  typeMsg: string;
  icon?: React.ElementType;
}

const TxTypeMap: ITxType[] = [
  {
    typeMsg: 'Empty',
  },
  {
    typeMsg: 'Register Zns',
  },
  {
    typeMsg: 'Deposit',
    icon: (props) => <DepositIcon {...props} />,
  },
  {
    typeMsg: 'Deposit Nft',
    icon: (props) => <DepositIcon {...props} />,
  },
  {
    typeMsg: 'Transfer',
    icon: (props) => <TransferIcon {...props} />,
  },
  {
    typeMsg: 'Withdraw',
    icon: (props) => <WithdrawIcon {...props} />,
  },
  {
    typeMsg: 'Create Collection',
  },
  {
    typeMsg: 'Mint Nft',
  },
  {
    typeMsg: 'Transfer Nft',
    icon: (props) => <TransferIcon {...props} />,
  },
  {
    typeMsg: 'Atomic Match',
  },
  {
    typeMsg: 'Cancel Offer',
  },
  {
    typeMsg: 'Withdraw Nft',
    icon: (props) => <WithdrawIcon {...props} />,
  },
  {
    typeMsg: 'Full Exit',
  },
  {
    typeMsg: 'Full Exit Nft',
  },
];
