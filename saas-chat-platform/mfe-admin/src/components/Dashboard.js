import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useAdmin } from '../contexts/AdminContext';
import { adminService } from '../services/adminService';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />;
    if (trend === 'down') return <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />;
    return null;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value?.toLocaleString() || 0}
            </Typography>
            {trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {getTrendIcon()}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {trendValue} este mês
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.main`,
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { state, actions } = useAdmin();
  const [growthData, setGrowthData] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Dados mock para demonstração
        const mockStats = {
          totalCompanies: 45,
          totalUsers: 234,
          totalChats: 1567,
          newCompaniesThisMonth: 8,
          newUsersThisMonth: 23,
          newChatsThisMonth: 156
        };
        
        const mockGrowthData = [
          { date: '2024-01-01', count: 2 },
          { date: '2024-01-05', count: 1 },
          { date: '2024-01-10', count: 3 },
          { date: '2024-01-15', count: 2 },
          { date: '2024-01-20', count: 4 },
          { date: '2024-01-25', count: 1 },
          { date: '2024-01-30', count: 3 }
        ];
        
        const mockUsersByRole = [
          { role: 'Admin', count: 5 },
          { role: 'Company Admin', count: 45 },
          { role: 'Agent', count: 134 },
          { role: 'Customer', count: 50 }
        ];
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        actions.setDashboardStats(mockStats);
        setGrowthData(mockGrowthData);
        setUsersByRole(mockUsersByRole);
      } catch (error) {
        actions.setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const { dashboardStats } = state;

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {state.error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Administrativo
      </Typography>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Empresas"
            value={dashboardStats?.totalCompanies}
            icon={<BusinessIcon />}
            trend={dashboardStats?.newCompaniesThisMonth > 0 ? 'up' : null}
            trendValue={dashboardStats?.newCompaniesThisMonth}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Usuários"
            value={dashboardStats?.totalUsers}
            icon={<PeopleIcon />}
            trend={dashboardStats?.newUsersThisMonth > 0 ? 'up' : null}
            trendValue={dashboardStats?.newUsersThisMonth}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Chats"
            value={dashboardStats?.totalChats}
            icon={<ChatIcon />}
            trend={dashboardStats?.newChatsThisMonth > 0 ? 'up' : null}
            trendValue={dashboardStats?.newChatsThisMonth}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Crescimento Mensal"
            value={`${((dashboardStats?.newCompaniesThisMonth / dashboardStats?.totalCompanies) * 100 || 0).toFixed(1)}%`}
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de Crescimento de Empresas */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Crescimento de Empresas (Últimos 30 dias)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Usuários por Role */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Usuários por Função
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersByRole}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ role, count }) => `${role}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Resumo de Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Status da Plataforma
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {dashboardStats?.totalCompanies || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Empresas Ativas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {dashboardStats?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Usuários Ativos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {dashboardStats?.totalChats || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Conversas Realizadas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chip 
                    label="Sistema Online" 
                    color="success" 
                    variant="outlined"
                    sx={{ fontSize: '1rem', p: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Alertas e Notificações */}
      {state.success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={actions.clearMessages}>
          {state.success}
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;