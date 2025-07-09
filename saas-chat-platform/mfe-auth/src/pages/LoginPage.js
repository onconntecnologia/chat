import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { Box, Alert } from '@mui/material';

const LoginPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'forgot'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLoginSuccess = (result) => {
    setMessage('Login realizado com sucesso!');
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1000);
  };

  const handleRegisterSuccess = (result) => {
    if (result.needsEmailConfirmation) {
      setMessage('Conta criada! Verifique seu email para confirmar o cadastro.');
      setCurrentView('login');
    } else {
      setMessage('Conta criada com sucesso!');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    }
  };

  const handleForgotPasswordSuccess = () => {
    setTimeout(() => {
      setCurrentView('login');
    }, 3000);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBack={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot')}
          />
        );
    }
  };

  return (
    <Box>
      {message && (
        <Box sx={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <Alert severity="success" onClose={() => setMessage('')}>
            {message}
          </Alert>
        </Box>
      )}
      {renderCurrentView()}
    </Box>
  );
};

export default LoginPage;