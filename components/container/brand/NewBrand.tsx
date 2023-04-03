import { useForm } from '@mantine/form'
import React from 'react'
import { Box, Text, TextInput, Button, Flex } from '@mantine/core'

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

  const onSubmit = (values: { name: string }) => {
    console.log(values)
  }

  return (
    <Box>
      <Text fz='lg' fw='bold'> Create new brand </Text>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Box mb='md'>
          <TextInput required label='Name' placeholder='Name' {...form.getInputProps('name')} />
        </Box>
        <Flex mt='md' justify='center' direction='row' gap='md'>
          <Button type='submit' size='lg' fullWidth>
            Create
          </Button>
          <Button type='reset' variant='outline' size='lg' fullWidth>
            Reset
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default NewBrand
