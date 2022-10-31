import { INVALID_VALUE } from 'common/constants';
import { constants } from 'ethers';

export interface IToken {
  label: string;
  value: number;
  address: string;
  price: string;
  balance: string;
}

export const defaultTokenValue: IToken = {
  value: INVALID_VALUE,
  label: '',
  address: constants.AddressZero,
  balance: '',
  price: '',
};

export interface INft {
  id: number;
  label: string;
  value: number;
  image: string;
  price: string;
}

export const defaultNftValue: INft = {
  id: -1,
  value: INVALID_VALUE,
  label: '',
  image: '',
  price: '0',
};

export interface IGasFee {
  label: string;
  value: string;
}

export const defaultGasFee: IGasFee = {
  label: '',
  value: INVALID_VALUE.toString(),
};
