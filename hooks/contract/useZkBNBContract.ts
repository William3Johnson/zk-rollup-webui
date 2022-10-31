import { contractABI, ZKBAS_CONTRACT_ADDRESS } from 'common/constants';
import { useContract, useSigner } from 'wagmi';

export const useZkBNBContract = () => {
  const { data: signer } = useSigner();

  return useContract({
    addressOrName: ZKBAS_CONTRACT_ADDRESS,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });
};
