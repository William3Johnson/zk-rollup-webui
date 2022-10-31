import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { userState } from 'atom/userState';
import { SUFFIX, ZKBAS_CONTRACT_ADDRESS } from 'common/constants';
import { Card } from 'components/Card';
import Info from 'components/modal/Info';
import { NOT_EXIST_NFT, useFetchYourNftInfoById } from 'hooks/api/useFetchNftInfoById';
import { useDepositBEP721 } from 'hooks/bep721/useDepositBEP721';
import { useGetApproved } from 'hooks/bep721/useGetApproved';
import { useBEP721Contract } from 'hooks/contract/useBEP721Contract';
import { useGetAccountNfts } from 'hooks/zkbnb/useGetAccountNfts';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useBoolean, useDebounce } from 'react-use';
import { useRecoilValue } from 'recoil';
import { getNftAddress } from 'utils/tools';
import { DepositNav } from './nav';

interface FormValues {
  tokenIndex: string;
}

const Nft: React.FC = () => {
  const userInfo = useRecoilValue(userState);

  const {
    handleSubmit,
    register,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>();

  const [tokenIndex] = watch(['tokenIndex']);
  const accountNftList = useGetAccountNfts();
  const [debounceTokenIndex, setDebounceTokenIndex] = useState<FormValues['tokenIndex']>('');
  const [approving, setApproving] = useBoolean(false);
  const [depositing, toggleDepositing] = useBoolean(false);

  useDebounce(
    () => {
      setDebounceTokenIndex(tokenIndex);
    },
    800,
    [tokenIndex],
  );

  const contractAddress = getNftAddress(accountNftList, debounceTokenIndex);
  const bep721Contract = useBEP721Contract(contractAddress);
  const { data: nftInfo, isLoading: nftFetched } = useFetchYourNftInfoById(debounceTokenIndex);
  const { approved, toggleApproved, isYours, loading } = useGetApproved(
    bep721Contract,
    nftInfo?.nftIndex,
  );
  const { refetch: deposit721 } = useDepositBEP721(
    userInfo.l2.name.replace(SUFFIX, ''),
    debounceTokenIndex,
    contractAddress,
  );

  useEffect(() => {
    if (nftInfo.nftIndex === NOT_EXIST_NFT.nftIndex && !nftFetched) {
      setError('tokenIndex', { type: 'err', message: `NFT ${debounceTokenIndex} is not exist` });
      return;
    }

    if (!isYours && !isEmpty(debounceTokenIndex) && !nftFetched) {
      setError('tokenIndex', {
        type: 'err',
        message: 'This NFT is not in your L1 wallet, you cannot deposit it now',
      });
      return;
    } else {
      clearErrors('tokenIndex');
    }
  }, [debounceTokenIndex, setError, clearErrors, nftInfo, nftFetched, isYours]);

  const onApprove = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    try {
      setApproving(true);
      const approveRes = await bep721Contract.approve(ZKBAS_CONTRACT_ADDRESS, debounceTokenIndex);
      const res = await approveRes.wait();
      if (res) {
        setApproving(false);
        toggleApproved(true);
      }
    } catch (e) {
      // reject metamask
      setApproving(false);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async () => {
    toggleDepositing(true);
    await deposit721();
    toggleDepositing(false);
  };

  return (
    <Card
      title='Deposit'
      desc='From your L1 account to your ZKWallet account.'
      onSubmit={handleSubmit(onSubmit)}
      Footer={
        <>
          {!(debounceTokenIndex === '' || !isYours || approved) && (
            <Button
              variant='fota'
              size='lg'
              mt='32px'
              onClick={onApprove}
              isLoading={approving}
              _loading={{ cursor: 'not-allowed' }}
            >
              Approve ZKwallet to access your NFT
            </Button>
          )}
          <Button
            variant='fota'
            size='lg'
            mt='32px'
            type='submit'
            isLoading={depositing}
            _loading={{ cursor: 'not-allowed' }}
            disabled={debounceTokenIndex === '' || !approved || depositing}
          >
            Deposit
          </Button>
        </>
      }
      Nav={<DepositNav />}
    >
      <Box paddingTop='25px'>
        <Flex alignItems='center'>
          <RiErrorWarningFill fontSize='16px' color='#F0B90B' />
          <Box color='#76808F' fontSize='12px' ml='3px'>
            Only support NFTs created at zkBNB
          </Box>
        </Flex>

        <FormControl marginTop='17px' isInvalid={!!errors.tokenIndex}>
          <FormLabel color='#1E2026' fontSize='12px'>
            Token ID
          </FormLabel>
          <Input
            border='0'
            placeholder='Enter Token ID'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            type='number'
            _placeholder={{ color: '#AEB4BC' }}
            {...register('tokenIndex', {
              required: 'Token Index is required',
            })}
          />
          {loading === 'end' && !nftFetched && (
            <FormErrorMessage>{errors.tokenIndex?.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px'>
            <HStack justifyContent='space-between'>
              <Box>Collection Contract Address (L1)</Box>
              <Box
                color='#76808F'
                fontSize='10px'
                textDecoration='underline'
                as='a'
                href='#!'
                onClick={() => {
                  NiceModal.show(Info, {
                    title: 'What’s Collection contract address?',
                    content: (
                      <>
                        <Box as='p'>
                          Once a NFT is withdrawed from ZkBNB to BSC, it will mint a mirror NFT by a
                          specified contract on BSC. The contract address is a necessary parameter
                          to locate the unique NFT during deposit operation.
                        </Box>
                      </>
                    ),
                  });
                }}
              >
                <RiErrorWarningFill fontSize='14px' color='#CCC' />
              </Box>
            </HStack>
          </FormLabel>

          <Input
            border='0'
            placeholder='Collection Contract Address(L1)'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            _placeholder={{ color: '#AEB4BC', fontWeight: 400 }}
            readOnly
            fontWeight='700'
            defaultValue={contractAddress}
          />
        </FormControl>

        <FormControl marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px'>
            Collection Name
          </FormLabel>

          <Input
            border='0'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            readOnly
            fontWeight='700'
            defaultValue={nftInfo?.collectionName}
          />
        </FormControl>

        <FormControl marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px'>
            NFT Name
          </FormLabel>

          <Input
            border='0'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            readOnly
            fontWeight='700'
            defaultValue={nftInfo?.name}
          />
        </FormControl>

        <FormControl marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px'>
            ZKWallet Account
          </FormLabel>

          <Input
            border='0'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            _placeholder={{ color: '#AEB4BC' }}
            defaultValue={userInfo.l2.name}
            readOnly
            textAlign='right'
            fontWeight='700'
          />
        </FormControl>
      </Box>
    </Card>
  );
};

export default Nft;
