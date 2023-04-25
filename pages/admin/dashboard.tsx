import React, { useMemo } from 'react'
import { useMediaQuery } from '@mantine/hooks';
import { ActionIcon, AppShell, Flex, Header, Text, Box, Skeleton } from '@mantine/core'
import { IconUsers, IconDeviceMobile, IconDeviceMobileVibration } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable';

import { reactQueryKey, sizes } from '../../constants/constant';
import NewRepairer from '../../components/container/repairer/NewRepairer';
import NewModel from '../../components/container/model/NewModel';
import { useQuery } from 'react-query';
import { getRepairers } from '../../endpoints/repairer';

const size = sizes.FOOTER_ICON_SIZE
const loadingSize = 300

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
      <RepairerTable/>
    </AppShell>
  )
}

export default Dashboard

function RepairerTable() {
  const { isLoading, data, isError, error }  = useQuery(reactQueryKey.repairers, async () => getRepairers())

  const records = useMemo(() => {
    return data?.repairers?.map((repairer:any) => ({
      device: repairer.device?.name ,
      customer: repairer.customer?.phone + ' ' + (repairer.customer.name ? repairer.customer.name : ''),
      problem: repairer.problem,
      status: repairer.status
    }))
  }, [data])


  const columns = [
    {
      accessor: 'device',
    },
    {
      accessor: 'customer'
    },
    {
      accessor: 'problem'
    },
    {
      accessor: 'status'
    }
  ] 

  if(isLoading) return <Skeleton height={loadingSize} />

  return <DataTable 
    columns={columns} 
    records={records}
    striped
    highlightOnHover 
    key={
      records?.map((record:any) => record.device + record.customer + record.problem + record.status).join('')
    }
  />

}