import { useQuery } from '@tanstack/react-query';
import { getNftByNftId } from 'config/marketplaceClient';
import { isNaN } from 'lodash';

const defaultNft = { nftIndex: undefined, collectionName: '', name: '' };
export const NOT_EXIST_NFT = { nftIndex: -1, collectionName: '', name: '' };

export const useFetchYourNftInfoById = (id: string) => {
  return useQuery(
    ['fetchNftInfoById', id],
    async () => {
      const nftId = parseInt(id);
      if (isNaN(nftId)) return defaultNft;

      const res = await getNftByNftId(nftId);

      return res ? res.asset : NOT_EXIST_NFT;
    },
    {
      cacheTime: 0,
      staleTime: 0,
      retry: false,
      initialData: defaultNft,
    },
  );
};
