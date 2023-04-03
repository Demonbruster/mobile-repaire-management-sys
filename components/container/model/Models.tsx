import React from 'react'
import { Box, Text } from '@mantine/core'
import { useQuery } from 'react-query'
import { reactQueryKey } from '../../../constants/constant'
import { getModels } from '../../../endpoints/model'

function Models() {
  const { isLoading, data, isError, error } = useQuery(reactQueryKey.models, async () => getModels())

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <Box p='sm'>
      <Text fz='lg' fw='bold'>
        Models
      </Text>
      <Box mt='md'>
        {data && JSON.stringify(data)}
      </Box>
    </Box>
  )
}

export default Models