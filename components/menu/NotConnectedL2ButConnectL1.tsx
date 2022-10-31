import { Box, Stack } from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import ConnectL2Modal from 'components/modal/ConnectL2Modal';

export const NotConnectedL2ButConnectL1 = () => {
  const handleRegister = () => {
    NiceModal.show(ConnectL2Modal);
  };

  return (
    <Stack marginTop='16px' padding='12px 16px' minHeight='156px' bg='#FFF' borderRadius='8px'>
      <h3 style={{ color: '#76808F', fontSize: 16 }}>ZKwallet account</h3>
      <Stack justifyContent='center' alignItems='center'>
        <p style={{ color: '#76808F', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>
          Please register ZKwallet account.
        </p>

        <Box
          display='inline-flex'
          alignItems='center'
          justifyContent='space-evenly'
          as='button'
          width='161px'
          height='40px'
          lineHeight='40px'
          borderRadius='8px'
          fontSize='14px'
          fontWeight='500'
          bg='#5445FF'
          border='none'
          color='#FFF'
          _hover={{ cursor: 'pointer' }}
          onClick={handleRegister}
        >
          Register now
        </Box>
      </Stack>
    </Stack>
  );
};
