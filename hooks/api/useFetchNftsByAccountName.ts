import { AccountName } from '@bnb-chain/zkbas-js-sdk';
import { useQuery } from '@tanstack/react-query';
import { TABLE_PAGE_SIZE } from 'common/constants';
import { getNftsList } from 'config/marketplaceClient';
import { getNftPrice } from 'utils/tools';

export const useFetchNftsByAccountName = (accountName: AccountName, page = 1) => {
  return useQuery(
    ['fetchAccountNft', accountName, page],
    async () => {
      const res = await getNftsList(accountName, page - 1, TABLE_PAGE_SIZE);

      const assets = res.assets
        // take out NFT NOT create on L2
        .filter((nft) => nft.nftIndex > -1)
        .map((nft) => {
          return {
            id: nft.id,
            nftId: nft.nftIndex,
            label: nft.name,
            value: nft.nftIndex,
            image: nft.imageThumb,
            price: getNftPrice(nft),
          };
        });

      return {
        assets,
        total: res.total,
      };
    },
    {
      cacheTime: 10000,
      staleTime: 80000,
      retry: false,
    },
  );
};
