import { BigNumber } from 'ethers';
import { useZkBNBContract } from 'hooks/contract/useZkBNBContract';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export interface IAccountNft {
  nftAddress: string;
  nftIndex: string;
}

interface IResNft {
  nftAddress: string;
  nftIndex: BigNumber;
}

/**
 * get account own nft list
 */
export const useGetAccountNfts = () => {
  const { address } = useAccount();
  const [addressList, setAddressList] = useState<IAccountNft[]>([]);
  const zkContract = useZkBNBContract();

  useEffect(() => {
    (async () => {
      let addressList: IAccountNft[] = [];
      try {
        const res: IResNft[] = await zkContract.getAccountNfts(address);

        addressList = res.map((nft) => {
          return {
            nftAddress: nft.nftAddress,
            nftIndex: nft.nftIndex.toString(),
          };
        });
      } catch (err) {
        // console.log(err);
      }
      setAddressList(addressList);
    })();
  }, [address, zkContract]);

  return addressList;
};
