import { Tx, TxType } from '@bnb-chain/zkbas-js-sdk';
import { Link, Td } from '@chakra-ui/react';
import { BSCSCAN_ACCOUNT_ADDRESS, ZK_TRACE_ACCOUNT_ADDRESS } from 'common/constants';
import React from 'react';
import { sliceAddress } from 'utils/tools';

export const From: React.FC<{ tx: Tx }> = (props) => {
  const { tx } = props;

  if (tx.type === TxType.TxTypeWithdraw || tx.type === TxType.TxTypeWithdrawNft) {
    return (
      <Td>
        <Link
          color='#5445FF'
          target='_blank'
          href={`${ZK_TRACE_ACCOUNT_ADDRESS}/${tx.account_name}`}
        >
          {tx.account_name}
        </Link>
      </Td>
    );
  }

  if (tx.type === TxType.TxTypeDeposit || tx.type === TxType.TxTypeDepositNft) {
    return (
      <Td>
        <Link
          color='#5445FF'
          target='_blank'
          href={`${BSCSCAN_ACCOUNT_ADDRESS}/${tx.native_address}`}
        >
          {sliceAddress(tx.native_address)}
        </Link>
      </Td>
    );
  }

  if (tx.type === TxType.TxTypeTransfer || tx.type === TxType.TxTypeTransferNft) {
    return (
      <Td>
        <Link
          color='#5445FF'
          target='_blank'
          href={`${ZK_TRACE_ACCOUNT_ADDRESS}/${tx.account_name}`}
        >
          {tx.account_name}
        </Link>
      </Td>
    );
  }

  return <Td>-</Td>;
};

export const To: React.FC<{ tx: Tx }> = (props) => {
  const { tx } = props;
  const info = JSON.parse(tx.info);

  if (tx.type === TxType.TxTypeWithdraw || tx.type === TxType.TxTypeWithdrawNft) {
    return (
      <Td>
        <Link color='#5445FF' target='_blank' href={`${BSCSCAN_ACCOUNT_ADDRESS}${info.ToAddress}`}>
          {sliceAddress(info.ToAddress)}
        </Link>
      </Td>
    );
  }

  if (tx.type === TxType.TxTypeDeposit || tx.type === TxType.TxTypeDepositNft) {
    return (
      <Td>
        <Link
          color='#5445FF'
          target='_blank'
          href={`${ZK_TRACE_ACCOUNT_ADDRESS}${tx.account_name}`}
        >
          {tx.account_name}
        </Link>
      </Td>
    );
  }

  if (tx.type === TxType.TxTypeTransfer || tx.type === TxType.TxTypeTransferNft) {
    return (
      <Td>
        <Link
          color='#5445FF'
          target='_blank'
          href={`${ZK_TRACE_ACCOUNT_ADDRESS}${tx.to_account_name}`}
        >
          {tx.to_account_name}
        </Link>
      </Td>
    );
  }

  return <Td>-</Td>;
};
