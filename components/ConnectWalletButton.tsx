import { Box, BoxProps, forwardRef } from '@chakra-ui/react';
import { userState } from 'atom/userState';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { CONNECT_L1_ICON, CONNECT_L2_ICON, WALLET_ICON } from 'common/resources';
import { useAccount } from 'wagmi';

interface IConnectWalletProps extends BoxProps {
  onClick(): void;
}

export const ConnectWalletButton = forwardRef<IConnectWalletProps, 'div'>((props, ref) => {
  const { isConnected } = useAccount();

  const login = useRecoilValue(userState);

  return (
    <Box
      ref={ref}
      onClick={() => {
        props.onClick();
      }}
    >
      {!isConnected && <NotConnectWallet />}
      {isConnected && !login.l2.register && <ConnectedWallet kind='L1' />}
      {isConnected && login.l2.register && <ConnectedWallet kind='L2' />}
    </Box>
  );
});

const NotConnectWallet: React.FC = () => {
  return (
    <Box
      display='inline-flex'
      alignItems='center'
      justifyContent='space-evenly'
      as='button'
      width='161px'
      height='40px'
      lineHeight='40px'
      borderRadius='8px'
      fontSize='14px'
      fontWeight='500'
      bg='#5445FF'
      border='none'
      color='#FFF'
      _hover={{ cursor: 'pointer' }}
    >
      <picture>
        <source srcSet={WALLET_ICON} />
        <img width={25} src={WALLET_ICON} alt='' />
      </picture>
      Connect Wallet
    </Box>
  );
};

const ConnectedWallet: React.FC<{ kind: 'L1' | 'L2' }> = (props) => {
  return (
    <Box
      display='inline-flex'
      alignItems='center'
      justifyContent='space-evenly'
      as='button'
      width='161px'
      height='40px'
      lineHeight='40px'
      borderRadius='8px'
      fontSize='14px'
      fontWeight='500'
      bg='#FFF'
      border='1px solid #E6E8EA'
      color='#1E2026'
      _hover={{ cursor: 'pointer' }}
    >
      {props.kind === 'L1' && (
        <picture>
          <source srcSet={CONNECT_L1_ICON} />
          <img width={25} src={CONNECT_L1_ICON} alt='' />
        </picture>
      )}
      {props.kind === 'L2' && (
        <picture>
          <source srcSet={CONNECT_L2_ICON} />
          <img width={25} src={CONNECT_L2_ICON} alt='' />
        </picture>
      )}
      my account
    </Box>
  );
};
