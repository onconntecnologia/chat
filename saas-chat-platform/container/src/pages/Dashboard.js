import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import ChatIcon from '@mui/icons-material/Chat';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChatIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="div">
                  Chat
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Acesse a plataforma de chat para atender seus clientes ou iniciar uma conversa.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/chat">
                Acessar Chat
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="div">
                  Administração
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Gerencie usuários, empresas e configurações da plataforma.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/admin">
                Acessar Admin
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="div">
                  Empresas
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Gerencie as empresas cadastradas na plataforma.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/admin/companies">
                Gerenciar Empresas
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;