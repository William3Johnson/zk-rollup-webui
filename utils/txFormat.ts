import { TxType } from '@bnb-chain/zkbas-js-sdk';

export const getTxStatus = (status: number): TxStausInfo => {
  return TxStatus[status];
};

export const isNFT = (index: number) => {
  return (
    index === TxType.TxTypeMintNft ||
    index === TxType.TxTypeDepositNft ||
    index === TxType.TxTypeFullExitNft ||
    index === TxType.TxTypeWithdrawNft ||
    index === TxType.TxTypeTransferNft
  );
};

type TxStatusType = 'Failed' | 'Pending' | 'Executed' | 'Packed' | 'Committed' | 'Verified';
type TxStausInfo = { text: TxStatusType; color: string };

export const TxStatus: Record<number, TxStausInfo> = {
  0: {
    text: 'Failed',
    color: '#F0B90B',
  },
  1: {
    text: 'Pending',
    color: '#F0B90B',
  },
  2: {
    text: 'Executed',
    color: '#02C076',
  },
  3: {
    text: 'Packed',
    color: '#F0B90B',
  },
  4: {
    text: 'Committed',
    color: '#02C076',
  },
  5: {
    text: 'Verified',
    color: '#02C076',
  },
};
