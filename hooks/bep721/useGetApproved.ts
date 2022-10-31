import { constants, Contract } from 'ethers';
import { isUndefined } from 'lodash';
import { useEffect, useState } from 'react';
import { useBoolean } from 'react-use';
import { useAccount } from 'wagmi';

/**
 * get NFT approved status
 */
export const useGetApproved = (contract: Contract, nftIndex: number | undefined) => {
  const [approved, toggleApproved] = useBoolean(false);
  const [isYours, toggleIsYours] = useBoolean(false);
  const [loading, setLoading] = useState<'idle' | 'start' | 'end'>('idle');
  const { address } = useAccount();

  useEffect(() => {
    (async () => {
      setLoading('start');

      if (isUndefined(nftIndex)) return;

      try {
        const ownAddress = await contract.ownerOf(nftIndex);

        if (ownAddress === address) {
          toggleIsYours(true);
        } else {
          toggleIsYours(false);
        }
      } catch (err) {
        // ...
        toggleIsYours(false);
      }

      try {
        const approveRes = await contract.getApproved(nftIndex);

        if (approveRes === constants.AddressZero) {
          toggleApproved(false);
        } else {
          toggleApproved(true);
        }
      } catch (err) {
        // ...
        toggleApproved(false);
      }

      setLoading('end');
    })();
  }, [address, contract, toggleApproved, toggleIsYours, nftIndex]);

  return {
    approved,
    toggleApproved,
    isYours,
    loading,
  };
};
