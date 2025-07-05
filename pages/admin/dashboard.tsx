import React, { useMemo, useState } from 'react'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { 
  Flex, 
  Skeleton, 
  Card, 
  Title, 
  Grid, 
  Group, 
  TextInput, 
  Button, 
  Stack, 
  Collapse,
  Text,
  Badge,
  Box,
  SimpleGrid,
  Paper,
  RingProgress,
  ThemeIcon,
  ActionIcon,
  Center,
  Loader
} from '@mantine/core'
import { 
  IconSearch, 
  IconCaretDown, 
  IconCaretUp, 
  IconDeviceMobile,
  IconUsers,
  IconTool,
  IconCurrencyDollar,
  IconCalendar,
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconX,
  IconRefresh
} from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable';
import { useQuery } from '@tanstack/react-query';

import { reactQueryKey } from '../../constants/constant';
import NewRepairer from '../../components/container/repairer/NewRepairer';
import { getRepairers } from '../../endpoints/repairer';
import { getCustomers } from '../../endpoints/customers';
import { getDevices } from '../../endpoints/device';
import { useRouter } from 'next/router';

const loadingSize = 300

const Dashboard = () => {
  return (
    <Box p="lg">
      <Title order={1} mb="xl" c="dark">
        Mobile Repair Management Dashboard
      </Title>
      <Stack spacing="xl">
        <StatsSection />
        <RepairerTable />
      </Stack>
    </Box>
  )
}

export default Dashboard;

function StatsSection() {
  const repairersQuery = useQuery({ 
    queryKey: [reactQueryKey.repairers], 
    queryFn: getRepairers 
  })
  const customersQuery = useQuery({ 
    queryKey: [reactQueryKey.customers], 
    queryFn: getCustomers 
  })
  const devicesQuery = useQuery({ 
    queryKey: [reactQueryKey.devices], 
    queryFn: getDevices 
  })

  const stats = useMemo(() => {
    const repairers = repairersQuery.data?.repairers || []
    const customers = customersQuery.data?.data || []
    const devices = devicesQuery.data?.data || []

    const totalRepairs = repairers.length
    const pendingRepairs = repairers.filter((r: any) => r.status === 'pending').length
    const completedRepairs = repairers.filter((r: any) => r.status === 'completed').length
    const inProgressRepairs = repairers.filter((r: any) => r.status === 'in-progress').length
    const totalRevenue = repairers.reduce((sum: number, r: any) => sum + (r.charge || 0), 0)
    const avgRepairTime = 3.5 // This would be calculated from actual data
    const completionRate = totalRepairs > 0 ? Math.round((completedRepairs / totalRepairs) * 100) : 0

    return {
      totalRepairs,
      pendingRepairs,
      completedRepairs,
      inProgressRepairs,
      totalCustomers: customers.length,
      totalDevices: devices.length,
      totalRevenue,
      avgRepairTime,
      completionRate
    }
  }, [repairersQuery.data, customersQuery.data, devicesQuery.data])

  if (repairersQuery.isLoading || customersQuery.isLoading || devicesQuery.isLoading) {
    return (
      <SimpleGrid cols={4} spacing="lg">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={120} radius="md" />
        ))}
      </SimpleGrid>
    )
  }

  return (
    <Stack spacing="md">
      <Title order={2} c="dark">Overview</Title>
      <SimpleGrid cols={4} spacing="lg" breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'sm', cols: 1 }
      ]}>
        <StatsCard
          title="Total Repairs"
          value={stats.totalRepairs}
          icon={<IconTool size="1.4rem" />}
          color="blue"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<IconUsers size="1.4rem" />}
          color="green"
        />
        <StatsCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={<IconDeviceMobile size="1.4rem" />}
          color="violet"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<IconCurrencyDollar size="1.4rem" />}
          color="yellow"
        />
      </SimpleGrid>

      <SimpleGrid cols={3} spacing="lg" breakpoints={[
        { maxWidth: 'md', cols: 1 }
      ]}>
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mb="md">
            <Text size="lg" weight={500}>Repair Status</Text>
            <ActionIcon variant="subtle" color="gray">
              <IconRefresh size="1rem" />
            </ActionIcon>
          </Group>
          <Center>
            <RingProgress
              size={140}
              thickness={12}
              sections={[
                { value: (stats.pendingRepairs / stats.totalRepairs) * 100, color: 'yellow' },
                { value: (stats.inProgressRepairs / stats.totalRepairs) * 100, color: 'blue' },
                { value: (stats.completedRepairs / stats.totalRepairs) * 100, color: 'green' },
              ]}
              label={
                <Text size="sm" align="center" weight={500}>
                  {stats.completionRate}%
                  <br />
                  <Text size="xs" color="dimmed">Complete</Text>
                </Text>
              }
            />
          </Center>
          <Stack mt="md" spacing="xs">
            <Group position="apart">
              <Group spacing="xs">
                <Badge color="yellow" variant="dot">Pending</Badge>
                <Text size="sm">{stats.pendingRepairs}</Text>
              </Group>
            </Group>
            <Group position="apart">
              <Group spacing="xs">
                <Badge color="blue" variant="dot">In Progress</Badge>
                <Text size="sm">{stats.inProgressRepairs}</Text>
              </Group>
            </Group>
            <Group position="apart">
              <Group spacing="xs">
                <Badge color="green" variant="dot">Completed</Badge>
                <Text size="sm">{stats.completedRepairs}</Text>
              </Group>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mb="md">
            <Text size="lg" weight={500}>Performance</Text>
            <ThemeIcon variant="light" color="green">
              <IconTrendingUp size="1rem" />
            </ThemeIcon>
          </Group>
          <Stack spacing="md">
            <Box>
              <Text size="sm" color="dimmed">Average Repair Time</Text>
              <Text size="xl" weight={700}>{stats.avgRepairTime} days</Text>
            </Box>
            <Box>
              <Text size="sm" color="dimmed">Completion Rate</Text>
              <Text size="xl" weight={700}>{stats.completionRate}%</Text>
            </Box>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mb="md">
            <Text size="lg" weight={500}>Quick Actions</Text>
            <ThemeIcon variant="light" color="blue">
              <IconCalendar size="1rem" />
            </ThemeIcon>
          </Group>
          <Stack spacing="sm">
            <Button variant="light" fullWidth leftIcon={<IconTool size="1rem" />}>
              New Repair
            </Button>
            <Button variant="light" fullWidth leftIcon={<IconUsers size="1rem" />}>
              Add Customer
            </Button>
            <Button variant="light" fullWidth leftIcon={<IconDeviceMobile size="1rem" />}>
              Register Device
            </Button>
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  )
}

function StatsCard({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper shadow="sm" p="lg" radius="md" withBorder>
      <Group position="apart">
        <Box>
          <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
            {title}
          </Text>
          <Text size="xl" weight={700}>
            {value}
          </Text>
        </Box>
        <ThemeIcon variant="light" color={color} size="xl">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  )
}

function RepairerTable() {
  const router = useRouter()
  
  const { isLoading, data, isError, error } = useQuery({ 
    queryKey: [reactQueryKey.repairers], 
    queryFn: getRepairers, 
   })

  const [isNewRepairerOpen, setIsNewRepairerOpen] = useState(false)
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [opened, { toggle }] = useDisclosure(false);

  const records = useMemo(() => {
    const tunedData = data?.repairers?.map((repairer: any) => ({
      device: repairer.device?.name || 'Unknown Device',
      customer: repairer.customer?.phone + ' ' + (repairer.customer?.name ? repairer.customer.name : ''),
      problem: repairer.problem || 'No problem specified',
      status: repairer.status,
      charge: repairer.charge || 0,
      id: repairer._id,
      entryDate: repairer.entryDate ? new Date(repairer.entryDate).toLocaleDateString() : 'N/A',
      expectedDelivery: repairer.expectedDeliveryDate ? new Date(repairer.expectedDeliveryDate).toLocaleDateString() : 'N/A'
    }))

    if (!debouncedQuery) return tunedData || [];

    return tunedData?.filter((record: any) => {
      return Object.keys(record).some((key) => {
        return String(record[key]).toLowerCase().includes(debouncedQuery.toLowerCase());
      });
    }) || [];
  }, [data, debouncedQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'in-progress': return 'blue';
      case 'completed': return 'green';
      case 'delivered': return 'teal';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <IconClock size="0.8rem" />;
      case 'in-progress': return <IconTool size="0.8rem" />;
      case 'completed': return <IconCheck size="0.8rem" />;
      case 'delivered': return <IconCheck size="0.8rem" />;
      case 'cancelled': return <IconX size="0.8rem" />;
      default: return <IconAlertCircle size="0.8rem" />;
    }
  }

  const columns = [
    {
      accessor: 'device',
      title: 'Device',
      render: (record: any) => (
        <Text weight={500}>{record.device}</Text>
      )
    },
    {
      accessor: 'customer',
      title: 'Customer'
    },
    {
      accessor: 'problem',
      title: 'Problem',
      render: (record: any) => (
        <Text size="sm" color="dimmed" lineClamp={2}>
          {record.problem}
        </Text>
      )
    },
    {
      accessor: 'status',
      title: 'Status',
      render: (record: any) => (
        <Badge 
          color={getStatusColor(record.status)} 
          variant="light"
          leftSection={getStatusIcon(record.status)}
        >
          {record.status}
        </Badge>
      )
    },
    {
      accessor: 'charge',
      title: 'Charge',
      render: (record: any) => (
        <Text weight={500}>${record.charge}</Text>
      )
    },
    {
      accessor: 'entryDate',
      title: 'Entry Date',
      render: (record: any) => (
        <Text size="sm">{record.entryDate}</Text>
      )
    },
    {
      accessor: 'expectedDelivery',
      title: 'Expected Delivery',
      render: (record: any) => (
        <Text size="sm">{record.expectedDelivery}</Text>
      )
    }
  ]

  if (isLoading) return <Skeleton height={loadingSize} />

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Grid align="center">
          <Grid.Col span={6}>
            <Title order={2} c="dark">Recent Repairs</Title>
            <Text size="sm" color="dimmed">Manage and track all repair requests</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position='right'>
              <Flex direction='row' gap='md' sx={{ flexBasis: '100%' }} >
                <TextInput
                  sx={{ flexBasis: '70%' }}
                  placeholder="Search repairs..."
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  icon={<IconSearch size={16} />}
                  radius="md"
                />
                <Button 
                  variant="gradient" 
                  gradient={{ from: 'blue', to: 'cyan' }}
                  sx={{ flexBasis: '30%' }}
                  leftIcon={
                    isNewRepairerOpen ? <IconCaretUp size={16} /> : <IconCaretDown size={16} />
                  }
                  onClick={() => {
                    setIsNewRepairerOpen((prev) => !prev)
                    toggle()
                  }}
                  radius="md"
                >
                  {isNewRepairerOpen ? 'Close' : 'New Repair'}
                </Button>
              </Flex>
            </Group>
          </Grid.Col>
        </Grid>
        
        <Collapse in={opened}>
          <Paper withBorder p="md" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
            <NewRepairer />
          </Paper>
        </Collapse>

        <DataTable
          minHeight={loadingSize}
          columns={columns}
          records={records}
          onRowClick={(data: {id : string}, rowIndex, event) => {
            router.push(`/admin/repairer/${data.id}`)
          }}
          striped
          highlightOnHover
          withBorder
          borderRadius="md"
          key={
            records?.map((record: any) => record.device + record.customer + record.problem + record.status).join('')
          }
        />
      </Stack>
    </Card>
  )
}