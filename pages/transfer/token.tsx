import Token from 'components/transfer/token';
import { NextPage } from 'next';
import Head from 'next/head';

const TransferToken: NextPage = () => {
  return (
    <>
      <Head>
        <title>Transfer Token | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>

      <Token />
    </>
  );
};

export default TransferToken;
