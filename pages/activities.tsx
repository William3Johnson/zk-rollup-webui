import { Box } from '@chakra-ui/react';
import { ActivitiesTable } from 'components/table/ActivitiesTable';
import { NextPage } from 'next';
import Head from 'next/head';

const Activities: NextPage = () => {
  return (
    <Box margin='32px' borderRadius='16px' bg='#FFF' padding='24px'>
      <Head>
        <title>Activities | ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>

      <h1
        style={{
          height: 24,
          lineHeight: '24px',
          fontSize: 16,
          color: '#1E2026',
          fontWeight: 500,
          textIndent: 16,
        }}
      >
        Activities
      </h1>

      <Box mt='35px'>
        <ActivitiesTable />
      </Box>
    </Box>
  );
};

export default Activities;
