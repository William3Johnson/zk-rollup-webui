import NiceModal from '@ebay/nice-modal-react';
import TxFeedback from 'components/modal/TxFeedback';
import { zkbasClient } from 'config/zkbasClient';
import { ethers } from 'ethers';
import { getSeed } from '../crypto';

export const getSwapTX = async (
  fromAccountName: string,
  pairIndex: number,
  assetAId: number,
  assetAAmount: string,
  assetBId: number,
  assetBminAmount: string,
) => {
  try {
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
      pair_index: pairIndex,
      asset_a_id: assetAId,
      asset_a_amount: assetAAmount,
      asset_b_id: assetBId,
      asset_b_min_amount: assetBminAmount,
      asset_b_amount_delta: '',
      gas_fee_asset_id: 0,
      gas_fee_asset_amount: '3',
      expired_at: expiredAt,
      nonce: fromAccountNonce,
      gas_account_index: gasAccount.index,
    };

    const transaction = Z.signSwap(seedString, JSON.stringify(segment));
    return transaction;
  } catch (err) {
    if (err instanceof Error) {
      NiceModal.show(TxFeedback, { status: 'failure', title: err.message });
    }
    return;
  }
};
