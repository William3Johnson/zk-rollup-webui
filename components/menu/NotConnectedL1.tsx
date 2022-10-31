import { Flex, Stack } from '@chakra-ui/react';
import { ConnectWalletButton } from 'components/ConnectWalletButton';
import ConnectL1Modal from 'components/modal/ConnectL1Modal';
import NiceModal from '@ebay/nice-modal-react';

export const NotConnectedL1: React.FC = () => {
  return (
    <Stack padding='12px 16px' bg='#FFF' borderRadius='8px' minHeight='156px'>
      <>
        <h3 style={{ color: '#76808F', fontSize: 16 }}>L1 account</h3>
        <Flex justifyContent='center' alignItems='center' flex={1} marginTop='-20px'>
          <ConnectWalletButton
            onClick={() => {
              NiceModal.show(ConnectL1Modal);
            }}
          />
        </Flex>
      </>
    </Stack>
  );
};
