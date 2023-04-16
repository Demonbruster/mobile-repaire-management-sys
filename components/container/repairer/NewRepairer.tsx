import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { Box, Flex, Select, Text, TextInput } from '@mantine/core'
import { useMutation, useQuery } from 'react-query'
import { IconChevronDown } from '@tabler/icons-react'
import { DatePicker } from '@mantine/dates';

import { ICustomer_FE, createCustomer, getCustomers } from '../../../endpoints/customers'
import { reactQueryKey } from '../../../constants/constant'
import { getDevices } from '../../../endpoints/device'
import { IRepairer_FE, createRepairer } from '../../../endpoints/repairer'
import queryClient from '../../../utils/queryClinet'
import DatePickerModal from '../../common/DatePickerModal/DatePickerModal'

export default function NewRepairer() {
  const customerQuery = useQuery(reactQueryKey.customers, async () => getCustomers())
  const deviceQuery = useQuery(reactQueryKey.devices, async () => getDevices())

  const repairerMutation = useMutation((value: IRepairer_FE) => createRepairer(value), {
    onSuccess() {
      queryClient.invalidateQueries([reactQueryKey.repairer, reactQueryKey.customers, reactQueryKey.devices])
    },
  })

  const customerMutation = useMutation((value: ICustomer_FE) => createCustomer(value), {
    onSuccess() {
      queryClient.invalidateQueries([reactQueryKey.repairer, reactQueryKey.customers, reactQueryKey.devices])
    },
  })

  const form = useForm({
    initialValues: {
      customer: '',
      device: '',
      charge: '',
      problem: '',
      notes: '',
      entryDate: new Date(),
      expectedDeliveryDate: new Date()
    },
  })

  const onSubmit = useCallback((values: IRepairer_FE) => {
    repairerMutation.mutateAsync(values)
  }, [repairerMutation])

  const onCustomerSubmit = useCallback((values: ICustomer_FE) => {
    customerMutation.mutateAsync(values)
  }, [customerMutation])

  const listOfCustomers = useMemo(() => {
    if (!customerQuery.isSuccess) return []
    return customerQuery.data && customerQuery.data.data?.map((customer: any, index: number) => ({
      label: customer.phone,
      value: customer._id,
      key: index
    })) || []
  }, [customerQuery.data, customerQuery.isSuccess])

  const listOfDevices = useMemo(() => {
    if (!deviceQuery.isSuccess) return []
    return deviceQuery.data && deviceQuery.data.data?.map((device: any, index: number) => ({
      label: device.name,
      value: device._id,
      key: index
    })) || []
  }, [deviceQuery.data, deviceQuery.isSuccess])

  return (
    <Box p='sm'>
      <Text fz='lg' fw='bold'> Create new device </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Flex mt='md' direction='column'>
          <Select
            searchable
            creatable
            nothingFound="No options"
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30}
            label='Customer'
            placeholder='Customer Phone'
            {...form.getInputProps('customer')}
            data={listOfCustomers}
            getCreateLabel={(value) => `+ customer: ${value}`}
          />

          <Select
            searchable
            nothingFound="No options"
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30}
            label='Device'
            placeholder='Device'
            {...form.getInputProps('device')}
            data={listOfDevices}
          />

          <TextInput
            label='Charge'
            placeholder='Charge'
            {...form.getInputProps('charge')}
          />

          <TextInput
            label='Problem'
            placeholder='Problem'
            {...form.getInputProps('problem')}
          />

          <TextInput
            label='Notes'
            placeholder='Notes'
            {...form.getInputProps('notes')}
          />

          {/* <DatePicker
            placeholder='Entry Date'
            {...form.getInputProps('entryDate')}
          /> */}

          <DatePickerModal onChange={
            (date) => {
              form.setFieldValue('entryDate', date)
            }
          }
            placeholder='Select Date'
            label='Entry date'
            value={form.values.entryDate}
          />

          <DatePicker
            placeholder='Expected Delivery Date'
            {...form.getInputProps('expectedDeliveryDate')}
          />

        </Flex>
      </form>


    </Box>
  )
}
