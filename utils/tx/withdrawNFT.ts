import NiceModal from '@ebay/nice-modal-react';
import TxFeedback from 'components/modal/TxFeedback';
import { zkbasClient } from 'config/zkbasClient';
import { ethers } from 'ethers';
import { getSeed } from '../crypto';

interface IWithdrarNFT {
  accountName: string;
  nftIndex: number;
  toAddress: string;
  gasFeeAssetId: string;
  gasFeeAssetAmount: string;
}

export const getWithdrawNFTTX = async ({
  accountName,
  nftIndex,
  toAddress,
  gasFeeAssetAmount,
  gasFeeAssetId,
}: IWithdrarNFT) => {
  try {
    const fromAccount = await zkbasClient.getAccountByName(accountName);
    const { nonce: fromAccountNonce } = await zkbasClient.getNextNonce(fromAccount.index);
    const gasAccount = await zkbasClient.getGasAccount();
    const parseGasFeeAmount = ethers.utils.parseEther(gasFeeAssetAmount.toString()).toString();
    const expiredAt = Math.floor(new Date().getTime()) + 7200000;
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    const ethWallet = ethersProvider.getSigner();
    const seed = await getSeed(ethWallet);

    const { ZkCrypto } = await import('@bnb-chain/zkbas-js-sdk/zkCrypto/web');
    const Z = await ZkCrypto();
    const seedString = new TextDecoder().decode(seed);

    const segment = {
      account_index: fromAccount.index,
      nft_index: nftIndex,
      to_address: toAddress,
      gas_account_index: gasAccount.index,
      gas_fee_asset_id: parseInt(gasFeeAssetId),
      gas_fee_asset_amount: parseGasFeeAmount,
      expired_at: expiredAt,
      nonce: fromAccountNonce,
    };

    const transaction = Z.signWithdrawNft(seedString, JSON.stringify(segment));
    return transaction;
  } catch (err) {
    if (err instanceof Error) {
      NiceModal.show(TxFeedback, { status: 'failure', title: err.message });
    }
    return;
  }
};
