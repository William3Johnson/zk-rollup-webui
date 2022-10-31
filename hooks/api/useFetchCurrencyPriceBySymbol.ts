import { useQuery } from '@tanstack/react-query';
import { zkbasClient } from 'config/zkbasClient';

export const useFetchCurrencyPriceBySymbol = (symbol: string) =>
  useQuery(
    ['getCurrencyPrice', symbol],
    async () => {
      if (!symbol) return;
      return await zkbasClient.getAssetBySymbol(symbol);
    },
    {
      cacheTime: 10000,
      staleTime: 50000,
    },
  );
