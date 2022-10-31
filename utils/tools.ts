import { Asset } from '@bnb-chain/zkbas-js-sdk/dist/web/zk';
import BigNumber from 'bignumber.js';
import { INftOfMarketPlace } from 'config/marketplaceClient';

import { ethers } from 'ethers';
import { IAccountNft } from 'hooks/zkbnb/useGetAccountNfts';

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const sliceAddress = (address: string | undefined) => {
  if (!address) return '';

  return address.slice(0, 10) + '...' + address.slice(-9);
};

export const getAssetById = (assets: Asset[], id: number) => {
  return assets.find((asset) => asset.id === id);
};

/**
 * amount: "100000000000000000"
 * decimals: 18
 *
 * @return 0.1
 */
export const getAmount = (amount: string, decimals = 18) => {
  return ethers.utils.formatUnits(amount, decimals);
};

// "2.806415582770153E+02" => 280.6415582770153
export const getPrice = (price: string | undefined) => {
  if (!price) return '';
  return numberFormat(BigNumber(price));
};

/**
 * value = price * amount
 */
export const getValue = (price: string, amount: string) => {
  return numberFormat(BigNumber(price).times(amount));
};

export const getTotalAmount = (amount: string, gasFeeAmount: string) => {
  return BigNumber(amount).plus(gasFeeAmount).dp(8).toString();
};

/**
 * rate = x / y
 */
export const getRate = (x: string, y: string) => {
  return numberFormat(BigNumber(x).div(y));
};

/**
 * @slip 0 - 100
 */
export const getMinReceiveAmout = (amount: string, slip: string) => {
  const x = (100 - parseInt(slip)) / 100;
  // console.log(x);
  // console.log(BigNumber(amount).times(x));
  return numberFormat(BigNumber(amount).times(x));
};

/**
 * @decimal =3: 2852.01552554962092889699392 -> "2,852.016"
 */
export const numberFormat = (x: BigNumber, decimal = 3): string => {
  return x.isNaN() ? '0' : x.toFormat(decimal);
};

/**
 * x: BigNumber {_hex: '0x04df41f3666b502bf1', _isBigNumber: true} returns false
 * x: BigNumber {_hex: '0x00', _isBigNumber: true} returns true
 */
export const isZero = (x: string): boolean => {
  return ethers.BigNumber.from(x).isZero();
};

/**
 *  @res 60.888601549994958833
 *  @return 60.8886
 */
export const format4 = (res: ethers.BigNumber) => {
  if (!res) return;
  const remainder = res.mod(1e14);
  const tmp = ethers.utils.formatEther(res.sub(remainder));

  const x = new BigNumber(tmp);
  return x.toString();
};

/**
 *  @res 60.888601549994958833
 *  @return 60.88860154
 */
export const format8 = (res: ethers.BigNumber) => {
  const remainder = res.mod(1e10);
  const tmp = ethers.utils.formatEther(res.sub(remainder));

  const x = new BigNumber(tmp);
  return x.toString();
};

export const getNftPrice = (nft: INftOfMarketPlace) => {
  if (nft.currentListPrice > 0) {
    const t = ethers.BigNumber.from(nft.currentListPrice.toString());
    return ethers.utils.formatEther(t);
  }

  if (nft.latestDealPrice > 0) {
    const t = ethers.BigNumber.from(nft.latestDealPrice.toString());
    return ethers.utils.formatEther(t);
  }

  return '';
};

export const getNftAddress = (accountNftList: IAccountNft[], nftIndex: string) => {
  return accountNftList.find((accountNft) => accountNft.nftIndex === nftIndex)?.nftAddress;
};
