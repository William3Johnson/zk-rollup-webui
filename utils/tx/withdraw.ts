import NiceModal from '@ebay/nice-modal-react';
import TxFeedback from 'components/modal/TxFeedback';
import { zkbasClient } from 'config/zkbasClient';
import { ethers } from 'ethers';
import { getSeed } from '../crypto';

interface IWithdrawTX {
  fromAccountName: string;
  toAddress: string;
  assetId: number;
  amount: string;
  gasFeeAssetId: number;
  gasFeeAssetAmount: string;
}

export const getWithdrawTX = async ({
  fromAccountName,
  toAddress,
  assetId,
  amount,
  gasFeeAssetId,
  gasFeeAssetAmount,
}: IWithdrawTX) => {
  try {
    const parseAmount = ethers.utils.parseEther(amount.toString()).toString();
    const parseGasFeeAmount = ethers.utils.parseEther(gasFeeAssetAmount.toString()).toString();
    const fromAccount = await zkbasClient.getAccountByName(fromAccountName);
    const { nonce: fromAccountNonce } = await zkbasClient.getNextNonce(fromAccount.index);
    const gasAccount = await zkbasClient.getGasAccount();
    const expiredAt = Math.floor(new Date().getTime()) + 7200000;
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    const ethWallet = ethersProvider.getSigner();
    const seed = await getSeed(ethWallet);

    const { ZkCrypto } = await import('@bnb-chain/zkbas-js-sdk/zkCrypto/web');
    const Z = await ZkCrypto();
    const seedString = new TextDecoder().decode(seed);

    const segment = {
      from_account_index: fromAccount.index,
      asset_id: assetId,
      asset_amount: parseAmount,
      gas_account_index: gasAccount.index,
      gas_fee_asset_id: gasFeeAssetId,
      gas_fee_asset_amount: parseGasFeeAmount,
      memo: 'withdraw memo',
      to_address: toAddress,
      expired_at: expiredAt,
      nonce: fromAccountNonce,
    };

    const transaction = Z.signWithdraw(seedString, JSON.stringify(segment));
    return transaction;
  } catch (err) {
    if (err instanceof Error) {
      NiceModal.show(TxFeedback, { status: 'failure', title: err.message });
    }
    return;
  }
};
