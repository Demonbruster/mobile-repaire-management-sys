import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import type { AppProps } from 'next/app'
import { QueryClientProvider } from 'react-query'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import queryClient from '../utils/queryClinet';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <ModalsProvider >
          <Notifications />
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
