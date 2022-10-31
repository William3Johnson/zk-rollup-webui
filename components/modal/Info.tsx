import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import React from 'react';

interface IInfo {
  title: string;
  content: React.ReactNode;
}

export default NiceModal.create<IInfo>(({ title, content }) => {
  const modal = useModal();

  return (
    <Modal isCentered size='2xl' isOpen={modal.visible} onClose={modal.hide}>
      <ModalOverlay bg='blackAlpha.300' />
      <ModalContent w='800px' padding='34px 70px'>
        <ModalHeader fontSize='20px' color='#434344' fontWeight={700}>
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          lineHeight='24px'
          fontSize='12px'
          style={{ color: '#76808F', fontSize: '12px', marginTop: '20px' }}
        >
          {content}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
