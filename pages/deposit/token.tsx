import Token from 'components/deposit/token';
import { NextPage } from 'next';
import Head from 'next/head';

const DepositToken: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deposit Token | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>
      <Token />
    </>
  );
};

export default DepositToken;
