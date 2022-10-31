import { Flex, Stack } from '@chakra-ui/react';

export const NotConnectedL2: React.FC = () => {
  return (
    <Stack marginTop='16px' padding='12px 16px' minHeight='156px' bg='#FFF' borderRadius='8px'>
      <h3 style={{ color: '#76808F', fontSize: 16 }}>ZKwallet account</h3>
      <Flex justifyContent='center' alignItems='center'>
        <p style={{ color: '#76808F', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
          Please connect your L1 wallet first.
        </p>
      </Flex>
    </Stack>
  );
};
