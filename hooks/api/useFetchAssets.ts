import { useQuery } from '@tanstack/react-query';
import { zkbasClient } from 'config/zkbasClient';

// TODO: not total
// All allowed asset
export const useFetchAssets = () => {
  return useQuery(
    ['getAssets'],
    async () => {
      return await zkbasClient.getAssets(0, 50);
    },
    {
      cacheTime: 10000,
      staleTime: 30000,
    },
  );
};
