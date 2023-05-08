import React, { useMemo, useState } from 'react'
import { Box, Button, Flex, Grid, Modal, Stack, Text, TextInput, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { reactQueryKey, sizes } from '../../../constants/constant'
import { DataTable } from 'mantine-datatable'
import { useDisclosure } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import NewCustomer from './NewCustomer'
import { getCustomers } from '../../../endpoints/customers'

const Customers = () => {
  const { isLoading, data, isError, error } = useQuery({ queryKey: [reactQueryKey.customers], queryFn: async () => await getCustomers() })

  const [query, setQuery] = useState('');
  const [addModalOpen, dispatchAddModal] = useDisclosure(false);

  const handleDelete = (id: string) => {
    console.log(id)
  }

  const columns = [
    {
      accessor: 'id',
    },
    {
      accessor: 'name'
    },
    {
      accessor: 'phone'
    },
    {
      //action
      accessor: 'id',
      title:'Action',
      render: (record: any) => (
        <Flex>
          <Button onClick={() => handleDelete(record.id)} variant='outline' size='xs' color='red'>Delete</Button>
        </Flex>

      )
    }
  ]

  const records = useMemo(() => {
    const tunedData = data?.data?.map((customer: any) => ({
      id: customer._id,
      name: customer.name,
      phone: customer.phone
    }))

    if (!tunedData) return [];
    if (!query || query === "") return tunedData;

    return tunedData?.filter((record: any) => {
      return Object.keys(record).some((key) => {
        return String(record[key]).toLowerCase().includes(query.toLowerCase());
      });
    });
  }, [data, query])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <Box p='sm'>
      <Modal opened={addModalOpen} onClose={dispatchAddModal.close} title={
        <Title fz={20}>Create new brand</Title>
      }>
        <NewCustomer
          onSuccess={() => { dispatchAddModal.close() }}
          onClose={() => { dispatchAddModal.close() }}
        />
      </Modal>
      <Text fz='lg' fw='bold'>
        Customers
      </Text>
      <Box mt='md'>
        <Stack>
          <Grid>
            <Grid.Col md={8} sm={12}>
              <TextInput
                sx={{ flexBasis: '70%' }}
                placeholder="Search..."
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                icon={<IconSearch size={16} />}
              />
            </Grid.Col>
            <Grid.Col md={4} sm={12}>
              <Button onClick={dispatchAddModal.open} fullWidth variant='filled'>Add new customer</Button>
            </Grid.Col>
          </Grid>
          <DataTable
            columns={columns}
            records={records}
            striped
            highlightOnHover
            minHeight={sizes.MIN_TABLE_HEIGHT}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default Customers
