import { userState } from 'atom/userState';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { BNB } from 'common/constants';
import { useGetL2Balance } from './api/useGetL2Balance';

/**
 * amount(bnb) + gasFee(bnb) <= balance(bnb)
 */
const gasFeeIsBNBValid = (balance: string, gasFee: string, amount: string) => {
  const x = new BigNumber(balance);
  const y = new BigNumber(gasFee);
  const z = new BigNumber(amount);

  return x.minus(y).isGreaterThanOrEqualTo(z);
};

const gasFeeIsNotBNBvalid = (bnbBalance: string, gasFee: string) => {
  const x = new BigNumber(bnbBalance);
  const y = new BigNumber(gasFee);

  return x.isGreaterThanOrEqualTo(y);
};

export const useGasFeeValid = (symbol: string, balance: string, gasFee: string, amount: string) => {
  const login = useRecoilValue(userState);

  const { data: bnbBalance } = useGetL2Balance(login.l2.name, BNB);

  return useMemo(() => {
    if (symbol === BNB) {
      return gasFeeIsBNBValid(balance, gasFee, amount);
    }

    return gasFeeIsNotBNBvalid(bnbBalance.count, gasFee);
  }, [symbol, bnbBalance.count, gasFee, balance, amount]);
};
