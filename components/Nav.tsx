import { Box, Flex, Link as ChLink } from '@chakra-ui/react';
import { userState } from 'atom/userState';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { ACTIVITIES_URL, TRANSFTER_TOKEN_URL } from 'common/constants';
import styles from '../styles/Nav.module.css';
import ActivitiesIcon from './icons/ActivitiesIcon';
import HomepageIcon from './icons/HomepageIcon';
import TransferIcon from './icons/TransferIcon';

const navs: { title: string; link: string; icon: React.ElementType }[] = [
  {
    title: 'Home',
    link: '/',
    icon: (props) => <HomepageIcon {...props} />,
  },
  {
    title: 'Transfer',
    link: TRANSFTER_TOKEN_URL,
    icon: (props) => <TransferIcon {...props} />,
  },
  {
    title: 'Activities',
    link: ACTIVITIES_URL,
    icon: (props) => <ActivitiesIcon {...props} />,
  },
];

const activeColor = '#5445FF';
const registerColor = '#1E2026';
const notRegisterColor = '#AEB4BC';

const Nav = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const notActive = user.l2.register ? registerColor : notRegisterColor;

  return (
    <Box padding='16px'>
      <Box marginBottom='25px'>
        <ChLink href='/'>
          <Image priority src='/logo.png' alt='' width='134px' height='32px' />
        </ChLink>
      </Box>
      <Flex direction='column'>
        {navs.map((nav) => {
          const className =
            router.pathname === nav.link ? `${styles.link} ${styles.active}` : `${styles.link}`;

          const linkStyle = user.l2.register ? {} : { cursor: 'not-allowed' };
          const color = router.pathname === nav.link ? activeColor : notActive;
          const NavIcon = nav.icon;

          return (
            <Link href={nav.link} key={nav.link} passHref>
              <ChLink
                className={className}
                sx={linkStyle}
                onClick={(e) => {
                  if (!user.l2.register) e.preventDefault();
                }}
              >
                <Flex alignItems='center'>
                  <NavIcon color={color} boxSize={19} />
                  <span style={{ marginLeft: 10, color: color }}>{nav.title}</span>
                </Flex>
              </ChLink>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
};

export default Nav;
