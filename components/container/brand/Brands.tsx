import React from 'react'
import { Box, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { reactQueryKey } from '../../../constants/constant'
import { getBrands } from '../../../endpoints/brand'

const Brands = () => {
  const { isLoading, data, isError, error } = useQuery({ queryKey: [reactQueryKey.brands], queryFn: async () => await getBrands() })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <Box p='sm'>
      <Text fz='lg' fw='bold'>
        Brands
      </Text>
      <Box mt='md'>
        {data && JSON.stringify(data)}
      </Box>
    </Box>
  )
}

export default Brands
