import { useQuery } from '@tanstack/react-query';
import { zkbasClient } from 'config/zkbasClient';

/**
 * get support gas fee type: BNB / BUSD
 */
export const useFetchGasFeeAssets = () =>
  useQuery(
    ['gasFeeAssets'],
    async () => {
      return await zkbasClient.getGasFeeAssets();
    },
    {
      cacheTime: 10000,
      staleTime: 30000,
    },
  );
