import { ethers } from 'ethers';
import { useMemo } from 'react';
import { getAmount, getTotalAmount, getValue } from 'utils/tools';
import { useFetchAssetById } from './api/useFetchAssetById';
import { useFetchGasFee } from './api/useFetchGasFee';

export const useTotalAmountInfo = (
  symbol: string,
  gasFeeId: string,
  amount: string,
  txType: number,
) => {
  const { data: gasAsset } = useFetchAssetById(parseInt(gasFeeId));
  const { data: gasFeeInfo } = useFetchGasFee(parseInt(gasFeeId), txType);

  return useMemo(() => {
    if (!gasAsset || !gasFeeInfo || !amount) return;

    const parseAmount = ethers.utils.parseEther(amount.toString());
    let totalAmount = getAmount(gasFeeInfo.gas_fee);

    if (symbol === gasAsset.symbol) {
      totalAmount = getTotalAmount(
        getAmount(parseAmount.toString()),
        getAmount(gasFeeInfo.gas_fee),
      );
    }

    return {
      amount: totalAmount,
      gasSymbol: gasAsset.symbol,
      value: getValue(gasAsset.price, totalAmount),
    };
  }, [amount, gasAsset, gasFeeInfo, symbol]);
};
