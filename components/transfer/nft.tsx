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
  Select,
  useToast,
} from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { userState } from 'atom/userState';
import axios from 'axios';
import { GroupBase } from 'chakra-react-select';
import { INVALID_VALUE, SUFFIX, ZERO_NFT_PRICE, ZK_TRACE_TX_ADDRESS } from 'common/constants';
import { zkbasClient } from 'config/zkbasClient';
import { Card } from 'components/Card';
import { ChSelect } from 'components/chakra/ChSelect';
import TxFeedback from 'components/modal/TxFeedback';
import { useFetchGasFeeAssets } from 'hooks/api/useFetchGasFeeAssets';
import { useFetchNftsByAccountName } from 'hooks/api/useFetchNftsByAccountName';
import { useGetL2Balance } from 'hooks/api/useGetL2Balance';
import { useGasFeeInfo } from 'hooks/useGasFeeInfo';
import { useGasFeeValid } from 'hooks/useGasFeeValid';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { AiFillWarning } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import styles from 'styles/Card.module.css';
import { defaultGasFee, defaultNftValue, IGasFee, INft } from 'types/token';
import { TransferNav } from './nav';
import { getTransferNFTTX } from 'utils/tx/transferNFT';
import { useSelectNftInfo } from 'hooks/useSelectInfo';
import { selectNftRule } from 'utils/formValid';

interface FormValues {
  nft: INft;
  account: string;
  gasFee: IGasFee;
}

const Nft: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    register,
    setError,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nft: defaultNftValue,
    },
  });

  const toast = useToast();
  const userInfo = useRecoilValue(userState);

  const { data: nfts, refetch: updateNftList } = useFetchNftsByAccountName(userInfo.l2.name);
  const { data: gasFeeAssets } = useFetchGasFeeAssets();
  const options = nfts?.assets;
  const nft = watch('nft');
  const gasFee = useWatch({ name: 'gasFee', control, defaultValue: defaultGasFee });
  useEffect(() => {
    if (gasFeeAssets) {
      setValue('gasFee', {
        value: gasFeeAssets.assets[0].id.toString(),
        label: gasFeeAssets.assets[0].name,
      });
    }
  }, [gasFeeAssets, setValue]);

  const gasFeeInfo = useGasFeeInfo(gasFee.value.toString(), TxType.TxTypeTransferNft);
  const { data: tokenBalance } = useGetL2Balance(userInfo.l2.name, gasFee.label);

  const gasFeeEnough = useGasFeeValid(
    gasFee.label,
    tokenBalance.count,
    gasFeeInfo?.amount ?? '0',
    '0',
  );

  const selectNft = useSelectNftInfo();
  useEffect(() => {
    if (!selectNft) return;
    setValue('nft', selectNft);
  }, [setValue, selectNft]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { nft, account } = values;

    if (!gasFeeInfo) {
      toast({
        title: 'gas fee is invalid',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!gasFeeEnough) {
      setError('gasFee', { type: 'gasFee', message: 'Gas fee is not enough' });
      return;
    }

    const tx = await getTransferNFTTX({
      fromAccountName: userInfo.l2.name,
      toAccountName: account,
      nftIndex: nft.value,
      gasFeeAssetId: gasFee.value,
      gasFeeAssetAmount: gasFeeInfo.amount,
    });
    if (!tx) return;

    try {
      const res = await zkbasClient.sendRawTx(TxType.TxTypeTransferNft.toString(), tx);

      if (res) {
        NiceModal.show(TxFeedback, {
          status: 'success',
          href: `${ZK_TRACE_TX_ADDRESS}${res.tx_hash}`,
          hrefText: 'View in ZKTrace',
          okText: 'Transfer again',
        });

        resetField('nft', {
          defaultValue: defaultNftValue,
        });

        await updateNftList();
      }
    } catch (err) {
      let errMsg = 'transfer error';
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data as string;
      }
      NiceModal.show(TxFeedback, { status: 'failure', title: errMsg });
    }
  };

  return (
    <Card
      title='Transfer'
      desc='From your ZKwallet account to another ZKwallet account.'
      onSubmit={handleSubmit(onSubmit)}
      Footer={
        <Button variant='fota' size='lg' mt='32px' type='submit'>
          Transfer
        </Button>
      }
      Nav={<TransferNav />}
    >
      <Box paddingTop='25px'>
        <Controller
          name='nft'
          control={control}
          rules={selectNftRule}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl isInvalid={!!error} id='nft'>
                <FormLabel color='#1E2026' fontSize='12px'>
                  NFT
                </FormLabel>
                <ChSelect<FormValues['nft'], false, GroupBase<FormValues['nft']>>
                  instanceId='select-token'
                  placeholder='Select a NFT'
                  options={options}
                  {...field}
                  components={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    SingleValue: (props) => {
                      const { getValue } = props;
                      if (getValue()[0].id === defaultNftValue.id) {
                        return;
                      }
                      return (
                        <Flex alignItems='center'>
                          <picture>
                            <img width={24} height={24} src={getValue()[0].image} alt='' />
                          </picture>
                          <Box marginLeft='5px'>{getValue()[0].label}</Box>
                        </Flex>
                      );
                    },
                  }}
                  formatOptionLabel={({ label, image, price }) => {
                    return (
                      <Flex w='full' justifyContent='space-between' alignItems='center'>
                        <Flex>
                          <Box color='#1E2026' fontSize='14px'>
                            <picture>
                              <img width={24} height={24} src={image} alt='' />
                            </picture>
                          </Box>
                          <Box marginLeft='5px' color='#1E2026' fontSize='14px'>
                            {label}
                          </Box>
                        </Flex>
                        <Box>{price ? `${price} BNB` : ZERO_NFT_PRICE}</Box>
                      </Flex>
                    );
                  }}
                />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
                {nft.value !== INVALID_VALUE && nft.price && (
                  <Flex mt='4px' justifyContent='flex-end' fontSize='10px' color='#76808F'>
                    Current Price = {nft.price} BNB
                  </Flex>
                )}
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
                    {gasFeeAssets && gasFeeAssets.assets.length >= 1 && (
                      <Flex className={styles.token} alignItems='center'>
                        {gasFeeInfo && <Box marginRight='5px'>{gasFeeInfo?.amount}</Box>}
                        <Controller
                          name='gasFee'
                          control={control}
                          defaultValue={{
                            value: gasFeeAssets?.assets[0].id.toString(),
                            label: gasFeeAssets?.assets[0].name,
                          }}
                          render={({ field: { onChange, onBlur, ref }, fieldState: { error } }) => {
                            return (
                              <FormControl isInvalid={!!errors.gasFee} id='gasFee'>
                                <Select
                                  size='sm'
                                  border='none'
                                  ref={ref}
                                  onBlur={onBlur}
                                  onChange={(e) => {
                                    const index = parseInt(e.target.value.toString());
                                    const gasFee = gasFeeAssets.assets[index];
                                    onChange({
                                      value: gasFee.id.toString(),
                                      label: gasFee.name,
                                    });
                                  }}
                                >
                                  {gasFeeAssets?.assets.map((asset) => {
                                    return (
                                      <option key={asset.id} value={asset.id}>
                                        {asset.symbol}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            );
                          }}
                        />
                      </Flex>
                    )}
                  </Flex>
                  <Flex justifyContent='space-between' alignItems='center'>
                    {errors.gasFee?.type === 'gasFee' && (
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
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </Card>
  );
};

export default Nft;
