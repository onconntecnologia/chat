# Guia de Uso - MFE Auth

Este documento fornece exemplos práticos de como usar o MFE de Autenticação.

## Configuração Inicial

### 1. Instalar Dependências

```bash
cd mfe-auth
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

### 3. Iniciar o MFE

```bash
npm start
```

O MFE estará disponível em `http://localhost:12001`

## Exemplos de Uso

### 1. Uso Standalone

O MFE pode ser usado de forma independente acessando diretamente:

- Login: `http://localhost:12001/login`
- Perfil: `http://localhost:12001/profile`

### 2. Integração com Container

#### Importar AuthProvider

```javascript
import React from 'react';
import { AuthProvider } from 'auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      {/* Sua aplicação aqui */}
    </AuthProvider>
  );
}
```

#### Usar Hook de Autenticação

```javascript
import React from 'react';
import { useAuth } from 'auth/AuthProvider';

function UserProfile() {
  const { user, userData, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Usuário não autenticado</div>;
  }

  return (
    <div>
      <h1>Olá, {userData?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {userData?.role}</p>
      <button onClick={signOut}>Sair</button>
    </div>
  );
}
```

#### Proteger Rotas

```javascript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from 'auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

### 3. Formulários Customizados

#### Login Customizado

```javascript
import React from 'react';
import { LoginForm } from 'auth/LoginForm';

function CustomLoginPage() {
  const handleLoginSuccess = (result) => {
    console.log('Login realizado:', result);
    // Redirecionar ou atualizar estado
  };

  return (
    <div>
      <h1>Minha Página de Login</h1>
      <LoginForm 
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => console.log('Ir para registro')}
        onForgotPassword={() => console.log('Esqueceu senha')}
      />
    </div>
  );
}
```

#### Registro Customizado

```javascript
import React from 'react';
import { RegisterForm } from 'auth/RegisterForm';

function CustomRegisterPage() {
  const handleRegisterSuccess = (result) => {
    if (result.needsEmailConfirmation) {
      alert('Verifique seu email para confirmar o cadastro');
    } else {
      console.log('Registro realizado:', result);
    }
  };

  return (
    <div>
      <h1>Criar Nova Conta</h1>
      <RegisterForm 
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => console.log('Ir para login')}
      />
    </div>
  );
}
```

## Verificação de Permissões

### Hook usePermissions

```javascript
import React from 'react';
import { usePermissions } from 'auth/AuthProvider';

function AdminButton() {
  const { canAccessAdminPanel } = usePermissions();

  if (!canAccessAdminPanel()) {
    return null;
  }

  return <button>Painel Admin</button>;
}

function CompanyManagement() {
  const { canManageCompany, hasRole } = usePermissions();

  return (
    <div>
      {canManageCompany() && (
        <button>Gerenciar Empresa</button>
      )}
      
      {hasRole('admin') && (
        <button>Configurações Globais</button>
      )}
    </div>
  );
}
```

## Tratamento de Erros

### Capturar Erros de Autenticação

```javascript
import React, { useState } from 'react';
import { useAuth } from 'auth/AuthProvider';

function LoginComponent() {
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      setError('');
      await signIn(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {/* Formulário de login */}
    </div>
  );
}
```

## Personalização de Tema

### Aplicar Tema Customizado

```javascript
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from 'auth/AuthProvider';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        {/* Sua aplicação */}
      </AuthProvider>
    </ThemeProvider>
  );
}
```

## Eventos de Autenticação

### Listener para Mudanças de Estado

```javascript
import React, { useEffect } from 'react';
import { useAuth } from 'auth/AuthProvider';

function AuthListener() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuário logado:', user);
      // Inicializar recursos do usuário
    } else {
      console.log('Usuário deslogado');
      // Limpar recursos do usuário
    }
  }, [isAuthenticated, user]);

  return null;
}
```

## Integração com APIs

### Usar Token de Autenticação

```javascript
import React, { useEffect, useState } from 'react';
import { useAuth } from 'auth/AuthProvider';

function UserData() {
  const { session } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (session?.access_token) {
      fetch('/api/user-data', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      .then(response => response.json())
      .then(setData);
    }
  }, [session]);

  return <div>{/* Renderizar dados */}</div>;
}
```

## Testes

### Testar Componentes com Autenticação

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from 'auth/AuthProvider';

const MockAuthProvider = ({ children, mockUser = null }) => {
  const mockValue = {
    user: mockUser,
    isAuthenticated: !!mockUser,
    signIn: jest.fn(),
    signOut: jest.fn(),
    loading: false,
  };

  return (
    <AuthProvider value={mockValue}>
      {children}
    </AuthProvider>
  );
};

test('should show user name when authenticated', () => {
  const mockUser = { name: 'João Silva' };
  
  render(
    <MockAuthProvider mockUser={mockUser}>
      <UserProfile />
    </MockAuthProvider>
  );

  expect(screen.getByText('Olá, João Silva')).toBeInTheDocument();
});
```

## Troubleshooting

### Problemas Comuns

1. **MFE não carrega**: Verifique se está rodando na porta 12001
2. **Erro de CORS**: Configure o webpack dev server corretamente
3. **Supabase não conecta**: Verifique as variáveis de ambiente
4. **Componentes não aparecem**: Verifique se o Module Federation está configurado

### Debug

```javascript
// Adicionar logs para debug
import { useAuth } from 'auth/AuthProvider';

function DebugAuth() {
  const auth = useAuth();
  
  console.log('Auth state:', auth);
  
  return <pre>{JSON.stringify(auth, null, 2)}</pre>;
}
```