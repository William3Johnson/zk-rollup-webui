import { JsonRpcError } from '@metamask/types';
import { BigNumber } from 'ethers';

interface EthersError {
  code?: string | number;
  message: string;
  error?: NestedEthersError;
  transaction?: {
    gasLimit: BigNumber;
    nonce: number;
  };
  receipt?: {
    gasUsed: BigNumber;
  };
  action?: string;
  reason?: string;
}

interface NestedEthersError {
  code?: string | number;
  message?: string;
  data?: {
    message?: string;
  };
  error?: {
    error?: {
      code?: string | number;
    };
    body?: string;
  };
}

/**
 * Metamask error
 */
export const isJsonRpcError = (error: unknown): error is JsonRpcError => {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    'code' in error &&
    !('error' in error)
  );
};

export const isEtherCallError = (error: unknown): error is EthersError => {
  return typeof error === 'object' && error !== null && 'error' in error && 'transaction' in error;
};

export const ErrorCode: Record<string, string> = {
  '20001': 'params is invalid',
  '20002': 'transaction field is invalid',
  '25003': 'gas asset is invalid',
  '25004': 'transaction type is invalid',
  '25005': 'too many pending txs',
  '29404': 'is not exist',
  '29500': 'server error',
};
