import { useQuery } from '@tanstack/react-query';
import { userState } from 'atom/userState';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { getL2UserInfo } from 'utils/crypto';
import { useAccount } from 'wagmi';

export const useLoginL2 = () => {
  const { address } = useAccount();
  const [user, setUser] = useRecoilState(userState);
  const resetUserInfo = useResetRecoilState(userState);

  return useQuery(
    ['loginL2', address],
    async () => {
      let userInfo = null;
      userInfo = await getL2UserInfo();

      if (userInfo) {
        setUser({
          l2: {
            name: userInfo.name,
            register: true,
            index: userInfo.index,
            pk: userInfo.pk,
          },
          l1: user.l1,
        });
      } else {
        resetUserInfo();
      }
      return userInfo;
    },
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: false,
      retry: true,
      refetchInterval: 5000,
    },
  );
};
