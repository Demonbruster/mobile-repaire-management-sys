/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ICustomer_FE, createCustomer } from '../../../endpoints/customers'
import { reactQueryKey } from '../../../constants/constant'
import { useForm } from '@mantine/form'
import { Box, Button, Flex, TextInput } from '@mantine/core'
import showNotification from '../../../utils/notifications'

interface IProps {
  onSuccess?: () => void
  onClose?: () => void
}

function NewCustomer({ onSuccess, onClose }: IProps) {
  const queryClient = useQueryClient()
  const customerMutation = useMutation(async (value: ICustomer_FE) => await createCustomer(value), {
    onSuccess() {
      return queryClient.invalidateQueries({ queryKey: [reactQueryKey.customers] })
    },
  })

  const handleOnSubmit = useCallback(async (values: ICustomer_FE) => {
    return customerMutation.mutateAsync(values)
  }, [])

  const form = useForm({
    initialValues: {
      phone: '',
      name: '',
    },
    validate: {
      phone: (value) => {
        if (!value) return 'Phone is required'
      }
    }
  })

  useEffect(() => {
    if (customerMutation.isSuccess) {
      showNotification({
        title: 'Success',
        message: 'Customer created successfully',
        type: 'success'
      })
      form.reset()
      onSuccess && onSuccess()
    }
  }, [customerMutation.isSuccess])

  useEffect(() => {
    if (customerMutation.isError) {
      showNotification({
        title: 'Error',
        // @ts-ignore
        message: customerMutation.error?.message || 'Something went wrong',
        type: 'error'
      })
    }
  }, [customerMutation.isError])

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleOnSubmit)}>
        <Box mb='md'>
          <TextInput label='Name' placeholder='Name'  {...form.getInputProps('name')} />
          <TextInput label='Phone' placeholder='Phone' withAsterisk  {...form.getInputProps('phone')} />
        </Box>
        <Flex mt='md' justify='center' direction='row' gap='md'>
          <Button mt='xl' loading={customerMutation.isLoading} type='submit'>Create</Button>
        </Flex>
      </form>
    </Box>
  )
}

export default NewCustomer