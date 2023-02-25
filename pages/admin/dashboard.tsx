import { ActionIcon, AppShell, Flex, Header, Text, Box } from '@mantine/core'
import { IconUsers, IconDeviceMobile, IconDeviceMobileVibration } from '@tabler/icons-react'
import React from 'react'

const size = 34

const dashboard = () => {

  const list = [
    {
      name: 'Devices',
      icon: <IconDeviceMobile size={size} />,
    },
    {
      name: 'Customers',
      icon: <IconUsers size={size} />,
    },
    {
      name: 'Repair',
      icon: <IconDeviceMobileVibration size={size} />,
    }
  ]

  return (
    <AppShell
      padding="md"
      // header={
      //   <Header height={80} px="xs">

      //   </Header>
      // }
      footer={
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          height: 80,
          width: '100%',
          boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
          borderTop: '1px solid #E5E5E5',
        }}

        >
          <Flex justify="space-evenly" align="center"  >
            {list.map((data, index) => <Box py={5} key={index}>
              <ActionIcon
                variant="outline"
                size="xl"
                color="teal"
              >
                {data.icon}
              </ActionIcon>
              <Text c="dimmed" fz="sm" fs='italic'> {data.name} </Text>
            </Box>)}
          </Flex>
        </Box>
      }
    >
      <h1>Dashboard</h1>
    </AppShell>
  )
}

export default dashboard