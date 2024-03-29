/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Text, TextInput, Select, Button } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react';

import { getBrands } from '../../../endpoints/brand'
import { createModel, IModel_FE } from '../../../endpoints/model'
import showNotification from '../../../utils/notifications'
import { reactQueryKey } from '../../../constants/constant';

interface IProps {
  callBack?: () => void
  modalName?: string
}

function NewModel({ callBack, modalName }: IProps) {
  const queryClient = useQueryClient()
  const { data, isLoading, error, isError } = useQuery({ queryKey: [reactQueryKey.brands], queryFn: async () => await getBrands() })

  const modelMutation = useMutation(async (value: IModel_FE) => await createModel(value), {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.models] })
    },
  })

  const form = useForm({
    initialValues: {
      name: modalName || '',
      brand: '',
    },
    validate: {
      name: (value) => {
        if (!value || value === '') return 'Name is required'
      },
      brand: (value) => {
        if (!value || value === '') return 'Brand is required'
      }
    }
  })

  useEffect(() => {
    form.setFieldValue('name', modalName || '')
  }, [modalName])

  const HandleOnSubmit = (values: IModel_FE) => {
    modelMutation.mutateAsync(values)
  }

  useEffect(() => {
    if (modelMutation.isSuccess) {
      form.reset()
      showNotification({
        title: 'Created',
        message: 'Model created successfully.',
        type: 'success',
      })
      callBack && callBack()
    }
  }, [modelMutation.isSuccess])


  useEffect(() => {
    if (isError) {
      showNotification({
        title: 'Error',
        // @ts-ignore
        message: error?.message || 'Something went wrong',
        type: 'error',
      })
    }
  }, [isError])

  if (isLoading) return <Box> Loading </Box>

  return (
    <Box p='sm'>
      <form onSubmit={form.onSubmit(HandleOnSubmit)}>
        <Box mb='md'>
          <TextInput required label='Name' placeholder='Name' {...form.getInputProps('name')} />
          <Select required label='Brand' placeholder='Brand' {...form.getInputProps('brand')}
            searchable
            nothingFound="No options"
            rightSection={<IconChevronDown size="1rem" />}
            rightSectionWidth={30}
            data={
              data && data.data?.map((brand: any, index: number) => ({
                label: brand.name,
                value: brand._id,
                key: index
              }))
            } />
        </Box>
        <Box mt='md'>
          <Button type='submit' loading={isLoading} size='lg' fullWidth>
            Create
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default NewModel
