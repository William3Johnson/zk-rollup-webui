import Nft from 'components/deposit/nft';
import { NextPage } from 'next';
import Head from 'next/head';

const DepositNft: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deposit NFT | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>

      <Nft />
    </>
  );
};

export default DepositNft;
