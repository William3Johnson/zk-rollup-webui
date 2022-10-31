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
  Input,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { userState } from 'atom/userState';
import axios from 'axios';
import { GroupBase } from 'chakra-react-select';
import { Card } from 'components/Card';
import { GroupedOption } from 'components/chakra/ChSelect';
import { ChSelectInput } from 'components/chakra/ChSelectInput';
import TxFeedback from 'components/modal/TxFeedback';
import { useFetchAssets } from 'hooks/api/useFetchAssets';
import { useFetchPair } from 'hooks/api/useFetchPair';
import { useFetchSwapAmount } from 'hooks/api/useFetchSwapAmount';
import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import styles from 'styles/Card.module.css';
import { BSCTRACE_TX_ADDRESS } from 'common/constants';
import { selectTokenRule } from 'utils/formValid';
import { getMinReceiveAmout, getRate } from 'utils/tools';
import { zkbasClient } from 'config/zkbasClient';
import { getSwapTX } from 'utils/tx/swap';

interface FormValues {
  token: { address: string; label: string; value: number; amount: string };
  receiveToken: { address: string; label: string; value: number; amount: string };
  slip: string;
  gasFee: string;
}

const Swap: NextPage = () => {
  const login = useRecoilValue(userState);
  const { data: pairsInfo } = useFetchPair();
  const { control, handleSubmit, register, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      token: { value: -1 },
      receiveToken: { value: -1 },
    },
  });
  const { data: assetsInfo } = useFetchAssets();

  const [token, receiveToken, slip] = watch(['token', 'receiveToken', 'slip']);

  const assetsList = assetsInfo?.assets.map((asset) => {
    return {
      label: asset.name,
      value: asset.id,
      address: asset.address,
    };
  });

  const { tokenList, receiveTokenList } = useMemo(() => {
    const kvPairs: Record<number, number[]> = {};
    pairsInfo?.pairs.forEach((pair) => {
      if (!(pair.asset_a_id in kvPairs)) {
        kvPairs[pair.asset_a_id] = [pair.asset_b_id];
      } else {
        kvPairs[pair.asset_a_id].push(pair.asset_b_id);
      }

      if (!(pair.asset_b_id in kvPairs)) {
        kvPairs[pair.asset_b_id] = [pair.asset_a_id];
      } else {
        kvPairs[pair.asset_b_id].push(pair.asset_a_id);
      }
    });

    const tokenList = assetsList?.filter((asset) => asset.value in kvPairs);
    let receiveTokenList;

    const rList = kvPairs[token.value];
    if (rList) {
      receiveTokenList = assetsList?.filter((asset) => rList.includes(asset.value));
    }

    return {
      tokenList,
      receiveTokenList,
    };
  }, [pairsInfo, assetsList, token.value]);

  const pair = useMemo(() => {
    return pairsInfo?.pairs.find(
      (pair) => pair.asset_a_id === token.value && pair.asset_b_id === receiveToken.value,
    );
  }, [pairsInfo, token.value, receiveToken.value]);

  const { data: swapAmoutInfo } = useFetchSwapAmount(pair?.index as number, token);

  useEffect(() => {
    if (!swapAmoutInfo) return;

    if (swapAmoutInfo.asset_id === token.value) {
      setValue('token.amount', swapAmoutInfo.asset_amount);
    }
    if (swapAmoutInfo.asset_id === receiveToken.value) {
      setValue('receiveToken.amount', swapAmoutInfo.asset_amount);
    }
  }, [swapAmoutInfo, receiveToken.value, token.value, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { slip } = values;
    const assetBminAmount = (100 - parseInt(slip)).toString();

    const tx = await getSwapTX(
      login.l2.name,
      pair?.index ?? 0,
      token.value,
      token.amount,
      receiveToken.value,
      assetBminAmount,
    );
    if (!tx) return;

    try {
      const res = await zkbasClient.sendRawTx(TxType.TxTypeEmpty.toString(), tx);
      if (res) {
        NiceModal.show(TxFeedback, {
          status: 'success',
          href: `${BSCTRACE_TX_ADDRESS}${res.tx_hash}`,
          hrefText: 'View in BSCTrace',
          okText: 'Swap Again',
        });
      }
    } catch (err) {
      let errMsg = 'swap error';
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data as string;
      }

      NiceModal.show(TxFeedback, { status: 'failure', title: errMsg });
    }
  };

  return (
    <Card
      title='AtomSwap'
      desc='Swap the token within ZKwallet wallet.'
      onSubmit={handleSubmit(onSubmit)}
      Footer={
        <Button
          size='lg'
          variant='fota'
          color='#FFF'
          bg='#5445FF'
          h='50px'
          w='100%'
          mt='32px'
          type='submit'
        >
          Swap
        </Button>
      }
    >
      <Box paddingTop='10px'>
        <FormControl isInvalid={!!formState.errors.token}>
          <FormLabel color='#1E2026' fontSize='12px'>
            Token
          </FormLabel>
          <InputGroup>
            <Controller
              name='token'
              control={control}
              rules={selectTokenRule}
              render={({ field: { onChange, onBlur, ref }, fieldState: { error } }) => {
                return (
                  <ChSelectInput<GroupedOption, false, GroupBase<GroupedOption>>
                    name='token'
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    instanceId='token'
                    placeholder='BNB'
                    options={tokenList}
                  />
                );
              }}
            />

            <Input
              color='#76808F'
              bg='#F5F5F5'
              border='0'
              fontSize='12px'
              placeholder='0'
              type='number'
              sx={{
                borderRadius: '0 3px 3px 0',
                borderLeft: '1px solid #E6E8EA',
              }}
              {...register('token.amount', {
                required: 'please input amount',
              })}
            />
          </InputGroup>
          <FormErrorMessage>{formState.errors.token?.message}</FormErrorMessage>
          <FormErrorMessage>{formState.errors.token?.amount?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formState.errors.receiveToken} marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px'>
            Receive Token
          </FormLabel>
          <InputGroup>
            <Controller
              name='receiveToken'
              control={control}
              rules={{
                required: 'Please select a token',
                validate: (v) => {
                  return v.value > 0 || 'Please select a token';
                },
              }}
              render={({ field: { onChange, onBlur, ref } }) => (
                <ChSelectInput<GroupedOption, false, GroupBase<GroupedOption>>
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  instanceId='receiveToken'
                  placeholder='BNB'
                  options={receiveTokenList}
                />
              )}
            />

            <Input
              color='#76808F'
              bg='#F5F5F5'
              border='0'
              fontSize='12px'
              placeholder='0'
              type='number'
              disabled
              sx={{
                borderRadius: '0 3px 3px 0',
                borderLeft: '1px solid #E6E8EA',
              }}
              _disabled={{
                bg: '#F5F5F5',
                cursor: 'not-allowed',
                '&:hover[disabled]': {
                  opacity: 1,
                  bg: '#F5F5F5',
                },
              }}
              {...register('receiveToken.amount', {
                required: 'please input amount',
              })}
            />
          </InputGroup>
          <FormErrorMessage>{formState.errors.receiveToken?.message}</FormErrorMessage>
          <FormErrorMessage>{formState.errors.receiveToken?.amount?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formState.errors.slip} marginTop='17px'>
          <FormLabel color='#1E2026' fontSize='12px'>
            Slippage Tolerance
          </FormLabel>
          <InputGroup border='0'>
            <NumberInput min={0} max={100} step={0.1} clampValueOnBlur={false} w='full'>
              <NumberInputField
                placeholder='Enter Percentage'
                color='#76808F'
                bg='#F5F5F5'
                border='0'
                fontSize='12px'
                {...register('slip', {
                  required: 'slip is required',
                  valueAsNumber: true,
                  validate: (v) => parseInt(v) >= 0 && parseInt(v) <= 100,
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <InputRightAddon
              bg='#F5F5F5'
              color='#76808F'
              fontSize='12px'
              fontWeight='600'
              border='0'
            >
              %
            </InputRightAddon>
          </InputGroup>
          <FormErrorMessage>{formState.errors.slip?.message}</FormErrorMessage>
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
                      <Box marginRight='5px'>1</Box>
                      <FormControl isInvalid={!!formState.errors.gasFee} id='gasFee'>
                        <Select
                          size='sm'
                          border='none'
                          {...register('gasFee', {
                            onChange: (e) => {
                              // TODO: not change USD yet
                              // console.log(e.target.value);
                            },
                          })}
                        >
                          <option value='1'>1</option>
                          {/* {gasFeeAssets?.assets.map((asset) => {
                            return (
                              <option key={asset.id} value={asset.id}>
                                {asset.symbol}
                              </option>
                            );
                          })} */}
                        </Select>
                      </FormControl>
                    </Flex>
                  </Flex>
                  <Box className={styles.value}>≈ $ 0 USD</Box>
                </Box>

                <Box marginTop='10px'>
                  <Flex alignItems='center' justifyContent='space-between'>
                    <h3 className={styles.h3}>Exchange rate</h3>
                    <Flex className={styles.token} alignItems='center'>
                      <Box marginRight='5px'>{getRate(token.amount, receiveToken.amount)}</Box>
                    </Flex>
                  </Flex>
                </Box>

                <Box marginTop='10px'>
                  <Flex alignItems='center' justifyContent='space-between'>
                    <h3 className={styles.h3}>Fee Rate</h3>
                    <Flex className={styles.token} alignItems='center'>
                      <Box marginRight='5px'>{pair?.fee_rate}</Box>
                    </Flex>
                  </Flex>
                </Box>

                <Box marginTop='10px'>
                  <Flex alignItems='center' justifyContent='space-between'>
                    <h3 className={styles.h3}>Min Receive Amount</h3>
                    <Flex className={styles.token} alignItems='center'>
                      <Box marginRight='5px'>{getMinReceiveAmout(receiveToken.amount, slip)}</Box>
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

export default Swap;
