import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { format8, getValue } from 'utils/tools';
import { useFetchAssetById } from './api/useFetchAssetById';
import { useFetchGasFee } from './api/useFetchGasFee';

/**
 * calculate gasFeeInfo
 */
export const useGasFeeInfo = (gasFeeId: string, txType: number) => {
  const { data: gasAsset } = useFetchAssetById(parseInt(gasFeeId));
  const { data: gasFeeInfo } = useFetchGasFee(parseInt(gasFeeId), txType);

  return useMemo(() => {
    if (!gasAsset || !gasFeeInfo) return;
    const amount = format8(ethers.BigNumber.from(gasFeeInfo.gas_fee)) || '0';
    const format8Amount = new BigNumber(amount).dp(8).toString();

    return {
      amount: format8Amount,
      value: getValue(gasAsset.price, amount),
    };
  }, [gasAsset, gasFeeInfo]);
};
