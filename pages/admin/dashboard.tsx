import React from 'react'
import { useMediaQuery } from '@mantine/hooks';
import { ActionIcon, AppShell, Flex, Header, Text, Box } from '@mantine/core'
import { IconUsers, IconDeviceMobile, IconDeviceMobileVibration } from '@tabler/icons-react'
import { sizes } from '../../constants/constant';
import DataTable from '../../components/container/DataTable';
import NewRepairer from '../../components/container/repairer/NewRepairer';

const size = sizes.FOOTER_ICON_SIZE

const Dashboard = () => {
  const isMobile = useMediaQuery('(max-width: 600px)')

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
      footer={
        isMobile ?
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
              <Text c="dimmed" fz="xs" fs='italic'> {data.name} </Text>
            </Box>)}
          </Flex>
        </Box> : <></>
      }
    >
      <NewRepairer/>
      <hr />
      <DataTable/>
    </AppShell>
  )
}

export default Dashboard