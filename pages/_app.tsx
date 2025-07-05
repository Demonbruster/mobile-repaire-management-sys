import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import Wrapper from '../components/container/Wrapper';

const theme: MantineThemeOverride = {
  colorScheme: 'light',
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 700,
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: 1.2 },
      h2: { fontSize: '2rem', lineHeight: 1.3 },
      h3: { fontSize: '1.5rem', lineHeight: 1.4 },
    },
  },
  colors: {
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
      '#145591'
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f4',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#6c757d',
      '#495057',
      '#343a40',
      '#212529'
    ],
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    Card: {
      styles: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    Paper: {
      styles: {
        root: {
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            borderColor: '#228be6',
            boxShadow: '0 0 0 2px rgba(34, 139, 230, 0.1)',
          },
        },
      },
    },
    Select: {
      styles: {
        input: {
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            borderColor: '#228be6',
            boxShadow: '0 0 0 2px rgba(34, 139, 230, 0.1)',
          },
        },
      },
    },
    DataTable: {
      styles: {
        root: {
          '& .mantine-DataTable-row:hover': {
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
          },
        },
      },
    },
  },
  globalStyles: (theme) => ({
    body: {
      backgroundColor: theme.colors.gray[0],
      color: theme.colors.gray[9],
    },
    '*': {
      boxSizing: 'border-box',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
  }),
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
        <ModalsProvider>
          <Notifications position="top-right" limit={5} />
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
