import NiceModal from '@ebay/nice-modal-react';
import TxFeedback from 'components/modal/TxFeedback';
import { Contract, ethers } from 'ethers';
import { BSCSCAN_TX_ADDRESS } from '../common/constants';
import { isEtherCallError, isJsonRpcError } from './error';

/**
 * @contract BNB contact
 * @acccount 'bob' not 'bob.legend'!
 */
export const depositBNB = async (contract: Contract, account: string, amount: string) => {
  const etherAmount = ethers.utils.parseEther(amount.toString()).toString();

  try {
    const res = await contract.depositBNB(account, {
      value: etherAmount,
    });
    const resWait = await res.wait();

    if (resWait) {
      NiceModal.show(TxFeedback, {
        status: 'success',
        href: `${BSCSCAN_TX_ADDRESS}${res.hash}`,
        hrefText: 'View in BscScan',
        okText: 'Deposit Again',
      });
    }
    return resWait;
  } catch (err) {
    let message = 'depsoit error';

    if (isJsonRpcError(err)) {
      if (err.code === 4001) {
        message = 'Transaction Canceled';
      } else {
        message = err.message;
      }
    } else if (isEtherCallError(err)) {
      message = err.error?.message ?? '';
    }

    NiceModal.show(TxFeedback, { status: 'failure', title: message });
    return;
  }
};
