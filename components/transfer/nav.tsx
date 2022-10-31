import { TRANSFTER_NFT_URL, TRANSFTER_TOKEN_URL } from 'common/constants';
import { TabButtonNavContainer } from 'components/TabButton';
import { useRouter } from 'next/router';
import React from 'react';

export const TransferNav: React.FC = () => {
  const router = useRouter();

  return (
    <TabButtonNavContainer
      navs={[
        { title: 'Tokens', url: TRANSFTER_TOKEN_URL },
        { title: 'NFTs', url: TRANSFTER_NFT_URL },
      ]}
      onClick={(url) => {
        router.push({
          pathname: url,
        });
      }}
    />
  );
};
