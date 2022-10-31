import { ethers } from 'ethers';
import { useMemo } from 'react';
import { format4, getPrice } from 'utils/tools';
import { useFetchAccountByName } from './api/useFetchAccountByName';
import { useFetchAssets } from './api/useFetchAssets';

export const useGetAccountTokenOptions = (accoutName: string) => {
  const { data: allAssetsInfo } = useFetchAssets();
  const { data: accountInfo } = useFetchAccountByName(accoutName);

  return useMemo(() => {
    return allAssetsInfo?.assets.map((asset) => {
      const x = accountInfo?.meta.assets.find((x) => x.name === asset.symbol);

      return {
        value: asset.id,
        label: asset.name,
        address: asset.address,
        price: asset.price,
        icon: asset.icon,
        balance: format4(ethers.BigNumber.from(x?.balance || '0')) ?? '0',
      };
    });
  }, [accountInfo?.meta.assets, allAssetsInfo?.assets]);
};

export const useGetAllTokenOptions = () => {
  const { data: allAssetsInfo } = useFetchAssets();

  return useMemo(() => {
    return allAssetsInfo?.assets.map((asset) => {
      return {
        value: asset.id,
        label: asset.name,
        address: asset.address,
        price: getPrice(asset.price),
        icon: asset.icon,
      };
    });
  }, [allAssetsInfo?.assets]);
};
