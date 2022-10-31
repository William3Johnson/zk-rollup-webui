import { createStandaloneToast } from '@chakra-ui/react';
import { ethers, utils } from 'ethers';
import { zkbasClient } from '../config/zkbasClient';
const SEEDS_STORAGE_KEY = '@nodereal/SEEDS';

// 23000 ms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerUser = async (signer: any, contract: any, name: string, address: string) => {
  if (!name || name.length === 0) return;
  const { toast } = createStandaloneToast();

  const seed = await getSeed(signer);
  const { x, y } = await getPublicKey(seed);
  const price = await contract.getZNSNamePrice(name);

  let validName = false;
  try {
    validName = await contract.isRegisteredZNSName(name);
  } catch (err) {
    toast({
      title: 'Error',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  if (validName) {
    toast({
      title: 'Error',
      description: 'name had registered',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  let registerResult = null;
  try {
    registerResult = await contract.registerZNS(name, address, x, y, {
      value: price,
    });

    await registerResult.wait();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // console.log(err);
    toast({
      title: 'Error',
      status: 'error',
      description: err?.message,
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  return registerResult;
};

// Whether it has been registered
// true: registered
// false: not register
export const getL2UserInfo = async () => {
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  const ethWallet = ethersProvider.getSigner();
  const seed = await getSeed(ethWallet);

  const { compressedPublicKey } = await getPublicKey(seed);

  try {
    const res = await zkbasClient.getAccountByPubKey(compressedPublicKey);
    return res;
  } catch (err) {
    // ...
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSeedKey = async (ethSigner: any) => {
  // console.log(ethSigner);
  // console.log(ethSigner.provider);
  const network = await ethSigner.provider.getNetwork();
  // const network = ethSigner.network;
  const chainId = network.chainId;
  const address = await ethSigner.getAddress();
  // console.log(chainId);
  // console.log(address);
  // console.log('getSeedKey', `${network.chainId}-${address}`);
  return `${chainId}-${address}`;
};

const getSeeds = () => {
  try {
    return JSON.parse(window.localStorage.getItem(SEEDS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateSeed = async (ethSigner: any) => {
  let chainID = 1;
  if (ethSigner && ethSigner.provider) {
    const network = await ethSigner.provider.getNetwork();
    chainID = network.chainId;
  }
  let message = 'Access zkbas account.\n\nOnly sign this message for a trusted client!';
  if (chainID !== 1) {
    message += `\nChain ID: ${chainID}.`;
  }

  const signedBytes = getSignedBytesFromMessage(message, false);
  const signature = await signMessagePersonalAPI(ethSigner, signedBytes);
  const seed = utils.arrayify(signature);
  return { seed };
};

const signMessagePersonalAPI = async (
  signer: ethers.Signer,
  message: Uint8Array,
): Promise<string> => {
  if (!signer) return '';

  if (signer instanceof ethers.providers.JsonRpcSigner) {
    return signer.provider
      .send('personal_sign', [utils.hexlify(message), await signer.getAddress()])
      .then(
        (sign) => sign,
        (err) => {
          // We check for method name in the error string because error messages about invalid method name
          // often contain method name.
          if (err.message.includes('personal_sign')) {
            // If no "personal_sign", use "eth_sign"
            return signer.signMessage(message);
          }
          throw err;
        },
      );
  } else {
    return signer.signMessage(message);
  }
};

const getSignedBytesFromMessage = (
  message: utils.BytesLike | string,
  addPrefix: boolean,
): Uint8Array => {
  let messageBytes =
    typeof message === 'string' ? utils.toUtf8Bytes(message) : utils.arrayify(message);
  if (addPrefix) {
    messageBytes = utils.concat([
      utils.toUtf8Bytes(`\x19Ethereum Signed Message:\n${messageBytes.length}`),
      messageBytes,
    ]);
  }
  return messageBytes;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSeed = async (signer: any) => {
  const seedKey = await getSeedKey(signer);
  const seeds = getSeeds();
  if (!seeds[seedKey]) {
    seeds[seedKey] = await generateSeed(signer);
    seeds[seedKey].seed = seeds[seedKey].seed
      .toString()
      .split(',')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((x: any) => +x);

    // todo open storage save
    localStorage.setItem(SEEDS_STORAGE_KEY, JSON.stringify(seeds));
  }

  seeds[seedKey].seed = Uint8Array.from(seeds[seedKey].seed);
  return seeds[seedKey].seed;
};

// function toHexString(byteArray: any) {
//   return Array.prototype.map
//     .call(byteArray, function (byte) {
//       return ('0' + (byte & 0xff).toString(16)).slice(-2);
//     })
//     .join('');
// }
// function toByteArray(hexString: any) {
//   const result = [];
//   for (let i = 0; i < hexString.length; i += 2) {
//     result.push(parseInt(hexString.substr(i, 2), 16));
//   }
//   return result;
// }

// const hexString = toHexString(byteArray);
// const byteArray = toByteArray(hexString);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPublicKey = async (seed: any) => {
  const { ZkCrypto } = await import('@bnb-chain/zkbas-js-sdk/zkCrypto/web');
  const Z = await ZkCrypto();

  // eslint-disable-next-line no-console
  // console.log('seed needed to generate public key', seed);
  // console.log('hex', toHexString(seed));
  const seedString = new TextDecoder().decode(seed);

  // eslint-disable-next-line no-console
  // console.log('seed in string format', seed);
  const publicKey = Z.getEddsaPublicKey(seedString);
  const compressedPublicKey = Z.getEddsaCompressedPublicKey(seedString);

  // eslint-disable-next-line no-console
  // console.log('public key', publicKey);
  // eslint-disable-next-line no-console
  // console.log('compress public key', compressedPublicKey);

  const x = `0x${publicKey.slice(0, 64)}`;
  const y = `0x${publicKey.slice(64)}`;

  // eslint-disable-next-line no-console
  // console.log('x', x);
  // eslint-disable-next-line no-console
  // console.log('y', y);

  return {
    publicKey,
    compressedPublicKey,
    x,
    y,
  };
};

export const getAccountNameHash = async (accountName: string) => {
  const { ZkCrypto } = await import('@bnb-chain/zkbas-js-sdk/zkCrypto/web');
  const Z = await ZkCrypto();
  const accountNameHash = Z.getAccountNameHash(accountName);
  return accountNameHash;
};
