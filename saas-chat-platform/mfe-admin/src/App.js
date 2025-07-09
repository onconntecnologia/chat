import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  SmartToy as AIIcon,
  Extension as IntegrationIcon
} from '@mui/icons-material';
import { AdminProvider } from './contexts/AdminContext';
import Dashboard from './components/Dashboard';
import CompanyManagement from './components/CompanyManagement';
import UserManagement from './components/UserManagement';

// Fallback AuthProvider para desenvolvimento standalone
const AuthProvider = ({ children }) => children;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Empresas', icon: <BusinessIcon />, path: '/companies' },
  { text: 'Usuários', icon: <PeopleIcon />, path: '/users' },
  { text: 'Configurações IA', icon: <AIIcon />, path: '/ai-config' },
  { text: 'Integrações', icon: <IntegrationIcon />, path: '/integrations' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = ({ currentPath, onNavigate }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64, // Height of AppBar
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={currentPath === item.path}
              onClick={() => onNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

const AdminApp = () => {
  const [currentPath, setCurrentPath] = React.useState('/dashboard');

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard />;
      case '/companies':
        return <CompanyManagement />;
      case '/users':
        return <UserManagement />;
      case '/ai-config':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Configurações de IA</Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Funcionalidade em desenvolvimento
            </Alert>
          </Box>
        );
      case '/integrations':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Integrações</Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Funcionalidade em desenvolvimento
            </Alert>
          </Box>
        );
      case '/settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Configurações</Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Funcionalidade em desenvolvimento
            </Alert>
          </Box>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<CircularProgress />}>
        <AuthProvider>
          <AdminProvider>
            <Box sx={{ display: 'flex' }}>
              {/* AppBar */}
              <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
              >
                <Toolbar>
                  <Typography variant="h6" noWrap component="div">
                    Administração - Plataforma SaaS
                  </Typography>
                </Toolbar>
              </AppBar>

              {/* Sidebar */}
              <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

              {/* Main Content */}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  mt: 8, // AppBar height
                  ml: `${drawerWidth}px`,
                  minHeight: 'calc(100vh - 64px)',
                }}
              >
                {renderContent()}
              </Box>
            </Box>
          </AdminProvider>
        </AuthProvider>
      </Suspense>
    </ThemeProvider>
  );
};

// Para uso standalone com React Router
const AdminAppWithRouter = () => {
  return (
    <Router>
      <AdminApp />
    </Router>
  );
};

export default AdminAppWithRouter;
export { AdminApp };