import { BNB, ZKBAS_CONTRACT_ADDRESS } from 'common/constants';
import { constants, ethers } from 'ethers';
import { useBEP20Contract } from 'hooks/contract/useBEP20Contract';
import { useEffect, useState } from 'react';
import { isZero } from 'utils/tools';
import { useAccount } from 'wagmi';

export const useBEP20Allowance = (symbol: string, tokenAddress: string) => {
  const { address } = useAccount();
  const [step, setStep] = useState<'idle' | 'start' | 'loading' | 'end'>('idle');
  const [allowance, setAllowance] = useState({
    amount: '',
    isZero: false,
    step,
    setStep,
  });
  const contract = useBEP20Contract(tokenAddress);

  useEffect(() => {
    if (!address || contract.address === constants.AddressZero || symbol === BNB) return;

    (async () => {
      const allowance = await contract.allowance(address, ZKBAS_CONTRACT_ADDRESS);

      const amount = ethers.utils.formatEther(allowance);

      setAllowance({
        amount,
        isZero: isZero(allowance),
        step,
        setStep,
      });
    })();
  }, [address, contract, symbol, setStep, step]);

  return allowance;
};
