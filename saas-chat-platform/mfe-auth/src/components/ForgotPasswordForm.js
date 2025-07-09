import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link,
  InputAdornment,
  Paper,
  Container,
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { resetPasswordSchema } from '../utils/validationSchemas';

const ForgotPasswordForm = ({ onBack, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { resetPassword, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearError();
      setSuccessMessage('');
      
      await resetPassword(data.email);
      
      setSuccessMessage(
        'Instruções para redefinir sua senha foram enviadas para seu email.'
      );
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      setError('email', { 
        message: error.message || 'Erro ao enviar email de recuperação' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Typography component="h1" variant="h4" gutterBottom>
            Recuperar Senha
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Digite seu email para receber instruções de como redefinir sua senha
          </Typography>

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
              {...register('email')}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || !!successMessage}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Instruções'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              {onBack && (
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ArrowBack sx={{ mr: 1, fontSize: 16 }} />
                  Voltar ao login
                </Link>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordForm;