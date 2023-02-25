import React from 'react'
import { DataTable } from 'mantine-datatable';
import { useQuery } from 'react-query';
import { IReactQueryKey } from '../../constants/types';
import { getDevices } from '../../endpoints/device';

function DevicePage() {
  const { data, isLoading, error  } = useQuery(IReactQueryKey.devices, getDevices)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {JSON.stringify(error) }</div>
  }

  return (
    <div>DevicePage
      {data && JSON.stringify(data)}
    </div>
  )
}

export default DevicePage
