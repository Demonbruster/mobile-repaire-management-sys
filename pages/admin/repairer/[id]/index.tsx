import React, { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { 
  Accordion, 
  Box, 
  Button, 
  Divider, 
  Grid, 
  Text, 
  Title,
  Card,
  Stack,
  Group,
  Badge,
  Avatar,
  Timeline,
  ThemeIcon,
  ActionIcon,
  Paper,
  Textarea,
  Modal,
  Alert,
  Progress,
  Tooltip,
  NumberInput,
  Skeleton,
  Container
} from '@mantine/core'
import { 
  IconPhone,
  IconUser,
  IconDeviceMobile,
  IconCalendar,
  IconCurrencyDollar,
  IconEdit,
  IconCheck,
  IconClock,
  IconTool,
  IconTruck,
  IconX,
  IconAlertCircle,
  IconNotes,
  IconHistory,
  IconArrowLeft,
  IconPrinter,
  IconShare,
  IconRefresh
} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { DateInput } from '@mantine/dates'
import { modals } from '@mantine/modals'
import { reactQueryKey, status as constStatus } from '../../../../constants/constant'
import { getRepairer, getRepairerByCustomerPhone, updateStatusRepairer } from '../../../../endpoints/repairer'
import { getDevice } from '../../../../endpoints/device'
import { getBrand } from '../../../../endpoints/brand'
import showNotification from '../../../../utils/notifications'

const statusConfig = {
  'pending': { color: 'yellow', icon: IconClock, label: 'Pending' },
  'in-progress': { color: 'blue', icon: IconTool, label: 'In Progress' },
  'completed': { color: 'green', icon: IconCheck, label: 'Completed' },
  'delivered': { color: 'teal', icon: IconTruck, label: 'Delivered' },
  'cancelled': { color: 'red', icon: IconX, label: 'Cancelled' },
  'cancelled-delivered': { color: 'orange', icon: IconX, label: 'Cancelled & Delivered' },
}

function Repairer() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = router.query as { id: string }
  const [editModalOpen, dispatchEditModal] = useDisclosure(false)
  const [notesModalOpen, dispatchNotesModal] = useDisclosure(false)
  const [newNotes, setNewNotes] = useState('')
  const [estimatedCompletion, setEstimatedCompletion] = useState<Date | null>(null)
  const [estimatedCost, setEstimatedCost] = useState<number>(0)

  const { isLoading, data, refetch } = useQuery({
    queryKey: [reactQueryKey.repairer, id], 
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getRepairer(queryKey[1])
    },
    enabled: !!id
  })

  const deviceQuery = useQuery({
    queryKey: [reactQueryKey.device, data?.repairer?.device?._id], 
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getDevice(queryKey[1])
    },
    enabled: !!data?.repairer?.device?._id
  })

  const brandQuery = useQuery({
    queryKey: [reactQueryKey.brand, deviceQuery?.data?.data?.model?.brand], 
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getBrand(queryKey[1])
    },
    enabled: !!deviceQuery?.data?.data?.model?.brand
  })

  const otherRepairsQuery = useQuery({
    queryKey: [reactQueryKey.otherRepairers, data?.repairer?.customer?.phone], 
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return
      return await getRepairerByCustomerPhone(queryKey[1])
    },
    enabled: !!data?.repairer?.customer?.phone
  })

  const updateMutation = useMutation({
    mutationFn: async (updateData: { id: string; status?: string; notes?: string; charge?: number; expectedDeliveryDate?: Date }) => {
      return await updateStatusRepairer(updateData.id, updateData.status || data?.repairer?.status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.repairer] })
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.repairers] })
      showNotification({
        title: 'Success',
        message: 'Repair updated successfully',
        type: 'success'
      })
    },
    onError: (error) => {
      showNotification({
        title: 'Error',
        message: 'Failed to update repair',
        type: 'error'
      })
    }
  })

  const handleStatusChange = useCallback((newStatus: string) => {
    modals.openConfirmModal({
      title: `Change Status to ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`,
      children: (
        <Text size="sm">
          Are you sure you want to change the repair status to <strong>{statusConfig[newStatus as keyof typeof statusConfig]?.label}</strong>?
          {newStatus === 'completed' && ' This will mark the repair as finished.'}
          {newStatus === 'delivered' && ' This will mark the device as returned to customer.'}
          {newStatus === 'cancelled' && ' This will cancel the repair.'}
        </Text>
      ),
      labels: { confirm: 'Change Status', cancel: 'Cancel' },
      confirmProps: { color: statusConfig[newStatus as keyof typeof statusConfig]?.color },
      onConfirm: () => updateMutation.mutate({ id, status: newStatus }),
    })
  }, [id, updateMutation])

  const handleAddNotes = () => {
    updateMutation.mutate({ 
      id, 
      notes: newNotes
    })
    setNewNotes('')
    dispatchNotesModal.close()
  }

  const getStatusProgress = (status: string) => {
    const statuses = ['pending', 'in-progress', 'completed', 'delivered']
    const currentIndex = statuses.indexOf(status)
    return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0
  }

  const getTimelineItems = () => {
    const repairer = data?.repairer
    if (!repairer) return []

    const items = [
      {
        title: 'Repair Request Created',
        description: 'Device received and repair request initiated',
        time: repairer.entryDate ? new Date(repairer.entryDate).toLocaleDateString() : 'Unknown',
        icon: IconCalendar,
        color: 'blue'
      }
    ]

    if (repairer.status === 'in-progress' || ['completed', 'delivered'].includes(repairer.status)) {
      items.push({
        title: 'Repair Started',
        description: 'Technician began working on the device',
        time: 'In progress',
        icon: IconTool,
        color: 'blue'
      })
    }

    if (repairer.status === 'completed' || repairer.status === 'delivered') {
      items.push({
        title: 'Repair Completed',
        description: 'Device repair finished successfully',
        time: 'Recently',
        icon: IconCheck,
        color: 'green'
      })
    }

    if (repairer.status === 'delivered') {
      items.push({
        title: 'Device Delivered',
        description: 'Device returned to customer',
        time: repairer.deliveryDate ? new Date(repairer.deliveryDate).toLocaleDateString() : 'Today',
        icon: IconTruck,
        color: 'teal'
      })
    }

    return items
  }

  if (isLoading) {
    return (
      <Container size="xl" p="md">
        <Stack spacing="md">
          <Skeleton height={60} />
          <Grid>
            <Grid.Col md={8}>
              <Stack spacing="md">
                <Skeleton height={200} />
                <Skeleton height={300} />
              </Stack>
            </Grid.Col>
            <Grid.Col md={4}>
              <Skeleton height={400} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    )
  }

  if (!data?.repairer) {
    return (
      <Container size="xl" p="md">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Repair Not Found" color="red">
          The requested repair could not be found.
          <Button variant="light" color="red" size="sm" mt="sm" onClick={() => router.back()}>
            Go Back
          </Button>
        </Alert>
      </Container>
    )
  }

  const repairer = data.repairer
  const device = deviceQuery.data?.data
  const brand = brandQuery.data?.data
  const currentStatus = statusConfig[repairer.status as keyof typeof statusConfig]

  return (
    <Container size="xl" p="md">
      {/* Notes Modal */}
      <Modal opened={notesModalOpen} onClose={dispatchNotesModal.close} title="Add Repair Notes">
        <Stack spacing="md">
          <Textarea
            placeholder="Enter repair notes, observations, or updates..."
            value={newNotes}
            onChange={(event) => setNewNotes(event.currentTarget.value)}
            minRows={4}
          />
          <Group position="right">
            <Button variant="subtle" onClick={dispatchNotesModal.close}>
              Cancel
            </Button>
            <Button onClick={handleAddNotes} disabled={!newNotes.trim()}>
              Add Notes
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Stack spacing="xl">
        {/* Header */}
        <Group position="apart">
          <Group>
            <ActionIcon variant="light" onClick={() => router.back()}>
              <IconArrowLeft size="1.1rem" />
            </ActionIcon>
            <Box>
              <Title order={1}>Repair Details</Title>
              <Text size="sm" color="dimmed">
                Repair ID: {id?.slice(-8).toUpperCase()}
              </Text>
            </Box>
          </Group>
          <Group>
            <ActionIcon variant="light" onClick={() => refetch()}>
              <IconRefresh size="1.1rem" />
            </ActionIcon>
            <ActionIcon variant="light">
              <IconPrinter size="1.1rem" />
            </ActionIcon>
            <ActionIcon variant="light">
              <IconShare size="1.1rem" />
            </ActionIcon>
          </Group>
        </Group>

        {/* Status Progress */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Title order={3}>Repair Status</Title>
              <Badge 
                size="lg" 
                color={currentStatus?.color} 
                leftSection={currentStatus && <currentStatus.icon size="0.9rem" />}
              >
                {currentStatus?.label}
              </Badge>
            </Group>
            <Progress 
              value={getStatusProgress(repairer.status)} 
              color={currentStatus?.color}
              size="lg" 
              radius="xl"
            />
            <Text size="sm" color="dimmed">
              Progress: {Math.round(getStatusProgress(repairer.status))}% complete
            </Text>
          </Stack>
        </Card>

        <Grid>
          {/* Main Content */}
          <Grid.Col md={8}>
            <Stack spacing="lg">
              {/* Device Information */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Group position="apart">
                    <Title order={3}>Device Information</Title>
                    <ActionIcon variant="light" color="blue">
                      <IconEdit size="1rem" />
                    </ActionIcon>
                  </Group>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Group spacing="sm" mb="sm">
                        <IconDeviceMobile size="1rem" color="gray" />
                        <Box>
                          <Text size="sm" color="dimmed">Device</Text>
                          <Text weight={500}>{device?.name || 'Unknown Device'}</Text>
                        </Box>
                      </Group>
                      <Group spacing="sm" mb="sm">
                        <IconUser size="1rem" color="gray" />
                        <Box>
                          <Text size="sm" color="dimmed">Brand</Text>
                          <Text weight={500}>{brand?.name || 'Unknown Brand'}</Text>
                        </Box>
                      </Group>
                      <Group spacing="sm">
                        <IconCurrencyDollar size="1rem" color="gray" />
                        <Box>
                          <Text size="sm" color="dimmed">Repair Cost</Text>
                          <Text weight={500} size="lg" color="green">
                            ${repairer.charge || 0}
                          </Text>
                        </Box>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack spacing="xs">
                        <Text size="sm"><strong>Model:</strong> {device?.model?.name || 'Unknown'}</Text>
                        <Text size="sm"><strong>IMEI:</strong> {device?.imei || 'Not provided'}</Text>
                        <Text size="sm"><strong>Color:</strong> {device?.color || 'Not specified'}</Text>
                        <Text size="sm"><strong>Problem:</strong> {repairer.problem || 'Not specified'}</Text>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Card>

              {/* Customer Information */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Title order={3}>Customer Information</Title>
                  <Group>
                    <Avatar size="lg" color="blue" radius="xl">
                      {repairer.customer?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </Avatar>
                    <Box>
                      <Text size="lg" weight={500}>
                        {repairer.customer?.name || 'Unknown Customer'}
                      </Text>
                      <Group spacing="xs">
                        <IconPhone size="0.9rem" />
                        <Text size="sm" color="dimmed">
                          {repairer.customer?.phone}
                        </Text>
                      </Group>
                    </Box>
                  </Group>
                </Stack>
              </Card>

              {/* Timeline */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Group position="apart">
                    <Title order={3}>Repair Timeline</Title>
                    <ActionIcon variant="light" color="blue">
                      <IconHistory size="1rem" />
                    </ActionIcon>
                  </Group>
                  
                  <Timeline active={getTimelineItems().length - 1} bulletSize={24} lineWidth={2}>
                    {getTimelineItems().map((item, index) => (
                      <Timeline.Item
                        key={index}
                        bullet={<ThemeIcon size={24} color={item.color} radius="xl">
                          <item.icon size="0.8rem" />
                        </ThemeIcon>}
                        title={item.title}
                      >
                        <Text color="dimmed" size="sm">
                          {item.description}
                        </Text>
                        <Text size="xs" mt={4} color="dimmed">
                          {item.time}
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Stack>
              </Card>

              {/* Repair Notes */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Group position="apart">
                    <Title order={3}>Repair Notes</Title>
                    <Button
                      variant="light"
                      leftIcon={<IconNotes size="1rem" />}
                      onClick={dispatchNotesModal.open}
                    >
                      Add Note
                    </Button>
                  </Group>
                  
                  {repairer.notes ? (
                    <Paper p="md" withBorder radius="md" style={{ backgroundColor: '#f8f9fa' }}>
                      <Text size="sm">{repairer.notes}</Text>
                    </Paper>
                  ) : (
                                         <Text size="sm" color="dimmed" style={{ fontStyle: 'italic' }}>
                       No repair notes added yet. Click &quot;Add Note&quot; to document repair progress.
                     </Text>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col md={4}>
            <Stack spacing="lg">
              {/* Quick Actions */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Title order={4}>Quick Actions</Title>
                  
                  <Stack spacing="xs">
                    {constStatus.map((status) => {
                      const config = statusConfig[status as keyof typeof statusConfig]
                      const isCurrent = status === repairer.status
                      
                      return (
                        <Button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          variant={isCurrent ? 'filled' : 'light'}
                          color={config?.color}
                          disabled={isCurrent}
                          leftIcon={config && <config.icon size="1rem" />}
                          fullWidth
                          loading={updateMutation.isLoading}
                        >
                          {isCurrent ? 'Current: ' : 'Set to '}{config?.label}
                        </Button>
                      )
                    })}
                  </Stack>
                </Stack>
              </Card>

              {/* Important Dates */}
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Stack spacing="md">
                  <Title order={4}>Important Dates</Title>
                  
                  <Stack spacing="sm">
                    <Group position="apart">
                      <Text size="sm" color="dimmed">Entry Date:</Text>
                      <Text size="sm" weight={500}>
                        {repairer.entryDate ? new Date(repairer.entryDate).toLocaleDateString() : 'Not set'}
                      </Text>
                    </Group>
                    <Group position="apart">
                      <Text size="sm" color="dimmed">Expected Delivery:</Text>
                      <Text size="sm" weight={500}>
                        {repairer.expectedDeliveryDate ? new Date(repairer.expectedDeliveryDate).toLocaleDateString() : 'Not set'}
                      </Text>
                    </Group>
                    <Group position="apart">
                      <Text size="sm" color="dimmed">Actual Delivery:</Text>
                      <Text size="sm" weight={500}>
                        {repairer.deliveryDate ? new Date(repairer.deliveryDate).toLocaleDateString() : 'Pending'}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>

              {/* Customer History */}
              {otherRepairsQuery.data?.repairer && otherRepairsQuery.data.repairer.length > 1 && (
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Stack spacing="md">
                    <Title order={4}>Customer History</Title>
                    <Text size="sm" color="dimmed">
                      This customer has {otherRepairsQuery.data.repairer.length} repair(s) in total
                    </Text>
                    
                    <Accordion>
                      {otherRepairsQuery.data.repairer
                        .filter((repair: any) => repair._id !== id)
                        .slice(0, 3)
                        .map((repair: any, index: number) => (
                        <Accordion.Item key={repair._id} value={index.toString()}>
                          <Accordion.Control>
                            Repair #{index + 1}
                          </Accordion.Control>
                          <Accordion.Panel>
                            <Stack spacing="xs">
                              <Text size="sm"><strong>Problem:</strong> {repair.problem || 'Not specified'}</Text>
                              <Text size="sm"><strong>Status:</strong> 
                                <Badge size="sm" color={statusConfig[repair.status as keyof typeof statusConfig]?.color} ml="xs">
                                  {statusConfig[repair.status as keyof typeof statusConfig]?.label}
                                </Badge>
                              </Text>
                              <Text size="sm"><strong>Cost:</strong> ${repair.charge || 0}</Text>
                            </Stack>
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

export default Repairer
