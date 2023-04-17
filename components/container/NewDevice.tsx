import React, { useEffect, useMemo } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Box, Text, TextInput, Select, Flex, Button } from '@mantine/core'
import { useForm } from '@mantine/form';

import { reactQueryKey } from '../../constants/constant'
import { getModels } from '../../endpoints/model';
import { createDevice, IDevice_FE } from '../../endpoints/device';
import queryClient from '../../utils/queryClinet';
import showNotification from '../../utils/notifications';
import { IconChevronDown } from '@tabler/icons-react';
import { getCustomers } from '../../endpoints/customers';

interface IProps {
  name?: string
  callBack?: () => void
}

function NewDevice({ name = '', callBack = () => {} }: IProps) {

  const modelQuery = useQuery(reactQueryKey.models, async () => getModels())
  const ownerQuery = useQuery(reactQueryKey.customers, async () => getCustomers())
  const deviceMutation = useMutation((value: IDevice_FE) => createDevice(value), {
    onSuccess() {
      queryClient.invalidateQueries([reactQueryKey.devices, reactQueryKey.customers])
    },
  })

  const form = useForm({
    initialValues: {
      name,
      model: '',
      imei: '',
      color: '',
      owner: '',
    },
  })

  const listOfModal = useMemo(() => {
    return modelQuery.data && modelQuery.data.data?.map((model: any, index: number) => ({ label: model.name, value: model._id, key: index })) || []
  }, [modelQuery.data])

  const listOfOwner = useMemo(() => {
    return ownerQuery.data && ownerQuery.data.data?.map((owner: any, index: number) => ({ label: owner.name, value: owner._id, key: index })) || []
  }, [ownerQuery.data])

  useEffect(() => {
    if (deviceMutation.isSuccess) {
      form.reset()
      showNotification({
        title: 'Created',
        message: 'Device created successfully.',
        type: 'success',
      })
      callBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceMutation.isSuccess])

  useEffect(() => {
    if (deviceMutation.isError) {
      showNotification({
        title: 'Error',
        message: 'Something went wrong',
        type: 'error',
      })
    }
  }, [deviceMutation.isError])

  const onSubmit = (values: IDevice_FE) => {
    deviceMutation.mutateAsync(values)
  }

  if (modelQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Box p='sm'>
      <Text fz='lg' fw='bold'> Create new device </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Flex mt='md' direction='column'>
          <TextInput required label='Description' placeholder='Description' {...form.getInputProps('name')} />
          <Select searchable
            nothingFound="No options"
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30} label='Model' placeholder='Model' {...form.getInputProps('model')}
            data={listOfModal} />
          <TextInput label='IMEI' placeholder='IMEI' {...form.getInputProps('imei')} />
          <TextInput label='Color' placeholder='Color' {...form.getInputProps('color')} />
          <Select searchable
            nothingFound="No options"
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30} label='Owner Phone' placeholder='Owner Phone' {...form.getInputProps('owner')}
            data={listOfOwner} />
        </Flex>
        <Flex mt='md' justify='center' direction='row' gap='md'>
          <Button type='submit' loading={deviceMutation.isLoading} size='lg' fullWidth>
            Create
          </Button>
          <Button type='reset' loading={deviceMutation.isLoading} variant='outline' size='lg' fullWidth>
            Reset
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default NewDevice
