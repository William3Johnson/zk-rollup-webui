import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import { userState } from 'atom/userState';
import { GroupBase } from 'chakra-react-select';
import { BNB, SUFFIX } from 'common/constants';
import { Card } from 'components/Card';
import { ChSelect } from 'components/chakra/ChSelect';
import { constants } from 'ethers';
import { useApproveBEP20 } from 'hooks/bep20/useApproveBEP20';
import { useBEP20Allowance } from 'hooks/bep20/useBEP20Allowance';
import { useBEP20BanlanceOf } from 'hooks/bep20/useBEP20BanlanceOf';
import { useDepositBEP20 } from 'hooks/bep20/useDepositBEP20';
import { useBEP20Contract } from 'hooks/contract/useBEP20Contract';
import { useZkBNBContract } from 'hooks/contract/useZkBNBContract';
import { useAmountInfo } from 'hooks/useAmountInfo';
import { useGetAllTokenOptions } from 'hooks/useGetTokenOptions';
import { useSetMaxAmount } from 'hooks/useSetMaxAmount';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useToggle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { depositBNB } from 'utils/contract';
import { getMaxAmountRule, selectTokenRule } from 'utils/formValid';
import { useAccount } from 'wagmi';
import { DepositNav } from './nav';

interface FormValues {
  token: {
    address: string;
    label: string;
    value: number;
    price: string;
    icon: string;
  };
  amount: string;
}

const Token: React.FC = () => {
  const { address } = useAccount();
  const login = useRecoilValue(userState);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      token: {
        label: '',
        address: constants.AddressZero,
      },
    },
  });

  const [amount, token] = watch(['amount', 'token']);
  const contractZkBNB = useZkBNBContract();
  const contractBEP20 = useBEP20Contract(token.address);
  const { refetch: approveBEP20 } = useApproveBEP20(contractBEP20);
  const { refetch: depositBEP20 } = useDepositBEP20(
    contractZkBNB,
    login.l2.name.replace(SUFFIX, ''),
    token.address,
    amount,
  );
  const [depositing, toggleDepositing] = useToggle(false);
  const { data: tokenBalance, refetch: updateBalance } = useBEP20BanlanceOf(
    token.label,
    token.address,
  );

  const amountValue = useAmountInfo(token.label, amount);
  const handlerSetAmount = useSetMaxAmount(tokenBalance, (maxAmount: string) => {
    setValue('amount', maxAmount);
  });
  const options = useGetAllTokenOptions();
  const allowance = useBEP20Allowance(token.label, token.address);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { amount, token } = values;
    const account = login.l2.name;

    toggleDepositing(true);
    if (token.label === BNB) {
      await depositBNB(contractZkBNB, account.replace(SUFFIX, ''), amount);
    } else {
      await depositBEP20();
    }
    await updateBalance();
    toggleDepositing(false);
  };

  const approve = async () => {
    if (!address) return;

    allowance.setStep('loading');
    const res = await approveBEP20();

    if (res.isSuccess) {
      allowance.setStep('end');
    } else {
      allowance.setStep('idle');
    }
  };

  return (
    <Card
      title='Deposit'
      desc='From your L1 account to your ZKwallet account.'
      onSubmit={handleSubmit(onSubmit)}
      Nav={<DepositNav />}
      Footer={
        <>
          {token.label !== BNB && (
            <>
              {token.label && allowance.isZero && allowance.step !== 'start' && (
                <Button
                  variant='fota'
                  size='lg'
                  mt='32px'
                  onClick={approve}
                  isLoading={allowance.step === 'loading'}
                  _loading={{ cursor: 'not-allowed' }}
                  disabled={allowance.step === 'loading' || !allowance.isZero}
                >
                  Approve zkwallet to access your {token.label}
                </Button>
              )}
              <Button
                variant='fota'
                size='lg'
                mt='32px'
                type='submit'
                disabled={allowance.isZero || depositing}
                isLoading={depositing}
                _loading={{ cursor: 'not-allowed' }}
              >
                Deposit
              </Button>
            </>
          )}

          {token.label === BNB && (
            <Button
              variant='fota'
              size='lg'
              mt='32px'
              type='submit'
              disabled={depositing}
              isLoading={depositing}
              _loading={{ cursor: 'not-allowed' }}
            >
              Deposit
            </Button>
          )}
        </>
      }
    >
      <Box paddingTop='25px'>
        <Controller
          name='token'
          control={control}
          rules={selectTokenRule}
          render={({ field: { onChange, onBlur, ref }, fieldState: { error } }) => {
            return (
              <FormControl isInvalid={!!error} id='token'>
                <FormLabel color='#1E2026' fontSize='12px'>
                  <HStack justifyContent='space-between'>
                    <Box>Token</Box>
                    {tokenBalance.count !== '' && (
                      <Box color='#76808F'>Balance: {tokenBalance.count}</Box>
                    )}
                  </HStack>
                </FormLabel>
                <ChSelect<FormValues['token'], false, GroupBase<FormValues['token']>>
                  name='token'
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  instanceId='select-token'
                  placeholder='Select a token'
                  options={options}
                  components={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    SingleValue: (props) => {
                      const { getValue } = props;
                      if (getValue().length === 0) {
                        return;
                      }
                      return (
                        <HStack alignItems='center'>
                          <Box>{getValue()[0].label}</Box>
                        </HStack>
                      );
                    },
                  }}
                  formatOptionLabel={({ icon, label, price }) => (
                    <Flex justifyContent='space-between' w='full'>
                      <HStack color='#1E2026' fontSize='14px'>
                        <Box>
                          <Avatar
                            color='black'
                            bg='transparent'
                            size='xs'
                            src={icon}
                            name={label}
                          />
                        </Box>
                        <Box>{label}</Box>
                      </HStack>
                      <Box color='#1E2026' fontSize='14px'>
                        ${price}
                      </Box>
                    </Flex>
                  )}
                />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            );
          }}
        />

        <FormControl marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px' htmlFor='account'>
            ZKWallet Account
          </FormLabel>

          <Input
            border='0'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            _placeholder={{ color: '#AEB4BC' }}
            defaultValue={login.l2.name}
            readOnly
            textAlign='right'
            fontWeight='700'
          />
        </FormControl>

        <FormControl marginTop='17px' isInvalid={!!errors.amount}>
          <FormLabel color='#1E2026' fontSize='12px'>
            <HStack justifyContent='space-between'>
              <Box>Amount</Box>
              {!tokenBalance.isZero && (
                <Box
                  as='button'
                  type='button'
                  color='#5445FF'
                  fontWeight={800}
                  fontSize='12px'
                  onClick={handlerSetAmount}
                >
                  Max
                </Box>
              )}
            </HStack>
          </FormLabel>
          <Input
            border='0'
            placeholder='0'
            bg='#F5F5F5'
            color='#76808F'
            fontSize='12px'
            borderRight='0'
            // type='number'
            _placeholder={{ color: '#AEB4BC' }}
            {...register('amount', {
              ...getMaxAmountRule(tokenBalance.count || '0', token.label),
            })}
          />
          <Flex
            marginTop='4px'
            color='#76808F'
            fontSize='10px'
            height='15px'
            lineHeight='15px'
            justifyContent='right'
            overflow='hidden'
          >
            $ {amountValue} USD
          </Flex>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>
      </Box>
    </Card>
  );
};

export default Token;
