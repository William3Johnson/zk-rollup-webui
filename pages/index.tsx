import { Box, Button, Flex, HStack, Stack } from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { userState } from 'atom/userState';
import { DEPOSIT_TOKEN_URL, WITHDRAW_TOKEN_URL } from 'common/constants';
import { DASHBOARD_ICON } from 'common/resources';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import WalletIcon from 'components/icons/WalletIcon';
import ConnectL1Modal from 'components/modal/ConnectL1Modal';
import ConnectL2Modal from 'components/modal/ConnectL2Modal';
import Info from 'components/modal/Info';
import TxFeedback from 'components/modal/TxFeedback';
import { TabButtonContainer } from 'components/TabButton';
import { L1NftTable } from 'components/table/L1NftTable';
import { L1TokenTable } from 'components/table/L1TokenTable';
import { ZkNftTable } from 'components/table/ZkNftTable';
import { ZkTokenTable } from 'components/table/ZkTokenTable';
import { ethers } from 'ethers';
import { useFetchAccountByName } from 'hooks/api/useFetchAccountByName';
import { useGetBanlance } from 'hooks/useGetBanlance';
import { useValidNetwork } from 'hooks/useValidNetwork';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import styles from 'styles/Index.module.css';
import { format4 } from 'utils/tools';
import { useAccount } from 'wagmi';
import { useIsMounted } from '../hooks/useIsMounted';

const Index: NextPage = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();
  const banlance = useGetBanlance();
  const isValidNetwork = useValidNetwork();
  const { data: accountInfo } = useFetchAccountByName(user.l2.name);
  const [l1TabIndex, setl1TabIndex] = React.useState<number>(0);
  const [l2TabIndex, setl2TabIndex] = React.useState<number>(0);

  return (
    <Box margin='32px'>
      <Head>
        <title>ZKWallet</title>
        <meta name='description' content='ZK Wallet' />
      </Head>
      <Stack bgColor='#FFF' borderRadius='16px' padding='24px' minHeight='300px'>
        <HStack className={styles.h1}>
          <h1>L1 account</h1>
        </HStack>

        {isMounted && !isConnected && (
          <Stack alignItems='center' flex={1}>
            <picture>
              <source srcSet={DASHBOARD_ICON} />
              <img width={40} src={DASHBOARD_ICON} alt='' />
            </picture>

            <p style={{ color: '#76808F', fontSize: 14, marginTop: 14 }}>
              Please connect your wallet first
            </p>

            <Box style={{ marginTop: 14 }}>
              <ConnectWalletButton
                onClick={() => {
                  NiceModal.show(ConnectL1Modal);
                }}
              />
            </Box>
          </Stack>
        )}

        {isMounted && isConnected && (
          <Flex>
            <Box w='200px'>
              <HStack alignItems='center'>
                <Box>
                  <h2 className={styles.h2}>Total Assets</h2>
                </Box>
                <Box
                  as='button'
                  w={18}
                  h={12}
                  bg='transparent'
                  color='#AEB4BC'
                  onClick={() => {
                    NiceModal.show(Info, {
                      title: 'What’s My L1 assets?',
                      content: (
                        <>
                          <Box as='p'>
                            Please notice that only part of your L1 asset will show in BNB zkRollup
                            web wallet. Currently BNB zkRollup web wallet only support serveral
                            kinds of tokens.
                          </Box>
                          <Box as='p' mt='10px'>
                            For tokens thas are not supported by BNB zkRollup web wallet, they won’t
                            show here, you can view them on your L1 wallet.
                          </Box>
                          <Box as='p' mt='10px'>
                            Currently we support BNB, BUSD, ETH. and NFT created at zkBNB
                          </Box>
                        </>
                      ),
                    });
                  }}
                >
                  <FaInfoCircle />
                </Box>
              </HStack>

              <h3 className={styles.h3}>${banlance.value}</h3>

              <BigButton
                title='Deposit'
                disabled={!user.l2.register}
                onClick={() => {
                  router.push(DEPOSIT_TOKEN_URL);
                }}
              />
            </Box>
            <Box flex={1}>
              <TabButtonContainer
                navs={[{ title: 'Tokens' }, { title: 'NFTs' }]}
                tabIndex={l1TabIndex}
                onChange={setl1TabIndex}
                containerProps={{
                  w: '180px',
                }}
              />

              {l1TabIndex === 0 && <L1TokenTable />}
              {l1TabIndex === 1 && <L1NftTable />}
            </Box>
          </Flex>
        )}
      </Stack>

      <Box marginTop='32px' bgColor='#FFF' borderRadius='16px' padding='24px' minHeight='400px'>
        <HStack className={styles.h1}>
          <h1>ZkWallet</h1>
          <Box
            as='button'
            w={18}
            h={12}
            bg='transparent'
            color='#AEB4BC'
            onClick={() => {
              NiceModal.show(Info, {
                title: 'What’s ZKwallet?',
                content: (
                  <>
                    <p>
                      BNB zkRollup Chain solves BNB Chain scalability with zero security
                      compromises, powered by NodeReal.
                    </p>
                    <p style={{ marginTop: 10 }}>
                      Your assets in BNB zkRollup web wallet live in a separate space called
                      Layer-2(L2 for short).
                    </p>
                    <p style={{ marginTop: 10 }}>
                      You won’t see them on bscscan.com or bsctrace.com, only in BNB zkRollup web
                      wallet and ZKTrace.com.
                    </p>
                  </>
                ),
              });
            }}
          >
            <FaInfoCircle />
          </Box>
        </HStack>

        {isMounted && !isConnected && (
          <Stack alignItems='center' justifyContent='space-around' p='40px'>
            <picture>
              <source srcSet={DASHBOARD_ICON} />
              <img width={40} src={DASHBOARD_ICON} alt='' />
            </picture>
            <p style={{ color: ' #76808F', fontSize: 14, margin: '16px auto' }}>
              Please connect your L1 wallet first
            </p>
          </Stack>
        )}

        {isMounted && isConnected && user.l2.register && (
          <Flex>
            <Box w='200px'>
              <Box>
                <h2 className={styles.h2}>Total Assets</h2>
              </Box>
              <Box mt='20px'>
                <h3 className={styles.h3}>
                  ${format4(ethers.utils.parseEther(accountInfo?.meta.total_asset_value || '0'))}
                </h3>
              </Box>

              <BigButton
                title='Withdraw'
                onClick={() => {
                  router.push(WITHDRAW_TOKEN_URL);
                }}
              />
            </Box>
            <Box flex={1}>
              <TabButtonContainer
                navs={[{ title: 'Tokens' }, { title: 'NFTs' }]}
                tabIndex={l2TabIndex}
                onChange={setl2TabIndex}
                containerProps={{
                  w: '180px',
                }}
              />

              {l2TabIndex === 0 && <ZkTokenTable />}
              {l2TabIndex === 1 && <ZkNftTable />}
            </Box>
          </Flex>
        )}

        {isMounted && isConnected && !user.l2.register && (
          <Stack alignItems='center' justifyContent='space-around' p='40px'>
            <WalletIcon boxSize={38} color='#AEB4BC' />
            <p style={{ color: ' #76808F', fontSize: 14, margin: '16px auto' }}>
              Before we start,you need take a few seconds to register ZKwallet account.
            </p>
            <BigButton
              title='Register'
              onClick={() => {
                if (!isValidNetwork) {
                  NiceModal.show(TxFeedback, {
                    status: 'failure',
                    title: 'Network error',
                    content: (
                      <span>
                        you haven&apos;t connect your Metamask wallet to BSC testnet yet, please
                        &nbsp;
                        <a
                          style={{ textDecoration: 'underline' }}
                          href='https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain'
                          target='_blank'
                          rel='noreferrer'
                        >
                          add BSC testnet to your metamask wallet
                        </a>
                        &nbsp; first
                      </span>
                    ),
                  });
                } else {
                  NiceModal.show(ConnectL2Modal);
                }
              }}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

const BigButton: React.FC<{ title: string; disabled?: boolean; onClick(): void }> = ({
  title,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      marginTop='40px'
      variant='fota'
      borderRadius='8px'
      width='160px'
      height='40px'
      fontSize='16px'
      fontWeight='600'
      disabled={disabled}
      _disabled={{ background: 'gray.300', cursor: 'not-allowed' }}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default Index;
