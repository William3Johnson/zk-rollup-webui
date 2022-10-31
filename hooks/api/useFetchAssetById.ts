import { useQuery } from '@tanstack/react-query';
import { INVALID_VALUE } from 'common/constants';
import { zkbasClient } from 'config/zkbasClient';

export const useFetchAssetById = (id: number | undefined) => {
  return useQuery(
    ['getFetchAsset', id],
    async () => {
      if (id === undefined || isNaN(id) || id === INVALID_VALUE) return;
      return await zkbasClient.getAssetById(id);
    },
    {
      cacheTime: 10000,
      staleTime: 60000,
    },
  );
};
