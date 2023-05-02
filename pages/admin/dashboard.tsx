import React, { useMemo, useState } from 'react'
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ActionIcon, AppShell, Flex, Text, Box, Skeleton, Card, Title, Grid, Group, TextInput, Button, Stack, Collapse } from '@mantine/core'
import { IconUsers, IconDeviceMobile, IconDeviceMobileVibration, IconSearch, IconCaretDown, IconCaretUp } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable';

import { reactQueryKey, sizes } from '../../constants/constant';
import NewRepairer from '../../components/container/repairer/NewRepairer';
import { useQuery } from '@tanstack/react-query';
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
      <RepairerTable />
    </AppShell>
  )
}

export default Dashboard

function RepairerTable() {
  const { isLoading, data, isError, error } = useQuery({ queryKey: [reactQueryKey.repairers], queryFn:getRepairers, refetchInterval : 1000 })

  const [isNewRepairerOpen, setIsNewRepairerOpen] = useState(false)
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [opened, { toggle }] = useDisclosure(false);

  const records = useMemo(() => {
    const tunedData = data?.repairers?.map((repairer: any) => ({
      device: repairer.device?.name,
      customer: repairer.customer?.phone + ' ' + (repairer.customer?.name ? repairer.customer.name : ''),
      problem: repairer.problem,
      status: repairer.status
    }))

    if (!debouncedQuery) return tunedData;

    return tunedData?.filter((record: any) => {
      return Object.keys(record).some((key) => {
        return String(record[key]).toLowerCase().includes(debouncedQuery.toLowerCase());
      });
    });
  }, [data, debouncedQuery])


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

  if (isLoading) return <Skeleton height={loadingSize} />

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder p='lg'>
      <Stack>
        <Grid align="center">
          <Grid.Col span={6}>
            <Title order={3} mb={5}>Repairers</Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position='right'>
              <Flex direction='row' gap='md' sx={{ flexBasis: '100%' }} >
                <TextInput
                  sx={{ flexBasis: '70%' }}
                  placeholder="Search..."
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  icon={<IconSearch size={16} />}
                />
                <Button variant="filled" sx={{ flexBasis: '30%' }}
                  leftIcon={
                    isNewRepairerOpen ? <IconCaretUp size={16} /> : <IconCaretDown size={16} />
                  }
                  onClick={() => {
                    setIsNewRepairerOpen((prev) => !prev)
                    toggle()
                  }}
                >
                  {isNewRepairerOpen ? 'Close' : 'New'}
                </Button>
              </Flex>
            </Group>
          </Grid.Col>
        </Grid>
        <Collapse in={opened}>
          <Card withBorder >
            <NewRepairer />
          </Card>
        </Collapse>
        <DataTable
          minHeight={loadingSize}
          columns={columns}
          records={records}
          striped
          highlightOnHover
          key={
            records?.map((record: any) => record.device + record.customer + record.problem + record.status).join('')
          }
        />
      </Stack>
    </Card>
  )
}