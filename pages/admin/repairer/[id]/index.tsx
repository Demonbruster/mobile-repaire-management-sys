import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { reactQueryKey } from '../../../../constants/constant'
import { getRepairer } from '../../../../endpoints/repairer'

function Repairer() {
  const router = useRouter();
  const { id } = router.query as { id: string }
  const { isLoading, data, isError, error } = useQuery({ queryKey: [reactQueryKey.repairer], queryFn: async () => await getRepairer(id) })

  console.log({
    isLoading,
    data,
    isError,
    error
  })

  return (
    <div>Repairer</div>
  )
}

export default Repairer
