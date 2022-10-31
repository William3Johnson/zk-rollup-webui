import { ethers } from 'ethers';
import React, { useState } from 'react';
import { getPrice, getValue } from 'utils/tools';
import { useAccount, useProvider } from 'wagmi';
import { useFetchCurrencyPriceBySymbol } from './api/useFetchCurrencyPriceBySymbol';

export const useGetBanlance = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const [amount, setAmount] = useState<string>('');

  React.useEffect(() => {
    if (!address) return;

    (async () => {
      const res = await provider.getBalance(address);
      setAmount(ethers.utils.formatEther(res));
    })();
  }, [provider, address]);

  const priceRes = useFetchCurrencyPriceBySymbol('BNB');
  const price = getPrice(priceRes.data?.price);
  const value = getValue(price, amount);

  return { amount, price, value };
};
