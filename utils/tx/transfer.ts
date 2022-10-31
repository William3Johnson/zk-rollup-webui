import NiceModal from '@ebay/nice-modal-react';
import axios from 'axios';
import TxFeedback from 'components/modal/TxFeedback';
import { ethers } from 'ethers';
import { SUFFIX } from 'common/constants';
import { zkbasClient } from 'config/zkbasClient';
import { getAccountNameHash, getSeed } from '../crypto';
import { ErrorCode } from '../error';

interface ITransferTX {
  fromAccountName: string;
  toAccountName: string;
  assetId: number;
  assetAmount: string;
  gasFeeAssetId: number;
  gasFeeAssetAmount: string;
}

/**
 * @toAccountName 'bob.legend' not 'bob'
 */
export const getTransferTX = async ({
  fromAccountName,
  toAccountName,
  assetAmount,
  assetId,
  gasFeeAssetId,
  gasFeeAssetAmount,
}: ITransferTX) => {
  try {
    const fromAccount = await zkbasClient.getAccountByName(fromAccountName);
    const { nonce: fromAccountNonce } = await zkbasClient.getNextNonce(fromAccount.index);
    const toAccount = await zkbasClient.getAccountByName(toAccountName + SUFFIX);
    const gasAccount = await zkbasClient.getGasAccount();
    const expiredAt = Math.floor(new Date().getTime()) + 7200000;
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    const ethWallet = ethersProvider.getSigner();
    const seed = await getSeed(ethWallet);
    const { ZkCrypto } = await import('@bnb-chain/zkbas-js-sdk/zkCrypto/web');
    const Z = await ZkCrypto();
    const seedString = new TextDecoder().decode(seed);
    const toAccountHashName = await getAccountNameHash(toAccountName + SUFFIX);

    const parseAmount = ethers.utils.parseEther(assetAmount.toString());
    const parseGasFeeAmount = ethers.utils.parseEther(gasFeeAssetAmount);

    const segment = {
      from_account_index: fromAccount.index,
      to_account_index: toAccount.index,
      to_account_name: toAccountHashName,
      asset_id: assetId,
      asset_amount: parseAmount.toString(),
      gas_account_index: gasAccount.index,
      gas_fee_asset_id: gasFeeAssetId,
      gas_fee_asset_amount: parseGasFeeAmount.toString(),
      memo: 'transfer memo',
      call_data: 500 + '',
      expired_at: expiredAt,
      nonce: fromAccountNonce,
    };

    const transaction = Z.signTransfer(seedString, JSON.stringify(segment));
    return transaction;
  } catch (err) {
    if (err instanceof Error && axios.isAxiosError(err)) {
      const errInfo = (err.response?.data as string).split(':');
      const errCode = errInfo[0];
      const errMsg = ErrorCode[errCode];

      NiceModal.show(TxFeedback, { status: 'failure', title: `account ${errMsg}` });
    }

    return;
  }
};
