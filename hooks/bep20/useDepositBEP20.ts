import NiceModal from '@ebay/nice-modal-react';
import { useQuery } from '@tanstack/react-query';
import { BSCSCAN_TX_ADDRESS } from 'common/constants';
import TxFeedback from 'components/modal/TxFeedback';
import { Contract, ethers } from 'ethers';
import { isEtherCallError, isJsonRpcError } from 'utils/error';

/**
 * @contract ZKBNB Contract
 * @acccount 'bob' not 'bob.legend'!
 */
export const useDepositBEP20 = (
  contract: Contract,
  account: string,
  tokenAddress: string,
  amount: string,
) => {
  return useQuery(
    ['depositBEP20', contract.address, account, tokenAddress, amount],
    async () => {
      const etherAmount = ethers.utils.parseEther(amount.toString()).toString();

      const res = await contract.depositBEP20(tokenAddress, etherAmount, account);
      const resWait = await res.wait();

      if (resWait) {
        NiceModal.show(TxFeedback, {
          status: 'success',
          href: `${BSCSCAN_TX_ADDRESS}${res.hash}`,
          hrefText: 'View in BscScan',
          okText: 'Deposit Again',
        });
      }

      return res;
    },
    {
      enabled: false,
      retry: false,
      onError: (err) => {
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
      },
    },
  );
};
