import { useQuery } from '@tanstack/react-query';
import { INVALID_VALUE } from 'common/constants';
import { zkbasClient } from 'config/zkbasClient';

export const useFetchGasFee = (assetId: number, txType: number) =>
  useQuery(
    ['getGasFee', assetId, txType],
    async () => {
      if (isNaN(assetId) || assetId === INVALID_VALUE) return;
      return await zkbasClient.getGasFee(assetId, txType);
    },
    {
      cacheTime: 10000,
      staleTime: 30000,
    },
  );
