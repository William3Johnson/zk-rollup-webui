import { getNftByNftId } from 'config/marketplaceClient';
import { isArray, isUndefined } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { INft, IToken } from 'types/token';
import { getNftPrice } from 'utils/tools';
import { useFetchAssetById } from './api/useFetchAssetById';

export const useSelectTokenInfo = () => {
  const router = useRouter();
  const queryId = router.query.id;
  let id = undefined;
  if (!isArray(queryId) && !isUndefined(queryId)) {
    id = parseInt(queryId);
  }

  const [token, setToken] = useState<IToken>();

  const { data: asset } = useFetchAssetById(id);
  useEffect(() => {
    if (!asset) return;

    setToken({
      address: asset.address,
      label: asset.name,
      balance: '',
      price: asset.price,
      value: asset.id,
    });
  }, [asset]);

  return token;
};

export const useSelectNftInfo = () => {
  const router = useRouter();
  const queryId = router.query.id;
  const [nft, setNft] = useState<INft>();

  let id = -1;
  if (!isArray(queryId) && !isUndefined(queryId)) {
    id = parseInt(queryId);
  }

  useEffect(() => {
    if (id === -1) return;

    (async () => {
      const res = await getNftByNftId(id);

      if (!res) return;

      const asset = res.asset;

      setNft({
        id: asset.id,
        label: asset.name,
        value: asset.nftIndex,
        image: asset.imageThumb,
        price: getNftPrice(asset),
      });
    })();
  }, [id]);

  return nft;
};
