import { CopyIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useClipboard,
} from '@chakra-ui/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useLoginL2 } from 'hooks/login/useLoginL2';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { contractABI, DEPOSIT_TOKEN_URL, SUFFIX, ZKBAS_CONTRACT_ADDRESS } from 'common/constants';
import { registerUser } from 'utils/crypto';
import { registerNameRule } from 'utils/formValid';
import { useAccount, useContract, useSigner } from 'wagmi';
import { delay } from 'utils/tools';

const Register: React.FC<{
  address: string | undefined;
  username: string;
  onChangeUsername(name: string): void;
  onSubmit(step: 'REGISTER' | 'SUCCESS'): void;
}> = (props) => {
  const { address, username, onChangeUsername, onSubmit } = props;
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: ZKBAS_CONTRACT_ADDRESS,
    contractInterface: contractABI,
    signerOrProvider: signer,
  });
  const [loading, setLoading] = useState(false);
  const { refetch: toLogin } = useLoginL2();

  const {
    trigger,
    register,
    reset,
    formState: { errors },
  } = useForm<{ accountName: string }>();

  const handleRegister = async (name: string) => {
    const isValid = await trigger();

    if (!isValid) return;
    if (address === undefined) return;

    setLoading(true);
    const res = await registerUser(signer, contract, name, address);

    if (res) {
      // becase don't know how long getL2UserInfo API cost
      await delay(120000);
      await toLogin();

      if (res) {
        onSubmit('SUCCESS');
      }
    }

    setLoading(false);
  };

  useMount(() => {
    reset({ accountName: '' });
  });

  return (
    <>
      <ModalHeader fontSize='20px' color='#1e2026' fontWeight={700} textAlign='center'>
        Reigster ZKwallet account
      </ModalHeader>
      <ModalBody
        lineHeight='24px'
        fontSize='12px'
        style={{ color: '#76808F', fontSize: '12px', marginTop: '20px' }}
        textAlign='center'
      >
        <Stack alignItems='center'>
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: '#76808F',
              marginBottom: 56,
            }}
          >
            In ZKwallet account, username is the basic way to identify, set a username you like and
            register.
          </p>

          <FormControl width='360px' isInvalid={!!errors.accountName}>
            <InputGroup>
              <Input
                defaultValue={username}
                placeholder='Set your username'
                borderRadius='8px'
                bg='#F5F5F5'
                color='#76808F'
                {...register('accountName', {
                  ...registerNameRule,
                  onChange: (e) => {
                    onChangeUsername(e.target.value);
                  },
                })}
              />
              <InputRightAddon>{SUFFIX}</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.accountName?.message}</FormErrorMessage>
          </FormControl>

          <Box paddingTop='64px'>
            <Button
              w='160px'
              h='40px'
              variant='fota'
              lineHeight='40px'
              borderRadius='8px'
              fontSize='14px'
              isLoading={loading}
              loadingText='Register'
              onClick={async () => {
                await handleRegister(username);
              }}
            >
              Register
            </Button>
          </Box>
        </Stack>
      </ModalBody>
    </>
  );
};

const Success: React.FC<{ username: string; address: string | undefined }> = (props) => {
  const { username, address } = props;
  const { hasCopied, onCopy } = useClipboard(address || '');

  return (
    <>
      <ModalHeader fontSize='20px' color='#1e2026' fontWeight={700} textAlign='center'>
        Created successfully!
      </ModalHeader>

      <ModalBody
        lineHeight='24px'
        fontSize='12px'
        style={{ color: '#76808F', fontSize: '12px', marginTop: '20px' }}
        textAlign='center'
      >
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#76808F',
            marginBottom: 24,
          }}
        >
          Congratulations! Your acoount created successfully. Before we start,you need to deposit
          some token to your L2 account.
        </p>

        <Flex
          bg='rgba(114, 102, 255, 0.1)'
          padding='24px 20px'
          borderRadius='8px'
          justifyContent='center'
        >
          <Box marginRight='10px'>
            <Avatar name={username} />
          </Box>
          <Box>
            <h3 style={{ color: '#1E2026', fontSize: 14, textAlign: 'left' }}>
              {username}
              {SUFFIX}
            </h3>
            <h4 style={{ color: '#76808F', fontSize: 11 }}>
              <span>{address}</span>
              <Box as='button' onClick={onCopy} marginLeft='3px'>
                <CopyIcon w='13px' />
                <span style={{ marginLeft: 3, fontSize: 12 }}>{hasCopied ? 'Copied' : ''}</span>
              </Box>
            </h4>
          </Box>
        </Flex>

        <Box
          marginTop='40px'
          as='button'
          bg='#5445FF'
          borderRadius='8px'
          width='160px'
          height='40px'
          color='#FFF'
          fontSize='16px'
          onClick={() => {
            window.location.href = DEPOSIT_TOKEN_URL;
          }}
        >
          Deposit
        </Box>
      </ModalBody>
    </>
  );
};

export default NiceModal.create(() => {
  const { address } = useAccount();
  const [username, setUsername] = React.useState<string>('');
  const [step, setStep] = React.useState<'REGISTER' | 'SUCCESS'>('REGISTER');
  const modal = useModal();

  return (
    <Modal isCentered size='6xl' isOpen={modal.visible} onClose={() => modal.hide()}>
      <ModalOverlay bg='blackAlpha.300' />

      <ModalContent w='800px' padding='34px 70px'>
        <ModalCloseButton />
        <Stack alignItems='center' justifyContent='flex-start' minHeight='400px'>
          {step === 'REGISTER' && (
            <Register
              address={address}
              username={username}
              onChangeUsername={setUsername}
              onSubmit={setStep}
            />
          )}
          {step === 'SUCCESS' && <Success username={username} address={address} />}
        </Stack>
      </ModalContent>
    </Modal>
  );
});
