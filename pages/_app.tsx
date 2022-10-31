import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';
import NiceModal from '@ebay/nice-modal-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { customTheme } from 'config/theme';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { queryClient } from 'config/reactQueryClient';
import { WagmiConfig } from 'wagmi';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { wagmiClient } from '../config/wagmiClient';

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RecoilRoot>
        <ChakraProvider theme={customTheme}>
          <NiceModal.Provider>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <ToastContainer />

              {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </QueryClientProvider>
          </NiceModal.Provider>
        </ChakraProvider>
      </RecoilRoot>
    </WagmiConfig>
  );
}

export default MyApp;
