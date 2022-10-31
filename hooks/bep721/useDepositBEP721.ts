import NiceModal from '@ebay/nice-modal-react';
import { useQuery } from '@tanstack/react-query';
import { BSCSCAN_TX_ADDRESS } from 'common/constants';
import TxFeedback from 'components/modal/TxFeedback';
import { useZkBNBContract } from 'hooks/contract/useZkBNBContract';

/**
 * @accountName 'bob' not 'bob.legend'
 */
export const useDepositBEP721 = (
  accountName: string,
  tokenIndex: string,
  contractAddress: string | undefined,
) => {
  const zkContract = useZkBNBContract();

  return useQuery(
    ['depositBEP721', accountName, tokenIndex],
    async () => {
      if (!contractAddress) return;

      try {
        const res = await zkContract.depositNft(accountName, contractAddress, parseInt(tokenIndex));
        const resWait = await res.wait();

        if (resWait) {
          NiceModal.show(TxFeedback, {
            status: 'success',
            href: `${BSCSCAN_TX_ADDRESS}${res.hash}`,
            hrefText: 'View in BscScan',
            okText: 'Deposit Again',
          });
        }
      } catch (err) {
        // console.log(err);
      }

      return null;
    },
    {
      cacheTime: 0,
      staleTime: 0,
      retry: false,
      enabled: false,
    },
  );
};
