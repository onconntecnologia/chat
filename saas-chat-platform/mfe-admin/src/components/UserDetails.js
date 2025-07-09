import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';

const UserDetails = ({ user }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleInfo = (role) => {
    const roles = {
      admin: { label: 'Administrador', color: 'error' },
      company_admin: { label: 'Administrador da Empresa', color: 'warning' },
      agent: { label: 'Agente', color: 'info' },
      customer: { label: 'Cliente', color: 'default' }
    };
    return roles[role] || { label: role, color: 'default' };
  };

  const roleInfo = getRoleInfo(user.role);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Informações Pessoais
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nome Completo"
                    secondary={user.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
                {user.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Telefone"
                      secondary={user.phone}
                    />
                  </ListItem>
                )}
                {user.department && (
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Departamento"
                      secondary={user.department}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Status e Função */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status e Função
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  icon={user.is_active ? <ActiveIcon /> : <InactiveIcon />}
                  label={user.is_active ? 'Ativo' : 'Inativo'}
                  color={user.is_active ? 'success' : 'default'}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Função
                </Typography>
                <Chip
                  label={roleInfo.label}
                  color={roleInfo.color}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Criado em
                </Typography>
                <Typography variant="body2">
                  {formatDate(user.created_at)}
                </Typography>
              </Box>
              {user.updated_at && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Última atualização
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(user.updated_at)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Empresa */}
        {user.companies && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  Empresa
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nome da Empresa"
                      secondary={user.companies.name}
                    />
                  </ListItem>
                  {user.companies.email && (
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email da Empresa"
                        secondary={user.companies.email}
                      />
                    </ListItem>
                  )}
                  {user.companies.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Telefone da Empresa"
                        secondary={user.companies.phone}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText
                      primary="Plano"
                      secondary={
                        <Chip
                          label={user.companies.plan}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status da Empresa"
                      secondary={
                        <Chip
                          label={user.companies.is_active ? 'Ativa' : 'Inativa'}
                          size="small"
                          color={user.companies.is_active ? 'success' : 'default'}
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Permissões baseadas na função */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Permissões
              </Typography>
              <Grid container spacing={1}>
                {user.role === 'admin' && (
                  <>
                    <Grid item>
                      <Chip label="Gerenciar todas as empresas" color="error" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label="Gerenciar todos os usuários" color="error" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label="Configurações globais" color="error" size="small" />
                    </Grid>
                  </>
                )}
                {user.role === 'company_admin' && (
                  <>
                    <Grid item>
                      <Chip label="Gerenciar empresa" color="warning" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label="Gerenciar usuários da empresa" color="warning" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label="Configurar integrações" color="warning" size="small" />
                    </Grid>
                  </>
                )}
                {user.role === 'agent' && (
                  <>
                    <Grid item>
                      <Chip label="Atender chats" color="info" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label="Visualizar relatórios" color="info" size="small" />
                    </Grid>
                  </>
                )}
                {user.role === 'customer' && (
                  <>
                    <Grid item>
                      <Chip label="Iniciar chats" color="default" size="small" />
                    </Grid>
                    <Grid item>
                      <Chip label="Visualizar histórico" color="default" size="small" />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;