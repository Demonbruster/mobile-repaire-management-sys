/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { Box, Button, Flex, Group, Select, Text, TextInput } from '@mantine/core'
import { useMutation, useQuery } from 'react-query'
import { IconChevronDown } from '@tabler/icons-react'

import { ICustomer_FE, createCustomer, getCustomers } from '../../../endpoints/customers'
import { reactQueryKey } from '../../../constants/constant'
import { getDevices } from '../../../endpoints/device'
import { IRepairer_FE, createRepairer } from '../../../endpoints/repairer'
import queryClient from '../../../utils/queryClinet'
import DatePickerModal from '../../common/DatePickerModal/DatePickerModal'
import showNotification from '../../../utils/notifications'
import { modals } from '@mantine/modals'
import NewDevice from '../NewDevice'

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
    validate: {
      expectedDeliveryDate: (value) => {
        if (!value) return 'Expected Delivery Date is required'
        // it can not be less than entry date
        const entryDateToTotalSecs = form.values.entryDate.getTime() / 1000
        const expectedDeliveryDateToTotalSecs = value.getTime() / 1000

        if (entryDateToTotalSecs > expectedDeliveryDateToTotalSecs) return 'Expected Delivery Date can not be less than Entry Date'
      },
    },
    validateInputOnChange: ['expectedDeliveryDate']
  })

  const customerModal = (value: string) => modals.open({
    title: 'Create Customer',
    children: (
      <CustomerModalChild value={value} onSubmit={onCustomerSubmit} />
    ),
  })

  const deviceModal = (value: string) => modals.open({
    title: 'Create Device',
    children: (
      <DeviceModalChild value={value}   />
    ),
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
      label: customer.phone + ' - ' + customer.name,
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

  useEffect(() => {
    if (customerMutation.isSuccess) {
      showNotification({
        title: 'Success',
        message: 'Customer created successfully',
        type: 'success'
      })
      modals.closeAll();
      form.setFieldValue('customer', customerMutation.data.data._id)
    }
  }, [customerMutation.isSuccess])

  useEffect(() => {
    if (repairerMutation.isSuccess) {
      showNotification({
        title: 'Success',
        message: 'Repairer created successfully',
        type: 'success'
      })
      form.reset()
    }
  }, [repairerMutation.isSuccess])

  useEffect(() => {
    if (repairerMutation.isError) {
      showNotification({
        title: 'Error',
        message: 'Repairer creation failed',
        type: 'error'
      })
    }
  }, [repairerMutation.isError])

  const CustomerModalChild = ({ value, onSubmit }: { value: string; onSubmit: (values: ICustomer_FE) => void }) => {
    const [customerValue, setCustomerValue] = useState<string>(value)

    return (
      <Flex justify='center' align='center' gap='sm'>
        <TextInput label='Phone' placeholder='Phone' value={customerValue} onChange={(e) => {
          setCustomerValue(e.currentTarget.value)
        }} />
        <Button mt='xl' loading={
          customerMutation.isLoading
        } onClick={() => {
          onSubmit({
            phone: customerValue,
          })
        }}>+</Button>
      </Flex>
    )
  }

  const DeviceModalChild = ({ value }: { value: string }) => {
    return <NewDevice name={value} callBack={() => {modals.closeAll()}} />
  }

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
            onCreate={(value) => {
              // open Create customer modal with value
              customerModal(value);
              return value
            }}
          />

          <Select
            searchable
            creatable
            nothingFound="No options"
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30}
            label='Device'
            placeholder='Device'
            {...form.getInputProps('device')}
            data={listOfDevices}
            getCreateLabel={(value) => `+ device: ${value}`}
            onCreate={(value) => {
              // open Create device modal with value
              deviceModal(value);
              return value;
            }}
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

          <DatePickerModal onChange={
            (date) => {
              form.setFieldValue('entryDate', date)
            }
          }
            placeholder='Select Date'
            label='Entry date'
            value={form.values.entryDate}
            error={form.errors.entryDate}
          />

          <DatePickerModal
            onChange={
              (date) => {
                form.setFieldValue('expectedDeliveryDate', date)
              }
            }
            placeholder='Select Date'
            label='Expected delivery date'
            value={form.values.expectedDeliveryDate}
            error={form.errors.expectedDeliveryDate}
          />
          <Group position='center'>
            <Button type='submit' loading={repairerMutation.isLoading} size='lg' fullWidth>
              Create
            </Button>
            <Button type='reset' loading={repairerMutation.isLoading} variant='outline' size='lg' fullWidth>
              Reset
            </Button>
          </Group>

        </Flex>
      </form>

    </Box>
  )
}
