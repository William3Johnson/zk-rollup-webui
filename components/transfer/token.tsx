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
  InputGroup,
  InputRightAddon,
  Select,
} from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { userState } from 'atom/userState';
import { GroupBase } from 'chakra-react-select';
import { SUFFIX, ZK_TRACE_TX_ADDRESS } from 'common/constants';
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
import { getTransferTX } from 'utils/tx/transfer';
import { TransferNav } from './nav';

interface FormValues {
  token: IToken;
  account: string;
  amount: string;
  gasFeeId: string;
}

const Token: React.FC = () => {
  const login = useRecoilValue(userState);

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

  const [token, account, amount, gasFeeId] = watch(['token', 'account', 'amount', 'gasFeeId']);

  const selectToken = useSelectTokenInfo();
  useEffect(() => {
    if (!selectToken) return;
    setValue('token', selectToken);
  }, [selectToken, setValue]);

  const { data: tokenBalance, refetch: updateBalance } = useGetL2Balance(
    login.l2.name,
    token.label,
  );
  const handlerSetAmount = useSetMaxAmount(tokenBalance, (maxAmount: string) => {
    setValue('amount', maxAmount);
  });

  const { data: gasFeeAssets } = useFetchGasFeeAssets();
  useEffect(() => {
    if (gasFeeAssets) {
      setValue('gasFeeId', gasFeeAssets.assets[0].id.toString());
    }
  }, [gasFeeAssets, setValue]);

  const options = useGetAccountTokenOptions(login.l2.name);
  const gasFeeInfo = useGasFeeInfo(gasFeeId, TxType.TxTypeTransfer);
  const totalAmountInfo = useTotalAmountInfo(token.label, gasFeeId, amount, TxType.TxTypeTransfer);
  const amountValue = useAmountInfo(token.label, amount);
  const gasFeeEnough = useGasFeeValid(
    token.label,
    tokenBalance.count,
    gasFeeInfo?.amount ?? '0',
    amount,
  );

  const onSubmit: SubmitHandler<FormValues> = async () => {
    if (!gasFeeEnough) {
      setError('amount', { type: 'gasFee', message: 'Gas fee is not enough' });
      return;
    }

    if (!gasFeeInfo) return;

    const tx = await getTransferTX({
      fromAccountName: login.l2.name,
      toAccountName: account,
      assetId: token.value,
      assetAmount: amount,
      gasFeeAssetId: parseInt(gasFeeId),
      gasFeeAssetAmount: gasFeeInfo.amount,
    });
    if (!tx) return;

    try {
      const res = await zkbasClient.sendRawTx(TxType.TxTypeTransfer.toString(), tx);

      if (res) {
        NiceModal.show(TxFeedback, {
          status: 'success',
          href: `${ZK_TRACE_TX_ADDRESS}${res.tx_hash}`,
          hrefText: 'View in ZKTrace',
          okText: 'Transfer again',
        });
        await updateBalance();
      }
    } catch (err) {
      const errMsg = 'transfer error';
      NiceModal.show(TxFeedback, { status: 'failure', title: errMsg });
    }
  };

  return (
    <Card
      title='Transfer'
      desc='From your L2 account to L2 account.'
      onSubmit={handleSubmit(onSubmit)}
      Nav={<TransferNav />}
      Footer={
        <Button size='lg' variant='fota' mt='32px' type='submit'>
          Transfer
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
            ZKWallet Account
          </FormLabel>
          <InputGroup border='0'>
            <Input
              border='0'
              placeholder='Enter account name'
              bg='#F5F5F5'
              color='#76808F'
              fontSize='12px'
              borderRight='0'
              _placeholder={{ color: '#AEB4BC' }}
              {...register('account', {
                required: 'account is required',
              })}
            />
            <InputRightAddon
              bg='#F5F5F5'
              color='#76808F'
              fontSize='12px'
              fontWeight='600'
              border='0'
            >
              {SUFFIX}
            </InputRightAddon>
          </InputGroup>
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
            ≈ ${amountValue} USD
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
                      <FormControl isInvalid={!!errors.gasFeeId} id='gasFeeId'>
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
