import React, { useMemo, useState } from 'react'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { Flex, Skeleton, Card, Title, Grid, Group, TextInput, Button, Stack, Collapse } from '@mantine/core'
import { IconSearch, IconCaretDown, IconCaretUp } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable';
import { useQuery } from '@tanstack/react-query';

import { reactQueryKey } from '../../constants/constant';
import NewRepairer from '../../components/container/repairer/NewRepairer';
import { getRepairers } from '../../endpoints/repairer';
import { useRouter } from 'next/router';

const loadingSize = 300

const Dashboard = () => {
  return <RepairerTable/>
}

export default Dashboard;

function RepairerTable() {
  const router = useRouter()
  
  const { isLoading, data, isError, error } = useQuery({ 
    queryKey: [reactQueryKey.repairers], 
    queryFn:getRepairers, 
    // refetchInterval : 1000
   })

  const [isNewRepairerOpen, setIsNewRepairerOpen] = useState(false)
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [opened, { toggle }] = useDisclosure(false);

  const records = useMemo(() => {
    const tunedData = data?.repairers?.map((repairer: any) => ({
      device: repairer.device?.name,
      customer: repairer.customer?.phone + ' ' + (repairer.customer?.name ? repairer.customer.name : ''),
      problem: repairer.problem,
      status: repairer.status,
      id: repairer._id
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
          onRowClick={( data: {id : string}, rowIndex, event ) => {
            router.push(`/admin/repairer/${data.id}`)
          }}
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