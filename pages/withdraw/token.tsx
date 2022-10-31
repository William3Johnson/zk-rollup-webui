import Token from 'components/widthdraw/token';
import { NextPage } from 'next';
import Head from 'next/head';

const Withdraw: NextPage = () => {
  return (
    <>
      <Head>
        <title>Withdraw Token | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>

      <Token />
    </>
  );
};

export default Withdraw;
