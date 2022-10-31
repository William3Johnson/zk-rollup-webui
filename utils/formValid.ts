import { RegisterOptions } from 'react-hook-form';

export const selectTokenRule: Exclude<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
> = {
  required: 'Please select a token',
  validate: (v) => {
    return v.value >= 0 || 'Please select a token';
  },
};

export const selectNftRule: Exclude<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
> = {
  required: 'Please select a NFT',
  validate: (v) => {
    return v.value >= 0 || 'Please select a NFT';
  },
};

export const getBaseAmountRule = (): Exclude<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
> => {
  return {
    required: 'amount is required',
    validate: {
      positive: (v) => {
        return v > 0 || 'invalid number';
      },
    },
    valueAsNumber: true,
  };
};

export const getMaxAmountRule = (
  maxAmount: string,
  tokenLabel: string,
): Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'> => {
  const baseRule = getBaseAmountRule();
  return {
    ...baseRule,
    max: {
      value: maxAmount,
      message: `You don't have enough ${tokenLabel}`,
    },
  };
};

export const registerNameRule: Exclude<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
> = {
  required: 'account is required',
  minLength: {
    value: 6,
    message: 'Choose a username 6–30 characters long',
  },
  maxLength: {
    value: 30,
    message: 'Choose a username 6–30 characters long',
  },
  pattern: {
    value: /^[a-z0-9]+$/,
    message: `username can contain letters(a-z), numbers(0-9).`,
  },
};
