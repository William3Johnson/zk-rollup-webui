import Nft from 'components/widthdraw/nft';
import { NextPage } from 'next';
import Head from 'next/head';

const Withdraw: NextPage = () => {
  return (
    <>
      <Head>
        <title>Withdraw NFT | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>

      <Nft />
    </>
  );
};

export default Withdraw;
