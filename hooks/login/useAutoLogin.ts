import { createStandaloneToast } from '@chakra-ui/react';
import { userState } from 'atom/userState';
import { metaMaskConnctor } from 'config/wagmiClient';
import { useUpdateEffect } from 'react-use';
import { useRecoilValue } from 'recoil';
import { useConnect } from 'wagmi';

const { toast } = createStandaloneToast();
interface IParams {
  directConnect: string | string[] | undefined;
  accountName: string | string[] | undefined;
}

/**
 * directConnect=true auto login
 */
export const useAutoLogin = ({ directConnect, accountName }: IParams) => {
  const { connect } = useConnect();
  const userInfo = useRecoilValue(userState);

  useUpdateEffect(() => {
    if (!directConnect || !accountName) {
      return;
    }

    if (directConnect && userInfo.l2.name === '') {
      connect({
        connector: metaMaskConnctor,
      });

      return;
    }

    if (userInfo.l2.name !== accountName) {
      toast({
        title: 'accountname is different with NFT Market',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [directConnect, accountName, userInfo.l2.name]);
};
