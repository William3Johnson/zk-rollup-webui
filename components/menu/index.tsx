import { Box, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { menuState } from 'atom/menuState';
import { userState } from 'atom/userState';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import { useAutoLogin } from 'hooks/login/useAutoLogin';
import { useLoginL2 } from 'hooks/login/useLoginL2';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAccount } from 'wagmi';
import { ConnectedL1 } from './ConnectedL1';
import { ConnectedL2AndConnectL1 } from './ConnectedL2AndConnectL1';
import { NotConnectedL1 } from './NotConnectedL1';
import { NotConnectedL2 } from './NotConnectedL2';
import { NotConnectedL2ButConnectL1 } from './NotConnectedL2ButConnectL1';

export const Menu: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [openMenu, setOpenMenu] = useRecoilState(menuState);
  const user = useRecoilValue(userState);
  const router = useRouter();
  const { directConnect, accountName } = router.query;

  const handleClickMenuButton = () => {
    setOpenMenu(!openMenu);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  useAutoLogin({ directConnect, accountName });

  const { refetch: toLogin } = useLoginL2();

  useEffect(() => {
    (async () => {
      if (!isConnected || !address) return;
      await toLogin();
    })();
  }, [isConnected, address, toLogin]);

  return (
    <Popover isOpen={openMenu} placement='top-start' onClose={handleCloseMenu}>
      <PopoverTrigger>
        <ConnectWalletButton onClick={handleClickMenuButton} />
      </PopoverTrigger>
      <PopoverContent
        width='360px'
        overflow='hidden'
        borderRadius='18px'
        boxShadow='10px 16px 24px rgba(0, 0, 0, 0.06)'
      >
        <Box bg='#F5F5F5' padding='16px'>
          {/* Don't connect wallet */}
          {!isConnected && (
            <>
              <NotConnectedL1 />
              <NotConnectedL2 />
            </>
          )}

          {/* connect L1 wallet */}
          {isConnected && (
            <>
              <ConnectedL1 />
              {!user.l2.register && <NotConnectedL2ButConnectL1 />}
              {user.l2.register && <ConnectedL2AndConnectL1 />}
            </>
          )}
        </Box>
      </PopoverContent>
    </Popover>
  );
};
