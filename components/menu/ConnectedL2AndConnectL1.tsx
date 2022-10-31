import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Avatar, Box, Divider, Flex, Stack, useClipboard } from '@chakra-ui/react';
import { userState } from 'atom/userState';
import { useRecoilValue } from 'recoil';
import { ZK_TRACE_ACCOUNT_ADDRESS } from 'common/constants';
import { sliceAddress } from 'utils/tools';
import { useAccount } from 'wagmi';

export const ConnectedL2AndConnectL1: React.FC = () => {
  const login = useRecoilValue(userState);
  const { address } = useAccount();
  const username = login.l2.name;

  const { hasCopied, onCopy } = useClipboard(address || '');

  return (
    <Stack marginTop='16px' padding='12px 16px' minHeight='156px' bg='#FFF' borderRadius='8px'>
      <h3 style={{ color: '#76808F', fontSize: 16 }}>ZKwallet account</h3>

      <Flex padding='16px 0' borderRadius='8px'>
        <Box marginRight='10px'>
          <Avatar name={username} width='40px' height='40px' />
        </Box>
        <Box>
          <h3 style={{ color: '#1E2026', fontSize: 14 }}>{username}</h3>
          <h4 style={{ color: '#76808F', fontSize: 11 }}>
            <span>{sliceAddress(address)}</span>
            <Box as='button' onClick={onCopy} marginLeft='3px'>
              <CopyIcon w='13px' />
              <span style={{ marginLeft: 3, fontSize: 12 }}>{hasCopied ? 'Copied' : ''}</span>
            </Box>
          </h4>
        </Box>
      </Flex>

      <Divider sx={{ marginTop: '0 !important' }} />

      <Flex alignItems='center' marginTop='12px'>
        <Box
          as='a'
          border='none'
          color='#1E2026'
          borderRadius='4px'
          bg='#f5f5f5'
          padding='4px 8px'
          fontSize='12px'
          target='_blank'
          href={`${ZK_TRACE_ACCOUNT_ADDRESS}${username}`}
        >
          <ExternalLinkIcon marginRight='5px' />
          View in ZKTrace
        </Box>
      </Flex>
    </Stack>
  );
};
