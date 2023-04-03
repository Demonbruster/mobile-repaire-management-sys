/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useMutation, useQuery } from 'react-query'
import { IReactQueryKey } from '../../../constants/types'
import { Box, Text, TextInput, Select, Button } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react';

import { getBrands } from '../../../endpoints/brand'
import { createModel, IModel_FE } from '../../../endpoints/model'
import showNotification from '../../../utils/notifications'
import queryClient from '../../../utils/queryClinet'

type Props = {}

function NewModel({ }: Props) {
  const { data, isLoading, error, isError } = useQuery(IReactQueryKey.brands, getBrands)

  const modelMutation = useMutation((value: IModel_FE) => createModel(value), {
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries([IReactQueryKey.models, data.brandId])
    },
  })

  const form = useForm({
    initialValues: {
      name: '',
      brand: '',
    },
    validate: {
      name: (value) => {
        if (!value) return 'Name is required'
      },
      brand: (value) => {
        if (!value) return 'Brand is required'
      }
    }
  })

  const onSubmit = (values: IModel_FE) => {
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
      <Text fz='lg' fw='bold'> Create new model </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
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