import { TxType } from '@bnb-chain/zkbas-js-sdk';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
} from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { userState } from 'atom/userState';
import axios from 'axios';
import { GroupBase } from 'chakra-react-select';
import { ZK_TRACE_TX_ADDRESS } from 'common/constants';
import { Card } from 'components/Card';
import { ChSelect } from 'components/chakra/ChSelect';
import TxFeedback from 'components/modal/TxFeedback';
import { zkbasClient } from 'config/zkbasClient';
import { useFetchGasFeeAssets } from 'hooks/api/useFetchGasFeeAssets';
import { useGetL2Balance } from 'hooks/api/useGetL2Balance';
import { useAmountInfo } from 'hooks/useAmountInfo';
import { useGasFeeInfo } from 'hooks/useGasFeeInfo';
import { useGasFeeValid } from 'hooks/useGasFeeValid';
import { useGetAccountTokenOptions } from 'hooks/useGetTokenOptions';
import { useSelectTokenInfo } from 'hooks/useSelectInfo';
import { useSetMaxAmount } from 'hooks/useSetMaxAmount';
import { useTotalAmountInfo } from 'hooks/useTotalAmountInfo';
import { isEmpty, isNaN, isUndefined } from 'lodash';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiFillWarning } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import styles from 'styles/Card.module.css';
import { defaultTokenValue, IToken } from 'types/token';
import { getMaxAmountRule, selectTokenRule } from 'utils/formValid';
import { getWithdrawTX } from 'utils/tx/withdraw';
import { useAccount } from 'wagmi';
import { WithdrawNav } from './nav';

interface FormValues {
  token: IToken;
  account: string;
  amount: string;
  gasFeeId: string;
}

const Token: React.FC = () => {
  const login = useRecoilValue(userState);
  const { address } = useAccount();
  const { data: gasFeeAssets } = useFetchGasFeeAssets();
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      token: defaultTokenValue,
    },
  });

  const selectToken = useSelectTokenInfo();
  useEffect(() => {
    if (!selectToken) return;
    setValue('token', selectToken);
  }, [selectToken, setValue]);

  const options = useGetAccountTokenOptions(login.l2.name);

  useEffect(() => {
    if (gasFeeAssets) {
      setValue('gasFeeId', gasFeeAssets.assets[0].id.toString());
    }
  }, [gasFeeAssets, setValue]);

  const [amount, token, gasFeeId] = watch(['amount', 'token', 'gasFeeId']);
  const amountValue = useAmountInfo(token.label, amount);
  const gasFeeInfo = useGasFeeInfo(gasFeeId, TxType.TxTypeWithdraw);
  const totalAmountInfo = useTotalAmountInfo(token.label, gasFeeId, amount, TxType.TxTypeWithdraw);

  const { data: tokenBalance, refetch: updateBalance } = useGetL2Balance(
    login.l2.name,
    token.label,
  );

  const handlerSetAmount = useSetMaxAmount(tokenBalance, (maxAmount: string) => {
    setValue('amount', maxAmount);
  });

  const gasFeeEnough = useGasFeeValid(
    token.label,
    tokenBalance.count,
    gasFeeInfo?.amount ?? '0',
    amount,
  );

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!address || !gasFeeInfo) return;

    if (!gasFeeEnough) {
      setError('amount', { type: 'gasFee', message: 'Gas fee is not enough' });
      return;
    }

    try {
      const tx = await getWithdrawTX({
        fromAccountName: login.l2.name,
        toAddress: address,
        assetId: token.value,
        amount,
        gasFeeAssetId: parseInt(gasFeeId),
        gasFeeAssetAmount: gasFeeInfo.amount,
      });
      if (!tx) return;

      const res = await zkbasClient.sendRawTx(TxType.TxTypeWithdraw.toString(), tx);
      NiceModal.show(TxFeedback, {
        status: 'success',
        href: `${ZK_TRACE_TX_ADDRESS}${res.tx_hash}`,
        hrefText: 'View in ZKTrace',
        okText: 'Withdraw again',
      });
      await updateBalance();
    } catch (err) {
      let errMsg = 'withdraw error';
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data as string;
      }

      NiceModal.show(TxFeedback, { status: 'failure', title: errMsg });
    }
  };

  return (
    <Card
      title='Withdraw'
      desc='From your ZKwallet account to your L1 account.'
      onSubmit={handleSubmit(onSubmit)}
      Nav={<WithdrawNav />}
      Footer={
        <Button size='lg' variant='fota' mt='32px' type='submit'>
          Withdraw
        </Button>
      }
    >
      <Box paddingTop='25px'>
        <Controller
          name='token'
          control={control}
          rules={selectTokenRule}
          defaultValue={defaultTokenValue}
          render={({ field, fieldState: { error } }) => {
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
                  instanceId='select-token'
                  placeholder='Select a token'
                  options={options}
                  {...field}
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
                  formatOptionLabel={({ value, label, balance }) => {
                    return (
                      <Flex justifyContent='space-between' w='full'>
                        <Box color='#1E2026' fontSize='14px'>
                          {label}
                        </Box>
                        <Box color='#1E2026' fontSize='14px'>
                          {balance}
                        </Box>
                      </Flex>
                    );
                  }}
                />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            );
          }}
        />
        <FormControl marginTop='17px' isInvalid={!!errors.account}>
          <FormLabel color='#1E2026' fontSize='12px' htmlFor='account'>
            L1 Account
          </FormLabel>
          <Input
            border='0'
            bg='#F5F5F5'
            color='#AEB4BC'
            fontSize='12px'
            borderRight='0'
            defaultValue={address}
            readOnly
          />
          <FormErrorMessage>{errors.account?.message}</FormErrorMessage>
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
            _placeholder={{ color: '#AEB4BC' }}
            {...register('amount', {
              ...getMaxAmountRule(tokenBalance.count, token.label),
            })}
          />
          <Flex
            marginTop='4px'
            color='#76808F'
            fontSize='10px'
            height='15px'
            lineHeight='15px'
            justifyContent='right'
          >
            ≈ $ {amountValue} USD
          </Flex>
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>
        <Box marginTop='25px'>
          <Accordion allowToggle border='none'>
            <AccordionItem border='none'>
              <h2 className={styles.h2}>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    Details
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel border='none'>
                <Box marginTop='10px'>
                  <Flex alignItems='center' justifyContent='space-between'>
                    <h3 className={styles.h3}>Gas Fee</h3>
                    <Flex className={styles.token} alignItems='center'>
                      {gasFeeInfo && <Box marginRight='5px'>{gasFeeInfo?.amount}</Box>}
                      <FormControl isInvalid={!!errors.gasFeeId} id='gasFee'>
                        <Select size='sm' border='none' {...register('gasFeeId')}>
                          {gasFeeAssets?.assets.map((asset) => {
                            return (
                              <option key={asset.id} value={asset.id}>
                                {asset.symbol}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Flex>
                  </Flex>

                  <Flex justifyContent='space-between' alignItems='center'>
                    {errors.amount?.type === 'gasFee' && (
                      <Box className={styles.gferr}>
                        <AiFillWarning fontSize='10px' style={{ display: 'inline-block' }} />
                        &nbsp;
                        <span>Gas fee is not enough</span>
                      </Box>
                    )}
                    <Box flex={1} className={styles.value}>
                      ≈ ${gasFeeInfo?.value} USD
                    </Box>
                  </Flex>
                </Box>

                <Box marginTop='10px'>
                  <Flex justifyContent='space-between'>
                    <h3 className={styles.h3}>Total Amount</h3>

                    <Flex textAlign='right' direction='column'>
                      {!isEmpty(token.label) &&
                        token.label !== totalAmountInfo?.gasSymbol &&
                        !isUndefined(amount) &&
                        !isNaN(amount) && (
                          <Box className={styles.token}>
                            <span>{amount}</span>
                            &nbsp;
                            <span>{token.label}</span>
                          </Box>
                        )}
                      <Flex justifyContent='flex-end' className={styles.token} textAlign='right'>
                        <Box marginRight='5px'>{totalAmountInfo?.amount ?? 0}</Box>
                        <Box>{totalAmountInfo?.gasSymbol}</Box>
                      </Flex>
                      <Box className={styles.value}>≈ ${totalAmountInfo?.value ?? 0} USD</Box>
                    </Flex>
                  </Flex>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </Card>
  );
};

export default Token;
