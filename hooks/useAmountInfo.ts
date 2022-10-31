import { useMemo } from 'react';
import { getValue } from 'utils/tools';
import { useFetchCurrencyPriceBySymbol } from './api/useFetchCurrencyPriceBySymbol';

export const useAmountInfo = (symbol: string, amount: string) => {
  const { data: asset } = useFetchCurrencyPriceBySymbol(symbol);

  return useMemo(() => {
    if (!asset || !amount) return '0';

    return getValue(asset.price, amount);
  }, [amount, asset]);
};
