import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  Paper,
  Container,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Email,
  Person,
  Business,
  Badge,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { profileSchema } from '../utils/validationSchemas';

const ProfileForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { userData, updateProfile, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearError();
      setSuccessMessage('');
      
      await updateProfile(data);
      
      setSuccessMessage('Perfil atualizado com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('email', { 
        message: error.message || 'Erro ao atualizar perfil' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador da Plataforma',
      company_admin: 'Administrador da Empresa',
      agent: 'Agente',
      customer: 'Cliente',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      company_admin: 'warning',
      agent: 'info',
      customer: 'success',
    };
    return colors[role] || 'default';
  };

  if (!userData) {
    return (
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h6" align="center">
            Carregando dados do perfil...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
            src={userData.avatar_url}
          >
            {userData.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Typography component="h1" variant="h4" gutterBottom>
            Meu Perfil
          </Typography>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip
              label={getRoleLabel(userData.role)}
              color={getRoleColor(userData.role)}
              sx={{ mb: 1 }}
            />
            
            {userData.company && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Business sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2" color="text.secondary">
                  {userData.company.name}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ width: '100%', mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <TextField
              {...register('name')}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...register('email')}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>ID do Usuário:</strong> {userData.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Membro desde:</strong> {new Date(userData.created_at).toLocaleDateString('pt-BR')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {userData.status}
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileForm;