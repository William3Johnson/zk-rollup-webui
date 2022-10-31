import Nft from 'components/transfer/nft';
import { NextPage } from 'next';
import Head from 'next/head';

const TransferNft: NextPage = () => {
  return (
    <>
      <Head>
        <title>Transfer NFT | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>

      <Nft />
    </>
  );
};

export default TransferNft;
