import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import {
  Box,
  Tabs,
  Tab,
  Alert,
  Container,
  Paper,
} from '@mui/material';

const ProfilePage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setMessage('');
  };

  const handleProfileSuccess = () => {
    setMessage('Perfil atualizado com sucesso!');
  };

  const handlePasswordSuccess = () => {
    setMessage('Senha alterada com sucesso!');
    setCurrentTab(0); // Voltar para a aba do perfil
  };

  const handlePasswordCancel = () => {
    setCurrentTab(0); // Voltar para a aba do perfil
  };

  return (
    <Container maxWidth="md">
      {message && (
        <Box sx={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <Alert severity="success" onClose={() => setMessage('')}>
            {message}
          </Alert>
        </Box>
      )}

      <Paper elevation={1} sx={{ mt: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Perfil" />
          <Tab label="Alterar Senha" />
        </Tabs>

        <Box sx={{ p: 0 }}>
          {currentTab === 0 && (
            <ProfileForm onSuccess={handleProfileSuccess} />
          )}
          {currentTab === 1 && (
            <ChangePasswordForm
              onSuccess={handlePasswordSuccess}
              onCancel={handlePasswordCancel}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;