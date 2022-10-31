/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { Chain, chain, configureChains, createClient, defaultChains } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { BNBChainId, BNBNet } from '../common/constants';

const bscChain: Chain = {
  id: BNBChainId,
  name: 'Binance Chain',
  network: 'bsc testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain',
    symbol: 'TBNB',
  },
  rpcUrls: {
    default: BNBNet,
  },
  blockExplorers: {
    default: { name: '', url: 'https://testnet.bscscan.com/' },
  },
  testnet: true,
};

export const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, bscChain],
  // defaultChains,
  [
    // alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
    // jsonRpcProvider({
    //   rpc: (chain) => {
    //     if (chain.id !== bscChain.id) return null;
    //     return { http: chain.rpcUrls.default };
    //   },
    // }),
  ],
);

// const { connectors } = getDefaultWallets({
//   appName: 'My RainbowKit App',
//   chains,
// });

export const metaMaskConnctor = new MetaMaskConnector({ chains });

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    metaMaskConnctor,
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     qrcode: true,
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  provider,
  webSocketProvider,
});
