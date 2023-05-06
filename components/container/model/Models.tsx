import React, { useMemo, useState } from 'react'
import { Box, Button, Flex, Grid, Modal, Stack, Text, TextInput, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { reactQueryKey, sizes } from '../../../constants/constant'
import { getModels } from '../../../endpoints/model'
import { useDisclosure } from '@mantine/hooks'
import NewModel from './NewModel'
import { IconSearch } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'

function Models() {
  const { isLoading, data, isError, error } = useQuery({ queryKey: [reactQueryKey.models], queryFn: async () => await getModels() })


  const [query, setQuery] = useState('');
  const [addModalOpen, dispatchAddModal] = useDisclosure(false);

  const records = useMemo(() => {
    const tunedData = data?.data?.map((model: any) => ({
      id: model._id,
      name: model.name,
      brand: model.brand.name,
    }))

    if (!tunedData) return [];
    if (!query) return tunedData;

    return tunedData?.filter((record: any) => {
      return Object.keys(record).some((key) => {
        return String(record[key]).toLowerCase().includes(query.toLowerCase());
      });
    });
  }, [data, query])

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
      accessor: 'brand'
    },
    {
      //action
      accessor: 'id',
      render: (record: any) => (
        <Flex>
          <Button onClick={() => handleDelete(record.id)} variant='outline' size='xs' color='red'>Delete</Button>
        </Flex>
      )
    }
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <Box p='sm'>
      <Modal opened={addModalOpen} onClose={dispatchAddModal.close} title={
        <Title fz={20}>Create new model</Title>
      } >
        <NewModel callBack={dispatchAddModal.close} />
      </Modal>
      <Text fz='lg' fw='bold'>
        Models
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
              <Button onClick={dispatchAddModal.open} fullWidth variant='filled'>Add new Model</Button>
            </Grid.Col>
          </Grid>
        </Stack>
        <DataTable
          columns={columns}
          records={records}
          striped
          highlightOnHover
          minHeight={sizes.MIN_TABLE_HEIGHT}
        />
      </Box>
    </Box>
  )
}

export default Models
