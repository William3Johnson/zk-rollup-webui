import { useQuery } from '@tanstack/react-query';
import { usePrevious } from 'react-use';
import { zkbasClient } from 'config/zkbasClient';

export const useFetchSwapAmount = (
  pairIndex: number,
  token: { address: string; label: string; value: number; amount: string },
) => {
  const previousTokenAmount = usePrevious(token.amount);

  return useQuery(
    ['getSwapAmount', pairIndex, token.value, token.amount],
    async () => {
      // haven't select token or receiveToken
      if (typeof pairIndex === 'undefined') return;

      // haven't fill token's amount and receiveToken's amount
      if (!token.amount) return;

      let isFrom = true;

      if (previousTokenAmount !== token.amount) {
        // change token
        isFrom = true;
      } else {
        // change receiveToken
        isFrom = false;
      }

      // if (previousReceiveTokenAmount !== receiveToken.amount) {
      //   isFrom = false;
      // }
      return await zkbasClient.getSwapAmount({
        pairIndex,
        assetId: token.value,
        assetAmount: token.amount,
        isFrom,
      });
    },
    {
      cacheTime: 1000,
      staleTime: 6000,
    },
  );
};
