import { TxType } from '@bnb-chain/zkbas-js-sdk';
import { useQuery } from '@tanstack/react-query';
import { TABLE_PAGE_SIZE } from 'common/constants';
import { zkbasClient } from 'config/zkbasClient';

/**
 * @page page number
 * @name 'sher.legend'
 */
export const useFetchTxsByName = (page: number, name: string) =>
  useQuery(
    ['getTxsByAccountName', page, name],
    async () => {
      if (!name) return;
      return await zkbasClient.getTxsByAccountName({
        accountName: name,
        limit: TABLE_PAGE_SIZE,
        offset: (page - 1) * TABLE_PAGE_SIZE,
        types: [
          TxType.TxTypeDeposit,
          TxType.TxTypeDepositNft,
          TxType.TxTypeWithdraw,
          TxType.TxTypeWithdrawNft,
          TxType.TxTypeTransfer,
          TxType.TxTypeTransferNft,
        ],
      });
    },
    {
      keepPreviousData: true,
      cacheTime: 5000,
    },
  );
