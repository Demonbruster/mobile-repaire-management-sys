import React, { useCallback } from 'react'
import { 
  IconUsers, 
  IconDeviceMobile, 
  IconDeviceMobileVibration, 
  IconSettings,
  IconDashboard,
  IconChartBar,
  IconLogout,
  IconMenu2
} from '@tabler/icons-react'

import { sizes } from '../../constants/constant'
import { 
  ActionIcon, 
  AppShell, 
  Box, 
  Flex, 
  Text, 
  Header,
  Navbar,
  MediaQuery,
  Burger,
  useMantineTheme,
  Stack,
  Button,
  Divider,
  Group,
  Avatar,
  Paper,
  UnstyledButton,
  ThemeIcon,
  Badge
} from '@mantine/core'
import { useRouter } from 'next/router'
import { useState } from 'react'

const size = sizes.FOOTER_ICON_SIZE

const navigationItems = [
  {
    name: 'Dashboard',
    icon: <IconDashboard size={size} />,
    path: '/admin/dashboard',
    color: 'blue',
    description: 'Overview and analytics'
  },
  {
    name: 'Repairers',
    icon: <IconDeviceMobile size={size} />,
    path: '/admin/dashboard',
    color: 'green',
    description: 'Manage repairs'
  },
  {
    name: 'Customers',
    icon: <IconUsers size={size} />,
    path: '/admin/customers',
    color: 'violet',
    description: 'Customer management'
  },
  {
    name: 'Devices',
    icon: <IconDeviceMobileVibration size={size} />,
    path: '/admin/devices',
    color: 'orange',
    description: 'Device inventory'
  },
  {
    name: 'Settings',
    icon: <IconSettings size={size} />,
    path: '/admin/settings',
    color: 'gray',
    description: 'System settings'
  },
]

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter()

  const handleClick = useCallback((pathParam: string) => {
    router.push(pathParam)
    setOpened(false) // Close mobile menu after navigation
  }, [router])

  const isIndexPage = router.pathname === '/'

  if (isIndexPage) {
    return <Box>{children}</Box>
  }

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[0],
          minHeight: '100vh',
          paddingBottom: 80, // Add padding for mobile footer
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow>
            <Stack spacing="xs">
              <Box mb="md">
                <Text size="lg" weight={700} color={theme.primaryColor}>
                  Repair Manager
                </Text>
                <Text size="xs" color="dimmed">
                  Mobile Device Management
                </Text>
              </Box>
              <Divider />
              {navigationItems.map((item, index) => (
                <NavigationItem
                  key={index}
                  item={item}
                  isActive={router.pathname === item.path}
                  onClick={() => handleClick(item.path)}
                />
              ))}
            </Stack>
          </Navbar.Section>
          <Navbar.Section>
            <Divider mb="md" />
            <UserSection />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            
            <Group position="apart" sx={{ width: '100%' }}>
              <Box>
                <Text size="xl" weight={700} color={theme.primaryColor}>
                  Mobile Repair Manager
                </Text>
                <Text size="sm" color="dimmed">
                  Professional repair management system
                </Text>
              </Box>
              
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Group>
                  <Badge color="green" variant="light">
                    Online
                  </Badge>
                  <ActionIcon variant="light" color="gray">
                    <IconLogout size="1.1rem" />
                  </ActionIcon>
                </Group>
              </MediaQuery>
            </Group>
          </div>
        </Header>
      }
      footer={
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Paper
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              zIndex: 1000,
              borderTop: `1px solid ${theme.colors.gray[2]}`,
              backgroundColor: 'white',
              backdropFilter: 'blur(10px)',
            }}
            shadow="lg"
          >
            <Flex justify="space-evenly" align="center" h="100%">
              {navigationItems.slice(0, 4).map((item, index) => (
                <MobileNavItem
                  key={index}
                  item={item}
                  isActive={router.pathname === item.path}
                  onClick={() => handleClick(item.path)}
                />
              ))}
            </Flex>
          </Paper>
        </MediaQuery>
      }
    >
      <Box p="md">
        {children}
      </Box>
    </AppShell>
  )
}

function NavigationItem({ item, isActive, onClick }: {
  item: typeof navigationItems[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const theme = useMantineTheme();
  
  return (
    <UnstyledButton
      onClick={onClick}
      sx={{
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: isActive ? theme.colors[item.color][6] : theme.colors.gray[7],
        backgroundColor: isActive ? theme.colors[item.color][0] : 'transparent',
        '&:hover': {
          backgroundColor: isActive ? theme.colors[item.color][1] : theme.colors.gray[0],
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Group>
        <ThemeIcon 
          variant={isActive ? 'filled' : 'light'} 
          color={item.color} 
          size="lg"
        >
          {item.icon}
        </ThemeIcon>
        <Box>
          <Text size="sm" weight={500}>
            {item.name}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  )
}

function MobileNavItem({ item, isActive, onClick }: {
  item: typeof navigationItems[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const theme = useMantineTheme();
  
  return (
    <UnstyledButton
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: isActive ? theme.colors[item.color][6] : theme.colors.gray[6],
        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <ActionIcon
        variant={isActive ? 'filled' : 'subtle'}
        color={isActive ? item.color : 'gray'}
        size="lg"
      >
        {item.icon}
      </ActionIcon>
      <Text size="xs" weight={isActive ? 600 : 400} mt={4}>
        {item.name}
      </Text>
    </UnstyledButton>
  )
}

function UserSection() {
  const theme = useMantineTheme();
  
  return (
    <UnstyledButton
      sx={{
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Group>
        <Avatar size={40} color="blue">
          A
        </Avatar>
        <Box>
          <Text size="sm" weight={500}>
            Admin User
          </Text>
          <Text size="xs" color="dimmed">
            admin@repairshop.com
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  )
}
