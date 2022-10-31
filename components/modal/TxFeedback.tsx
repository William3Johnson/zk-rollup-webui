import {
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import React, { ReactNode } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export type ITxFeedback = ISuccess | IFailure;

/**
 * transcation's status feedback
 */
const TxFeedback = NiceModal.create<ITxFeedback>((props) => {
  const modal = useModal();

  return (
    <Modal isCentered size='6xl' isOpen={modal.visible} onClose={modal.hide}>
      <ModalOverlay bg='blackAlpha.300' /* backdropFilter='blur(3px) hue-rotate(90deg)' */ />
      <ModalContent textAlign='center' w='800px' padding='34px 100px'>
        {props.status === 'success' && <Success {...props} />}
        {props.status === 'failure' && <Failure {...props} />}
      </ModalContent>
    </Modal>
  );
});
export default TxFeedback;

interface ISuccess {
  status: 'success';
  title: string;
  href: string;
  hrefText: string;
  okText: string;
}

const Success: React.FC<ISuccess> = ({ title = 'Transaction Sent!', href, hrefText, okText }) => {
  const modal = useModal();

  return (
    <>
      <ModalHeader fontSize='20px' color='#434344' fontWeight={700}>
        {title}
      </ModalHeader>
      <ModalCloseButton />
      <Box textAlign='center'>
        <Icon as={FaCheckCircle} w='80px' h='80px' bg='transparent' color='#02c076' />

        <p style={{ color: '#76808F', fontSize: '12px', marginTop: '20px' }}>
          Transactions sent successfully. You can view transaction status at activity history
        </p>
      </Box>

      <HStack justifyContent='space-around' marginTop='40px'>
        <Box
          as='a'
          border='none'
          color='#1E2026'
          borderRadius='4px'
          bg='#f5f5f5'
          fontSize='12px'
          h='40px'
          padding='0 12px'
          lineHeight='40px'
          target='_blank'
          href={href}
        >
          {hrefText}
        </Box>

        <Button
          variant='fota'
          as='button'
          border='none'
          borderRadius='4px'
          padding='0 12px'
          fontSize='12px'
          h='40px'
          lineHeight='40px'
          onClick={modal.hide}
        >
          {okText}
        </Button>
      </HStack>
    </>
  );
};

interface IFailure {
  status: 'failure';
  title?: string;
  content?: ReactNode;
}

const Failure: React.FC<IFailure> = ({ title, content }) => {
  const modal = useModal();

  return (
    <>
      <ModalHeader fontSize='20px' color='#434344' fontWeight={700}>
        Error: {title} !
      </ModalHeader>
      <ModalCloseButton />
      <Box textAlign='center'>
        <Icon as={FaTimesCircle} w='80px' h='80px' bg='transparent' color='#F35959' />

        <p style={{ color: '#76808F', fontSize: '12px', marginTop: '20px' }}>
          {content || 'Oops, there’s something error, please try again later.'}
        </p>
      </Box>

      <HStack justifyContent='space-around' marginTop='40px'>
        <Button
          variant='fota'
          as='button'
          border='none'
          borderRadius='4px'
          padding='0 12px'
          fontSize='12px'
          h='40px'
          w='150px'
          lineHeight='40px'
          onClick={modal.hide}
        >
          Retry
        </Button>
      </HStack>
    </>
  );
};
