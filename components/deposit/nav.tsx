import { DEPOSIT_NFT_URL, DEPOSIT_TOKEN_URL } from 'common/constants';
import { TabButtonNavContainer } from 'components/TabButton';
import { useRouter } from 'next/router';
import React from 'react';

export const DepositNav: React.FC = () => {
  const router = useRouter();

  return (
    <TabButtonNavContainer
      navs={[
        { title: 'Tokens', url: DEPOSIT_TOKEN_URL },
        { title: 'NFTs', url: DEPOSIT_NFT_URL },
      ]}
      onClick={(url) => {
        router.push({
          pathname: url,
        });
      }}
    />
  );
};
