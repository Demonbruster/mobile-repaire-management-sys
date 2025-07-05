import React, { useMemo, useState } from 'react'
import { 
  Box, 
  Button, 
  Flex, 
  Grid, 
  Modal, 
  Stack, 
  Text, 
  TextInput, 
  Title,
  ActionIcon,
  Group,
  Badge,
  Paper,
  Card,
  Avatar,
  Menu,
  Skeleton,
  Alert,
  Tooltip,
  Center,
  Loader,
  SimpleGrid,
  ThemeIcon,
  Select,
  MultiSelect,
  Chip,
  Divider,
  Checkbox,
  ScrollArea
} from '@mantine/core'
import { 
  useMutation, 
  useQuery,
  useQueryClient 
} from '@tanstack/react-query'
import { reactQueryKey, sizes } from '../../../constants/constant'
import { DataTable } from 'mantine-datatable'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { 
  IconSearch, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconDotsVertical,
  IconUsers,
  IconPhone,
  IconMail,
  IconRefresh,
  IconAlertTriangle,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconX,
  IconDownload,
  IconUpload,
  IconCheck,
  IconSelector
} from '@tabler/icons-react'
import NewCustomer from './NewCustomer'
import { 
  getCustomers, 
  deleteCustomer, 
  updateCustomer, 
  ICustomer_FE 
} from '../../../endpoints/customers'
import { modals } from '@mantine/modals'
import showNotification from '../../../utils/notifications'

type SortField = 'name' | 'phone' | 'created'
type SortDirection = 'asc' | 'desc'

interface FilterOptions {
  status: string[]
  hasName: boolean | null
  search: string
}

const Customers = () => {
  const queryClient = useQueryClient()
  const { isLoading, data, isError, error, refetch } = useQuery({ 
    queryKey: [reactQueryKey.customers], 
    queryFn: getCustomers,
    refetchOnWindowFocus: false
  })

  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 300)
  const [addModalOpen, dispatchAddModal] = useDisclosure(false)
  const [editModalOpen, dispatchEditModal] = useDisclosure(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    hasName: null,
    search: ''
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.customers] })
      showNotification({
        title: 'Success',
        message: 'Customer deleted successfully',
        type: 'success'
      })
    },
    onError: (error: any) => {
      showNotification({
        title: 'Error',
        message: (error as any)?.message || 'Failed to delete customer',
        type: 'error'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICustomer_FE }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryKey.customers] })
      showNotification({
        title: 'Success',
        message: 'Customer updated successfully',
        type: 'success'
      })
      dispatchEditModal.close()
      setSelectedCustomer(null)
    },
    onError: (error: any) => {
      showNotification({
        title: 'Error',
        message: (error as any)?.message || 'Failed to update customer',
        type: 'error'
      })
    }
  })

  const handleDelete = (customer: any) => {
    modals.openConfirmModal({
      title: 'Delete Customer',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{customer.name || customer.phone}</strong>? 
          This action cannot be undone and will affect any related repair records.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(customer.id),
    })
  }

  const handleBulkDelete = () => {
    modals.openConfirmModal({
      title: 'Delete Multiple Customers',
      children: (
        <Text size="sm">
          Are you sure you want to delete {selectedRows.length} customers? 
          This action cannot be undone and will affect any related repair records.
        </Text>
      ),
      labels: { confirm: 'Delete All', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        selectedRows.forEach(id => deleteMutation.mutate(id))
        setSelectedRows([])
      },
    })
  }

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer)
    dispatchEditModal.open()
  }

  const handleView = (customer: any) => {
    modals.open({
      title: 'Customer Details',
      children: (
        <Stack spacing="md">
          <Group>
            <Avatar size="lg" color="blue" radius="xl">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <Box>
              <Text size="lg" weight={500}>
                {customer.name || 'Unknown Name'}
              </Text>
              <Text size="sm" color="dimmed">
                Customer ID: {customer.id}
              </Text>
            </Box>
          </Group>
          <Group>
            <IconPhone size="1rem" />
            <Text>{customer.phone}</Text>
          </Group>
          <Group>
            <IconMail size="1rem" />
            <Text color="dimmed">No email available</Text>
          </Group>
        </Stack>
      ),
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExport = () => {
    const allRecords = data?.data?.map((customer: any) => ({
      id: customer._id,
      name: customer.name,
      phone: customer.phone
    })) || []
    
    const csvData = allRecords.map((record: any) => ({
      Name: record.name || 'Unknown',
      Phone: record.phone,
      Status: 'Active'
    }))
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row: any) => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      hasName: null,
      search: ''
    })
    setQuery('')
  }

  const records = useMemo(() => {
    let tunedData = data?.data?.map((customer: any) => ({
      id: customer._id,
      name: customer.name,
      phone: customer.phone
    })) || []

    // Apply search filter
    if (debouncedQuery) {
      tunedData = tunedData.filter((record: any) => {
        return Object.keys(record).some((key) => {
          if (record[key]) {
            return String(record[key]).toLowerCase().includes(debouncedQuery.toLowerCase())
          }
          return false
        })
      })
    }

    // Apply additional filters
    if (filters.hasName === true) {
      tunedData = tunedData.filter((record: any) => record.name && record.name.trim() !== '')
    } else if (filters.hasName === false) {
      tunedData = tunedData.filter((record: any) => !record.name || record.name.trim() === '')
    }

    // Apply sorting
    tunedData.sort((a: any, b: any) => {
      let aValue = a[sortField] || ''
      let bValue = b[sortField] || ''
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return tunedData
  }, [data, debouncedQuery, filters, sortField, sortDirection])

  const columns = [
    {
      accessor: 'select',
      title: (
        <Checkbox
          checked={selectedRows.length === records.length && records.length > 0}
          indeterminate={selectedRows.length > 0 && selectedRows.length < records.length}
          onChange={(event) => {
            setSelectedRows(event.currentTarget.checked ? records.map((r: any) => r.id) : [])
          }}
        />
      ),
      render: (record: any) => (
        <Checkbox
          checked={selectedRows.includes(record.id)}
          onChange={(event) => {
            setSelectedRows(current => 
              event.currentTarget.checked 
                ? [...current, record.id]
                : current.filter(id => id !== record.id)
            )
          }}
        />
      ),
      width: 40
    },
    {
      accessor: 'name',
      title: (
        <Group spacing="xs">
          <Text>Customer</Text>
          <ActionIcon
            size="xs"
            variant="transparent"
            onClick={() => handleSort('name')}
          >
            {sortField === 'name' && sortDirection === 'asc' ? (
              <IconSortAscending size="0.8rem" />
            ) : sortField === 'name' && sortDirection === 'desc' ? (
              <IconSortDescending size="0.8rem" />
            ) : (
              <IconSelector size="0.8rem" />
            )}
          </ActionIcon>
        </Group>
      ),
      render: (record: any) => (
        <Group spacing="sm">
          <Avatar size="sm" color="blue" radius="xl">
            {record.name ? record.name.charAt(0).toUpperCase() : 'C'}
          </Avatar>
          <Box>
            <Text size="sm" weight={500}>
              {record.name || 'Unknown Name'}
            </Text>
            <Text size="xs" color="dimmed">
              ID: {record.id.slice(-6)}
            </Text>
          </Box>
        </Group>
      ),
      sortable: true
    },
    {
      accessor: 'phone',
      title: (
        <Group spacing="xs">
          <Text>Phone</Text>
          <ActionIcon
            size="xs"
            variant="transparent"
            onClick={() => handleSort('phone')}
          >
            {sortField === 'phone' && sortDirection === 'asc' ? (
              <IconSortAscending size="0.8rem" />
            ) : sortField === 'phone' && sortDirection === 'desc' ? (
              <IconSortDescending size="0.8rem" />
            ) : (
              <IconSelector size="0.8rem" />
            )}
          </ActionIcon>
        </Group>
      ),
      render: (record: any) => (
        <Group spacing="xs">
          <IconPhone size="0.9rem" color="gray" />
          <Text size="sm">{record.phone}</Text>
        </Group>
      ),
      sortable: true
    },
    {
      accessor: 'status',
      title: 'Status',
      render: (record: any) => (
        <Badge color="green" variant="light">
          Active
        </Badge>
      )
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlignment: 'right' as const,
      render: (record: any) => (
        <Group spacing="xs" position="right">
          <Tooltip label="View Details">
            <ActionIcon 
              variant="light" 
              color="blue" 
              onClick={(e) => {
                e.stopPropagation()
                handleView(record)
              }}
            >
              <IconEye size="1rem" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Customer">
            <ActionIcon 
              variant="light" 
              color="yellow" 
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(record)
              }}
            >
              <IconEdit size="1rem" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Customer">
            <ActionIcon 
              variant="light" 
              color="red" 
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(record)
              }}
              loading={deleteMutation.isLoading}
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      )
    }
  ]

  const stats = useMemo(() => {
    const totalCustomers = data?.data?.length || 0
    const activeCustomers = totalCustomers // For now, all customers are active
    const newThisMonth = Math.floor(totalCustomers * 0.2) // Placeholder calculation
    const withNames = data?.data?.filter((c: any) => c.name && c.name.trim() !== '').length || 0
    const withoutNames = totalCustomers - withNames
    
    return {
      totalCustomers,
      activeCustomers,
      newThisMonth,
      withNames,
      withoutNames
    }
  }, [data])

  const activeFiltersCount = [
    filters.hasName !== null,
    filters.status.length > 0,
    debouncedQuery.length > 0
  ].filter(Boolean).length

  if (isLoading) {
    return (
      <Box p="md">
        <Skeleton height={60} mb="md" />
        <Stack spacing="sm">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={60} />
          ))}
        </Stack>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box p="md">
        <Alert 
          icon={<IconAlertTriangle size="1rem" />} 
          title="Error Loading Customers" 
          color="red"
          variant="light"
        >
          {(error as any)?.message || 'Failed to load customers'}
          <Button 
            variant="light" 
            color="red" 
            size="sm" 
            mt="sm"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      {/* Add Customer Modal */}
      <Modal 
        opened={addModalOpen} 
        onClose={dispatchAddModal.close} 
        title={
          <Group>
            <IconPlus size="1.2rem" />
            <Title order={3}>Add New Customer</Title>
          </Group>
        }
        size="md"
      >
        <NewCustomer
          onSuccess={() => { dispatchAddModal.close() }}
          onClose={() => { dispatchAddModal.close() }}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal 
        opened={editModalOpen} 
        onClose={() => {
          dispatchEditModal.close()
          setSelectedCustomer(null)
        }} 
        title={
          <Group>
            <IconEdit size="1.2rem" />
            <Title order={3}>Edit Customer</Title>
          </Group>
        }
        size="md"
      >
        {selectedCustomer && (
          <NewCustomer
            initialValues={selectedCustomer}
            onSuccess={() => { dispatchEditModal.close() }}
            onClose={() => { dispatchEditModal.close() }}
            isEdit={true}
            customerId={selectedCustomer.id}
          />
        )}
      </Modal>

      {/* Header Section */}
      <Stack spacing="xl">
        <Box>
          <Group position="apart" align="flex-start">
            <Box>
              <Title order={1} color="dark">
                Customer Management
              </Title>
              <Text size="sm" color="dimmed">
                Manage your customer database and contact information
              </Text>
            </Box>
            <Group>
              <Button 
                variant="light"
                leftIcon={<IconDownload size="1rem" />}
                onClick={handleExport}
                disabled={records.length === 0}
              >
                Export
              </Button>
              <Button 
                leftIcon={<IconPlus size="1rem" />}
                onClick={dispatchAddModal.open}
                gradient={{ from: 'blue', to: 'cyan' }}
                variant="gradient"
                size="md"
              >
                Add Customer
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Stats Cards */}
        <SimpleGrid cols={4} spacing="lg" breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'sm', cols: 1 }
        ]}>
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<IconUsers size="1.4rem" />}
            color="blue"
          />
          <StatsCard
            title="Active Customers"
            value={stats.activeCustomers}
            icon={<IconUsers size="1.4rem" />}
            color="green"
          />
          <StatsCard
            title="With Names"
            value={stats.withNames}
            icon={<IconUsers size="1.4rem" />}
            color="violet"
          />
          <StatsCard
            title="Without Names"
            value={stats.withoutNames}
            icon={<IconUsers size="1.4rem" />}
            color="orange"
          />
        </SimpleGrid>

        {/* Filters and Search */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Text size="lg" weight={500}>Search & Filters</Text>
              {activeFiltersCount > 0 && (
                <Button
                  variant="light"
                  color="gray"
                  size="sm"
                  leftIcon={<IconX size="0.9rem" />}
                  onClick={clearFilters}
                >
                  Clear Filters ({activeFiltersCount})
                </Button>
              )}
            </Group>

            <Grid>
              <Grid.Col md={6} sm={12}>
                <TextInput
                  placeholder="Search customers by name or phone..."
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  icon={<IconSearch size="1rem" />}
                  radius="md"
                  size="md"
                />
              </Grid.Col>
              <Grid.Col md={3} sm={12}>
                <Select
                  placeholder="Filter by name"
                  value={filters.hasName?.toString() || ''}
                  onChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    hasName: value === '' ? null : value === 'true' 
                  }))}
                  data={[
                    { value: '', label: 'All customers' },
                    { value: 'true', label: 'Has name' },
                    { value: 'false', label: 'No name' }
                  ]}
                  clearable
                  radius="md"
                  size="md"
                />
              </Grid.Col>
              <Grid.Col md={3} sm={12}>
                <Text size="sm" color="dimmed" ta="right" mt="sm">
                  Showing {records.length} of {stats.totalCustomers} customers
                </Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Table Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Group position="apart">
              <Title order={3} color="dark">
                Customer List
              </Title>
              <Group>
                {selectedRows.length > 0 && (
                  <Button
                    variant="light"
                    color="red"
                    size="sm"
                    leftIcon={<IconTrash size="0.9rem" />}
                    onClick={handleBulkDelete}
                  >
                    Delete Selected ({selectedRows.length})
                  </Button>
                )}
                <ActionIcon 
                  variant="light" 
                  color="blue"
                  onClick={() => refetch()}
                  loading={isLoading}
                >
                  <IconRefresh size="1rem" />
                </ActionIcon>
              </Group>
            </Group>

            <DataTable
              minHeight={300}
              columns={columns}
              records={records}
              striped
              highlightOnHover
              withBorder
              borderRadius="md"
              verticalSpacing="sm"
              // @ts-ignore
              emptyState={
                <Center p="xl">
                  <Stack align="center" spacing="sm">
                    <IconUsers size="3rem" color="gray" />
                    <Text size="lg" color="dimmed">No customers found</Text>
                    <Text size="sm" color="dimmed">
                      {debouncedQuery || activeFiltersCount > 0 ? 'Try adjusting your search criteria' : 'Add your first customer to get started'}
                    </Text>
                    {!debouncedQuery && activeFiltersCount === 0 && (
                      <Button 
                        variant="light" 
                        onClick={dispatchAddModal.open}
                        leftIcon={<IconPlus size="1rem" />}
                      >
                        Add Customer
                      </Button>
                    )}
                  </Stack>
                </Center>
              }
            />
          </Stack>
        </Card>
      </Stack>
    </Box>
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

export default Customers
