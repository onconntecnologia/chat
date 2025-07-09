import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';

const CompanyDetails = ({ company }) => {
  if (!company) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanInfo = (plan) => {
    const plans = {
      basic: { label: 'Básico', color: 'default' },
      premium: { label: 'Premium', color: 'primary' },
      enterprise: { label: 'Enterprise', color: 'secondary' }
    };
    return plans[plan] || { label: plan, color: 'default' };
  };

  const planInfo = getPlanInfo(company.plan);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Informações Básicas
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nome da Empresa"
                    secondary={company.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={company.email}
                  />
                </ListItem>
                {company.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Telefone"
                      secondary={company.phone}
                    />
                  </ListItem>
                )}
                {company.website && (
                  <ListItem>
                    <ListItemIcon>
                      <WebsiteIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Website"
                      secondary={
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'inherit' }}
                        >
                          {company.website}
                        </a>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Status e Plano */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status e Plano
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  icon={company.is_active ? <ActiveIcon /> : <InactiveIcon />}
                  label={company.is_active ? 'Ativa' : 'Inativa'}
                  color={company.is_active ? 'success' : 'default'}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Plano
                </Typography>
                <Chip
                  label={planInfo.label}
                  color={planInfo.color}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Criado em
                </Typography>
                <Typography variant="body2">
                  {formatDate(company.created_at)}
                </Typography>
              </Box>
              {company.updated_at && (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Última atualização
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(company.updated_at)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Endereço */}
        {(company.address || company.city || company.state || company.zip_code) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  Endereço
                </Typography>
                {company.address && (
                  <Typography variant="body2" gutterBottom>
                    {company.address}
                  </Typography>
                )}
                <Typography variant="body2">
                  {[company.city, company.state].filter(Boolean).join(', ')}
                  {company.zip_code && ` - ${company.zip_code}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Limites e Configurações */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Limites e Configurações
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Máximo de Usuários"
                    secondary={company.max_users?.toLocaleString() || 'Não definido'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ChatIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Máximo de Chats por Mês"
                    secondary={company.max_chats_per_month?.toLocaleString() || 'Não definido'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Usuários da Empresa */}
        {company.users && company.users.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ mr: 1 }} />
                  Usuários ({company.users.length})
                </Typography>
                <Grid container spacing={2}>
                  {company.users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {user.email}
                        </Typography>
                        <Chip
                          label={user.role}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Configurações de IA */}
        {company.ai_configurations && company.ai_configurations.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configurações de IA
                </Typography>
                {company.ai_configurations.map((config) => (
                  <Box key={config.id} sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong> {config.is_enabled ? 'Habilitada' : 'Desabilitada'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Modelo:</strong> {config.model}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Resposta Automática:</strong> {config.auto_response_enabled ? 'Sim' : 'Não'}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Integrações */}
        {company.integrations && company.integrations.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Integrações
                </Typography>
                <Grid container spacing={2}>
                  {company.integrations.map((integration) => (
                    <Grid item xs={12} sm={6} md={4} key={integration.id}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {integration.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Tipo: {integration.type}
                        </Typography>
                        <Chip
                          label={integration.is_active ? 'Ativa' : 'Inativa'}
                          size="small"
                          color={integration.is_active ? 'success' : 'default'}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CompanyDetails;