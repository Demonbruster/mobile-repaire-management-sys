/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ICustomer_FE, createCustomer, updateCustomer } from '../../../endpoints/customers'
import { reactQueryKey } from '../../../constants/constant'
import { useForm } from '@mantine/form'
import { 
  Box, 
  Button, 
  Flex, 
  TextInput, 
  Stack,
  Text,
  Group,
  Alert,
  Divider
} from '@mantine/core'
import { 
  IconUser, 
  IconPhone, 
  IconAlertCircle,
  IconCheck 
} from '@tabler/icons-react'
import showNotification from '../../../utils/notifications'

interface IProps {
  onSuccess?: () => void
  onClose?: () => void
  initialValues?: {
    id?: string
    name?: string
    phone: string
  }
  isEdit?: boolean
  customerId?: string
}

function NewCustomer({ onSuccess, onClose, initialValues, isEdit = false, customerId }: IProps) {
  const queryClient = useQueryClient()
  
  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.customers] })
      showNotification({
        title: 'Success',
        message: 'Customer created successfully',
        type: 'success'
      })
      form.reset()
      onSuccess && onSuccess()
    },
    onError: (error: any) => {
      showNotification({
        title: 'Error',
        message: (error as any)?.message || 'Failed to create customer',
        type: 'error'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICustomer_FE }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.customers] })
      showNotification({
        title: 'Success',
        message: 'Customer updated successfully',
        type: 'success'
      })
      onSuccess && onSuccess()
    },
    onError: (error: any) => {
      showNotification({
        title: 'Error',
        message: (error as any)?.message || 'Failed to update customer',
        type: 'error'
      })
    }
  })

  const handleOnSubmit = useCallback(async (values: ICustomer_FE) => {
    if (isEdit && customerId) {
      return updateMutation.mutateAsync({ id: customerId, data: values })
    } else {
      return createMutation.mutateAsync(values)
    }
  }, [isEdit, customerId, createMutation, updateMutation])

  const form = useForm({
    initialValues: {
      phone: initialValues?.phone || '',
      name: initialValues?.name || '',
    },
    validate: {
      phone: (value) => {
        if (!value) return 'Phone number is required'
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
        if (value.length < 10) return 'Phone number must be at least 10 digits'
      },
      name: (value) => {
        if (value && value.length < 2) return 'Name must be at least 2 characters'
      }
    },
    transformValues: (values) => ({
      ...values,
      phone: values.phone.trim(),
      name: values.name?.trim() || undefined
    })
  })

  const isLoading = createMutation.isLoading || updateMutation.isLoading

  return (
    <Box>
      <Stack spacing="md">
        <Box>
          <Text size="sm" color="dimmed" mb="xs">
            {isEdit ? 'Update customer information' : 'Enter customer details to create a new record'}
          </Text>
          <Divider />
        </Box>

        <form onSubmit={form.onSubmit(handleOnSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="Customer Name"
              placeholder="Enter customer name (optional)"
              icon={<IconUser size="1rem" />}
              {...form.getInputProps('name')}
              radius="md"
              size="md"
            />

            <TextInput
              label="Phone Number"
              placeholder="Enter phone number"
              icon={<IconPhone size="1rem" />}
              {...form.getInputProps('phone')}
              withAsterisk
              radius="md"
              size="md"
              description="Phone number is required and will be used as the primary contact method"
            />

            {(createMutation.isError || updateMutation.isError) && (
              <Alert 
                icon={<IconAlertCircle size="1rem" />} 
                title="Error" 
                color="red"
                variant="light"
                radius="md"
              >
                {(createMutation.error as any)?.message || (updateMutation.error as any)?.message || 'Something went wrong'}
              </Alert>
            )}

            <Group position="apart" mt="xl">
              <Button
                variant="subtle"
                color="gray"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                leftIcon={<IconCheck size="1rem" />}
                gradient={{ from: 'blue', to: 'cyan' }}
                variant="gradient"
              >
                {isEdit ? 'Update Customer' : 'Create Customer'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}

export default NewCustomer