import { constants } from 'ethers';
import { useContract, useSigner } from 'wagmi';

// https://eips.ethereum.org/EIPS/eip-721
const contractABI = [
  'function balanceOf(address _owner) external view returns (uint256)',
  'function getApproved(uint256 _tokenId) external view returns (address)',
  'function approve(address to, uint256 tokenId) external payable',
  'function setApprovalForAll(address operator, bool _approved) external',
  'function ownerOf(uint256 _tokenId) external view returns (address)',
];

export const useBEP721Contract = (address: string | undefined) => {
  const { data: signer } = useSigner();

  return useContract({
    addressOrName: address || constants.AddressZero,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });
};
