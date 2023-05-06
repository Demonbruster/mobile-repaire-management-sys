import React from 'react'
import { DataTable } from 'mantine-datatable';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '../../endpoints/device';
import { reactQueryKey } from '../../constants/constant';

function DevicePage() {
  const { data, isLoading, error } = useQuery({ queryKey: [reactQueryKey.devices], queryFn: getDevices })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>
  }

  return (
    <div>DevicePage
      {data && JSON.stringify(data)}
    </div>
  )
}

export default DevicePage
