import React, { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { reactQueryKey, status as constStatus } from '../../../../constants/constant'
import { getRepairer, getRepairerByCustomerPhone, updateStatusRepairer } from '../../../../endpoints/repairer'
import { getDevice } from '../../../../endpoints/device'
import { getBrand } from '../../../../endpoints/brand'
import { Accordion, Box, Button, Divider, Grid, Text, Title } from '@mantine/core'

function Repairer() {
  const router = useRouter();
  const queryClient = useQueryClient()
  const { id } = router.query as { id: string }

  const { isLoading, data } = useQuery({
    queryKey: [reactQueryKey.repairer, id], queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getRepairer(queryKey[1])
    }
  })

  const deviceQuery = useQuery({
    queryKey: [reactQueryKey.device, data?.repairer?.device?._id], queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getDevice(queryKey[1])
    }
  })

  const brandQuery = useQuery({
    queryKey: [reactQueryKey.brand, deviceQuery?.data?.data?.model?.brand], queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getBrand(queryKey[1])
    }
  })

  // other repairs of the same customer
  const otherRepairsQuery = useQuery({
    queryKey: [reactQueryKey.otherRepairers, data?.repairer?.customer?.phone], queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getRepairerByCustomerPhone(queryKey[1])
    }
  })

  const updateMutateStatus = useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      return await updateStatusRepairer(data.id, data.status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.repairer] })
    }
  })


  console.log({
    repaire: data?.repairer,
    device: deviceQuery.data,
    brand: brandQuery.data,
    otherRepairs: otherRepairsQuery.data
  })

  const handleStatusChange = useCallback((id:string,status: string) => {
    updateMutateStatus.mutateAsync({ id, status })
  }, [updateMutateStatus])

  if (isLoading) return <div>Loading...</div>

  return (
    <Box>
      <Grid>
        <Grid.Col md={6} sm={12}>
          <Box my='sm'>
            <Title order={3}>Repairer details</Title>
            <Text>Name: {data?.repairer?.name}</Text>
            <Text>Model: {deviceQuery.data?.data?.model?.name}</Text>
            <Text>Brand: {brandQuery.data?.data?.name}</Text>
            <Text>IMEI: {data?.repairer?.imei}</Text>
            <Text>charge: {data?.repairer?.charge}</Text>
            <Text> Problem:{data?.repairer?.problem}  </Text>
            <Text>Entry date: {data?.repairer?.entryDate} </Text>
            <Text>Expected delivery date: {data?.repairer?.expectedDeliveryDate} </Text>
            <Text>Delivery date: {data?.repairer?.deliveryDate} </Text>
          </Box>
          <Divider />
          <Box my='sm'>
            <Text>Customer: {data?.repairer?.customer?.name}</Text>
            <Text>Phone: {data?.repairer?.customer?.phone}</Text>
          </Box>
        </Grid.Col>
        <Grid.Col md={6} sm={12}>
          <Box my='sm'>
            <Title order={3}>Actions</Title>
            {constStatus.map((status, index) => (
              <Button
                key={index}
                onClick={() => handleStatusChange(id,status)}
                variant={status === data?.repairer?.status ? 'light' : 'outline'}
                color={status === data?.repairer?.status ? 'blue' : 'gray'}
                disabled={status === data?.repairer?.status}
                fullWidth
              >
                {status}
              </Button>
            ))}

          </Box>
        </Grid.Col>
        <Grid.Col sm={12}>
          <Box my='sm'>
            <Title order={3}>Other repairs of the same customer</Title>
            <Accordion defaultValue={"0"}>
              {otherRepairsQuery.data?.repairer?.map((repairer: any, index: number) => (
                <Accordion.Item key={repairer._id} value={index.toString()}>
                  <Accordion.Control>{index + 1}</Accordion.Control>
                  <Accordion.Panel>
                    <Text>IMEI: {repairer.imei}</Text>
                    <Text>charge: {repairer.charge}</Text>
                    <Text> Problem:{repairer.problem}  </Text>
                    <Text>Entry date: {repairer.entryDate} </Text>
                    <Text>Expected delivery date: {repairer.expectedDeliveryDate} </Text>
                    <Text>Delivery date: {repairer.deliveryDate} </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  )
}

export default Repairer;
