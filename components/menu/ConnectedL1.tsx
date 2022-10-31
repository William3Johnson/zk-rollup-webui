import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Divider, Flex, Stack, useClipboard } from '@chakra-ui/react';
import { ACTIVITIES_URL, BSCSCAN_ACCOUNT_ADDRESS } from 'common/constants';
import { CLOSE_L1_ICON, METAMASK_LOGO } from 'common/resources';
import ActivitiesIcon from 'components/icons/ActivitiesIcon';
import { sliceAddress } from 'utils/tools';
import { useAccount, useDisconnect } from 'wagmi';

export const ConnectedL1: React.FC = () => {
  const { address } = useAccount();

  const { disconnect } = useDisconnect({
    onSuccess: () => {
      window.location.href = '/';
    },
  });
  const { hasCopied, onCopy } = useClipboard(address || '');

  const handleSwitchAccount = () => {
    disconnect();
  };

  return (
    <Stack padding='12px 16px' bg='#FFF' borderRadius='8px' minHeight='156px'>
      <Flex align='center' justifyContent='space-between'>
        <h3 style={{ color: '#76808F', fontSize: 16 }}>L1 account</h3>
        <Box onClick={handleSwitchAccount} as='button'>
          <picture>
            <source srcSet={CLOSE_L1_ICON} />
            <img width={24} src={CLOSE_L1_ICON} alt='' />
          </picture>
        </Box>
      </Flex>

      <Flex justifyContent='flex-start' alignItems='center'>
        <Flex
          width='40px'
          height='40px'
          borderRadius='40px'
          bg='rgba(114, 102, 255, 0.1)'
          alignItems='center'
          justifyContent='center'
          marginRight='7px'
        >
          <picture>
            <source srcSet={METAMASK_LOGO} />
            <img width='30' src={METAMASK_LOGO} alt='' />
          </picture>
        </Flex>
        <Stack justifyContent='space-between' paddingBottom='16px' paddingTop='16px'>
          <Flex alignItems='center'>
            <h4 style={{ color: '#1E2026', fontSize: 14, fontWeight: 500 }}>
              {sliceAddress(address)}
            </h4>
            <Box as='button' onClick={onCopy} marginLeft='3px'>
              <CopyIcon w='13px' />
              <span style={{ marginLeft: 3, fontSize: 12, color: '#ccc' }}>
                {hasCopied ? 'Copied' : ''}
              </span>
            </Box>
          </Flex>
          <p style={{ marginTop: 0, color: '#AEB4BC', fontSize: 12 }}>Metamask</p>
        </Stack>
      </Flex>

      <Divider sx={{ marginTop: '0 !important' }} />

      <Flex justifyContent='space-between' alignItems='center' marginTop='12px'>
        <Flex
          as='a'
          border='none'
          color='#1E2026'
          borderRadius='4px'
          bg='#f5f5f5'
          padding='4px'
          fontSize='12px'
          target='_blank'
          flex={1}
          justifyContent='center'
          alignItems='center'
          marginRight='8px'
          href={`${BSCSCAN_ACCOUNT_ADDRESS}${address}`}
        >
          <ExternalLinkIcon marginRight='5px' />
          View in BscScan
        </Flex>

        <Flex
          as='a'
          border='none'
          color='#1E2026'
          borderRadius='4px'
          bg='#f5f5f5'
          padding='4px'
          fontSize='12px'
          alignItems='center'
          cursor='pointer'
          flex={1}
          justifyContent='center'
          href={`${ACTIVITIES_URL}`}
        >
          <ActivitiesIcon boxSize={4} />
          View in Activities
        </Flex>
      </Flex>
    </Stack>
  );
};
