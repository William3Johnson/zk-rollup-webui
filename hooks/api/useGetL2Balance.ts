import { useQuery } from '@tanstack/react-query';
import { zkbasClient } from 'config/zkbasClient';
import { BigNumber } from 'ethers';
import { format8 } from 'utils/tools';

const defaultValue = { count: '', isZero: true };

export const useGetL2Balance = (accountName: string, symbol: string) => {
  return useQuery(
    ['getL2Balance', accountName, symbol],
    async () => {
      if (accountName === '' || symbol === '') return defaultValue;

      const accountInfo = await zkbasClient.getAccountByName(accountName);
      const res = accountInfo?.assets.find((asset) => asset.name === symbol);

      if (!res) {
        return {
          count: '0',
          isZero: true,
        };
      }

      const resBalance = BigNumber.from(res.balance) ?? BigNumber.from('0');
      const balance = format8(resBalance);

      return {
        count: balance.toString(),
        isZero: resBalance.isZero(),
      };
    },
    {
      cacheTime: 0,
      staleTime: 0,
      initialData: defaultValue,
    },
  );
};
