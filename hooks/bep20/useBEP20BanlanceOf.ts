import { useQuery } from '@tanstack/react-query';
import { BNB } from 'common/constants';
import { constants } from 'ethers';
import { format8, isZero } from 'utils/tools';
import { useAccount, useProvider } from 'wagmi';
import { useBEP20Contract } from '../contract/useBEP20Contract';

const defaultValue = { count: '', isZero: true };

export const useBEP20BanlanceOf = (symbol: string, tokenAddress: string) => {
  const { address } = useAccount();
  const provider = useProvider();
  const contract = useBEP20Contract(tokenAddress);

  return useQuery(
    ['getBEP20BalanceOf', symbol, tokenAddress, address],
    async () => {
      if (!address || contract.address === constants.AddressZero) {
        return defaultValue;
      }

      let amount = null;
      if (symbol === BNB) {
        amount = await provider.getBalance(address);
      } else {
        amount = await contract.balanceOf(address);
      }

      const count = format8(amount);
      return {
        count,
        isZero: isZero(amount),
      };
    },
    {
      cacheTime: 0,
      staleTime: 0,
      initialData: defaultValue,
    },
  );
};
