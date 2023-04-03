/* eslint-disable react-hooks/exhaustive-deps */
import React,{useEffect} from 'react'
import { useForm } from '@mantine/form'
import { Box, Text, TextInput, Button, Flex } from '@mantine/core'
import { useMutation } from 'react-query'
import { createBrand } from '../../../endpoints/brand'
import { IBrand } from '../../../constants/types'

const NewBrand = () => {
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

  const { isError, isLoading, isSuccess, mutateAsync, error } = useMutation((data: IBrand) => createBrand(data))

  const onSubmit = (values: { name: string }) => {
    mutateAsync(values)
  }

  useEffect(() => {
    if (isSuccess) {
      form.reset()
    }
  }, [isSuccess])

  useEffect(() => {
    // @ts-ignore
    if (isError && error?.message === 'Brand already exists' ) {
      form.setFieldError('name', 'Brand already exists')
    }
  }, [isError])

  return (
    <Box>
      <Text fz='lg' fw='bold'> Create new brand </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Box mb='md'>
          <TextInput required label='Name' placeholder='Name' {...form.getInputProps('name')} />
        </Box>
        <Flex mt='md' justify='center' direction='row' gap='md'>
          <Button type='submit' loading={isLoading} size='lg' fullWidth>
            Create
          </Button>
          <Button type='reset' loading={isLoading} variant='outline' size='lg' fullWidth>
            Reset
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default NewBrand
