# MFE Auth - Micro Frontend de Autenticação

Este é o Micro Frontend responsável pela autenticação e gerenciamento de usuários da plataforma SaaS de chat.

## Funcionalidades

### Autenticação
- Login com email e senha
- Registro de novos usuários
- Recuperação de senha
- Logout
- Gerenciamento de sessões

### Gerenciamento de Perfil
- Visualização do perfil do usuário
- Edição de dados pessoais
- Alteração de senha
- Visualização de informações da empresa

### Controle de Acesso
- Proteção de rotas baseada em autenticação
- Controle de permissões por role
- Redirecionamento automático

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   ├── ForgotPasswordForm.js
│   ├── ProfileForm.js
│   ├── ChangePasswordForm.js
│   └── ProtectedRoute.js
├── pages/              # Páginas principais
│   ├── LoginPage.js
│   ├── ProfilePage.js
│   └── UnauthorizedPage.js
├── contexts/           # Contextos React
│   └── AuthContext.js
├── services/           # Serviços de API
│   ├── supabaseClient.js
│   └── authService.js
├── hooks/              # Hooks customizados
│   ├── useAuthRedirect.js
│   └── usePermissions.js
├── utils/              # Utilitários
│   └── validationSchemas.js
├── App.js              # Componente principal
├── bootstrap.js        # Bootstrap para Module Federation
└── index.js            # Ponto de entrada
```

## Tecnologias Utilizadas

- **React 19** - Framework frontend
- **Material-UI** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **Supabase** - Backend e autenticação
- **React Router** - Roteamento
- **Module Federation** - Micro Frontend

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm start
```

O MFE será executado em `http://localhost:12001`

### Build

```bash
npm run build
```

## Integração com Container

Este MFE expõe os seguintes componentes via Module Federation:

- `./AuthApp` - Aplicação completa de autenticação
- `./AuthProvider` - Provider de contexto de autenticação
- `./LoginForm` - Formulário de login
- `./RegisterForm` - Formulário de registro
- `./ProtectedRoute` - Componente de proteção de rotas

### Exemplo de Uso no Container

```javascript
import { AuthProvider } from 'auth/AuthProvider';
import { ProtectedRoute } from 'auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthApp />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}
```

## Roles de Usuário

O sistema suporta os seguintes tipos de usuário:

- **admin** - Administrador da plataforma (acesso total)
- **company_admin** - Administrador da empresa (gerencia empresa e usuários)
- **agent** - Agente de atendimento (atende chats)
- **customer** - Cliente (cria chats)

## Hooks Disponíveis

### useAuth

Hook principal para acessar o contexto de autenticação:

```javascript
const { 
  user, 
  userData, 
  isAuthenticated, 
  signIn, 
  signOut, 
  loading 
} = useAuth();
```

### usePermissions

Hook para verificar permissões do usuário:

```javascript
const { 
  hasRole, 
  canManageUsers, 
  canAccessAdminPanel 
} = usePermissions();
```

## Validação

O projeto utiliza Yup para validação de formulários com esquemas pré-definidos:

- `loginSchema` - Validação de login
- `registerSchema` - Validação de registro
- `profileSchema` - Validação de perfil
- `resetPasswordSchema` - Validação de recuperação de senha
- `updatePasswordSchema` - Validação de alteração de senha

## Segurança

- Tokens JWT gerenciados pelo Supabase
- Validação de entrada em todos os formulários
- Proteção de rotas baseada em autenticação
- Controle de acesso baseado em roles
- Sanitização de dados de entrada

## Testes

Para executar os testes:

```bash
npm test
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request