import { WITHDRAW_NFT_URL, WITHDRAW_TOKEN_URL } from 'common/constants';
import { TabButtonNavContainer } from 'components/TabButton';
import { useRouter } from 'next/router';
import React from 'react';

export const WithdrawNav: React.FC = () => {
  const router = useRouter();

  return (
    <TabButtonNavContainer
      navs={[
        { title: 'Tokens', url: WITHDRAW_TOKEN_URL },
        { title: 'NFTs', url: WITHDRAW_NFT_URL },
      ]}
      onClick={(url) => {
        router.push({
          pathname: url,
        });
      }}
    />
  );
};
