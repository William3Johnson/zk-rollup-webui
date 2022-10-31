import { BNBChainId } from 'common/constants';
import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

export const useValidNetwork = () => {
  const { chain } = useNetwork();

  return useMemo(() => {
    if (chain?.id !== BNBChainId) return false;
    return true;
  }, [chain?.id]);
};
