/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { Box, Text, TextInput, Button, Flex } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBrand } from '../../../endpoints/brand'
import { IBrand } from '../../../constants/types'
import { reactQueryKey } from '../../../constants/constant'

interface IProps {
  onSuccess?: () => void
  onClose?: () => void
}

const NewBrand = ({ onClose, onSuccess }:IProps) => {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) => {
        if (!value) return 'Name is required'
      }
    }
  })

  const { isError, isLoading, isSuccess, mutateAsync, error } = useMutation((data: IBrand) => createBrand(data), {
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [reactQueryKey.brands]
      })
    },
  })

  const onSubmit = (values: { name: string }) => {
    mutateAsync(values)
  }

  useEffect(() => {
    if (isSuccess) {
      form.reset()
      onSuccess && onSuccess()
    }
  }, [isSuccess])

  useEffect(() => {
    // @ts-ignore
    if (isError && error?.message === 'Brand already exists') {
      form.setFieldError('name', 'Brand already exists')
    }
  }, [isError])

  const handleClose = useCallback(() => {
    onClose && onClose()
  }, [])

  return (
    <Box>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Box mb='md'>
          <TextInput required label='Name' placeholder='Name' {...form.getInputProps('name')} />
        </Box>
        <Flex mt='md' justify='center' direction='row' gap='md'>
          <Button type='submit' loading={isLoading} size='lg' fullWidth>
            Create
          </Button>
          <Button type='reset' onClick={handleClose} loading={isLoading} variant='outline' size='lg' fullWidth>
            Reset
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default NewBrand
