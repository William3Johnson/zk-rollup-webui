import { useQuery } from '@tanstack/react-query';
import { zkbasClient } from 'config/zkbasClient';

export const useFetchPair = () => {
  return useQuery(
    ['getPairs'],
    async () => {
      return await zkbasClient.getPairs(1, 50);
    },
    {
      cacheTime: 10000,
      staleTime: 60000,
    },
  );
};
