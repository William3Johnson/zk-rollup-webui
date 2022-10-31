import { useContract, useSigner } from 'wagmi';

/**
 * @address contract address
 */

// github.com/bnb-chain/BEPs/blob/master/BEP20.md
const contractABI = [
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address _owner) public view returns (uint256 balance)',
  'function approve(address _spender, uint256 _value) public returns (bool success)',
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
];

export const useBEP20Contract = (address: string) => {
  const { data: signer } = useSigner();

  return useContract({
    addressOrName: address,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });
};
