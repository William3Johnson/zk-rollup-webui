import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { METAMASK_LOGO } from 'common/resources';
import { metaMaskConnctor } from 'config/wagmiClient';
import { useConnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

export default NiceModal.create(() => {
  const modal = useModal();
  const { connect } = useConnect({
    onSuccess: () => {
      modal.hide();
    },
  });

  const metamask = new MetaMaskConnector();

  return (
    <Modal
      isCentered
      isOpen={modal.visible}
      onClose={() => {
        modal.hide();
      }}
    >
      <ModalOverlay bg='blackAlpha.300' />
      <ModalContent w='800px' padding='34px 70px'>
        <ModalHeader fontSize='20px' color='#1e2026' fontWeight={700} textAlign='center'>
          Choose L1 Wallet
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          lineHeight='24px'
          fontSize='12px'
          style={{ color: '#76808F', fontSize: '12px', marginTop: '20px' }}
          textAlign='center'
        >
          <Flex alignItems='center' justifyContent='center' marginTop='30px'>
            <picture>
              <source srcSet={METAMASK_LOGO} />
              <img width={80} src={METAMASK_LOGO} alt='' />
            </picture>
          </Flex>
          <p style={{ color: '#76808F', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
            MetaMask
          </p>

          {metamask.ready ? (
            <Box
              as='button'
              bg='#5445FF'
              color='#FFF'
              fontSize='14px'
              padding='5px'
              width='77px'
              border='none'
              borderRadius='4px'
              marginTop='10px'
              marginBottom='30px'
              _hover={{ cursor: 'pointer' }}
              onClick={() => {
                connect({
                  connector: metaMaskConnctor,
                });
              }}
            >
              Connect
            </Box>
          ) : (
            <Box
              as='a'
              display='inline-block'
              bg='#5445FF'
              color='#FFF'
              fontSize='14px'
              padding='5px'
              width='77px'
              border='none'
              borderRadius='4px'
              marginTop='10px'
              marginBottom='30px'
              href='https://metamask.io/'
              _hover={{ cursor: 'pointer' }}
            >
              install
            </Box>
          )}

          <p style={{ color: '#1E2026', fontSize: 12, textAlign: 'center' }}>
            If you don’t have a wallet yet, you can create one right now!
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
