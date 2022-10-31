import NiceModal from '@ebay/nice-modal-react';
import { useQuery } from '@tanstack/react-query';
import TxFeedback from 'components/modal/TxFeedback';
import { Contract } from 'ethers';
import { ZKBAS_CONTRACT_ADDRESS } from 'common/constants';
import { isJsonRpcError } from 'utils/error';

/**
 * @contact BEP20 contract
 *
 * approve total supply amount
 */
export const useApproveBEP20 = (contract: Contract) => {
  return useQuery(
    ['approveBEP20', contract.address],
    async () => {
      const totalSupply = await contract.totalSupply();
      const res = await contract.approve(ZKBAS_CONTRACT_ADDRESS, totalSupply);
      await res.wait();
      return res;
    },
    {
      enabled: false,
      retry: false,
      onError: (err) => {
        let message = 'approve error';
        if (isJsonRpcError(err)) {
          if (err.code === 4001) {
            message = 'Transaction Canceled';
          } else {
            message = err.message;
          }
        }
        NiceModal.show(TxFeedback, { status: 'failure', title: message });
      },
    },
  );
};
