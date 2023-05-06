import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import Wrapper from '../components/container/Wrapper';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <ModalsProvider >
          <Notifications />
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
