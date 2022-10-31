import { useQuery } from '@tanstack/react-query';
import { GroupedOption } from 'components/chakra/ChSelect';
import { zkbasClient } from 'config/zkbasClient';

/**
 * @name 'sher.legend'
 */
export const useFetchAccountByName = (name: string) => {
  return useQuery(
    ['getAccountByName', name],
    async () => {
      if (name === '') return;

      const accountInfo = await zkbasClient.getAccountByName(name);

      let assetList: GroupedOption[] = [];
      if (accountInfo && accountInfo.assets) {
        assetList = accountInfo.assets.map((asset) => {
          return {
            value: asset.id,
            label: asset.name,
          };
        });
      }

      return {
        assetList,
        meta: accountInfo,
      };
    },
    {
      cacheTime: 3000,
      staleTime: 6000,
    },
  );
};
