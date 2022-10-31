import axios from 'axios';

const nftClient = axios.create({
  baseURL: 'https://qa-marketplace.bnbchain.world',
});

export interface INftOfMarketPlace {
  id: number;
  name: string;
  accountName: string;
  collectionId: number;
  collectionName: string;
  contentHash: string;
  image: string;
  imageThumb: string;
  nftIndex: number;
  status: string;
  currentListPrice: number;
  latestDealPrice: number;
}

export const getNftsList = async (
  accountName: string,
  page: number,
  pageSize: number,
): Promise<{ total: number; assets: INftOfMarketPlace[] }> => {
  let res = { total: 0, assets: [] };
  if (!accountName) return res;

  try {
    const apiResponse = await nftClient.post('/v1/asset/search', {
      filter: { accountNames: [accountName] },
      sort: 'CREATION_DESC',
      offset: page * pageSize,
      limit: pageSize,
    });

    res = apiResponse.data.data;
  } catch (err) {
    // ...
  }

  return res;
};

export const getNftByNftId = async (id: number): Promise<{ asset: INftOfMarketPlace }> => {
  let res = null;

  try {
    const apiRes = await nftClient.get(`/v1/asset`, {
      params: {
        nftIndex: id,
      },
    });

    res = apiRes.data.data;
  } catch (err) {}

  return res;
};
