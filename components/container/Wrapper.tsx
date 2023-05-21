import React, { useCallback } from 'react'
import { IconUsers, IconDeviceMobile, IconDeviceMobileVibration, IconSettings } from '@tabler/icons-react'

import { sizes } from '../../constants/constant'
import { ActionIcon, AppShell, Box, Flex, Text } from '@mantine/core'
import { useRouter } from 'next/router'

const size = sizes.FOOTER_ICON_SIZE
const list = [
  {
    name: 'Repairers',
    icon: <IconDeviceMobile size={size} />,
    path: '/admin/dashboard'
  },
  {
    name: 'Customers',
    icon: <IconUsers size={size} />,
    path: '/admin/customers'
  },
  {
    name: 'devices',
    icon: <IconDeviceMobileVibration size={size} />,
    path: '/admin/devices'
  },
  {
    name: 'Settings',
    icon: <IconSettings size={size} />,
    path: '/admin/settings'
  },
]


export default function Wrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const handleClick = useCallback((pathParam: string) => {
    router.push(pathParam)
  }, [router])

  console.log(router.pathname)

  const isIndexPage = router.pathname === '/'

  return <AppShell
    footer={
      !isIndexPage ? <Box sx={{
        position: 'fixed',
        bottom: 0,
        height: 80,
        width: '100%',
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
        borderTop: '1px solid #E5E5E5',
        zIndex: 1,
        backgroundColor: 'white'
      }}
      >
        <Flex justify="space-evenly" align="center"  >
          {list.map((data, index) => <Box py={5} key={index}>
            <ActionIcon
              variant="outline"
              size="xl"
              color="teal"
              onClick={() => handleClick(data.path)}
            >
              {data.icon}
            </ActionIcon>
            <Text c="dimmed" fz="xs" fs='italic'> {data.name} </Text>
          </Box>)}
        </Flex>
      </Box>
      : <></>
    }
  >
    {children}
  </AppShell>
}
