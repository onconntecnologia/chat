# MFE Admin - Micro Frontend de Administração

Este é o Micro Frontend responsável pela administração e gerenciamento de empresas e usuários da plataforma SaaS de chat.

## Funcionalidades

### Dashboard Administrativo
- Estatísticas gerais da plataforma
- Gráficos de crescimento de empresas
- Distribuição de usuários por função
- Métricas de uso da plataforma

### Gerenciamento de Empresas
- Listagem com paginação e busca
- Criação de novas empresas
- Edição de dados da empresa
- Visualização detalhada
- Ativação/desativação de empresas
- Exclusão de empresas
- Filtros por status e plano

### Gerenciamento de Usuários
- Listagem com paginação e busca
- Criação de novos usuários
- Edição de dados do usuário
- Visualização detalhada
- Ativação/desativação de usuários
- Exclusão de usuários
- Filtros por função, empresa e status

### Controle de Acesso
- Integração com MFE de autenticação
- Verificação de permissões por role
- Proteção de rotas administrativas

## Estrutura do Projeto

```
src/
├── components/          # Componentes principais
│   ├── Dashboard.js
│   ├── CompanyManagement.js
│   ├── CompanyForm.js
│   ├── CompanyDetails.js
│   ├── UserManagement.js
│   ├── UserForm.js
│   └── UserDetails.js
├── contexts/           # Contextos React
│   └── AdminContext.js
├── services/           # Serviços de API
│   ├── supabaseClient.js
│   └── adminService.js
├── utils/              # Utilitários
│   └── validationSchemas.js
├── App.js              # Componente principal
├── bootstrap.js        # Bootstrap para Module Federation
└── index.js            # Ponto de entrada
```

## Tecnologias Utilizadas

- **React 19** - Framework frontend
- **Material-UI** - Biblioteca de componentes
- **MUI X Data Grid** - Tabelas avançadas
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **Supabase** - Backend e banco de dados
- **Recharts** - Gráficos e visualizações
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

O MFE será executado em `http://localhost:12003`

### Build

```bash
npm run build
```

## Integração com Container

Este MFE expõe os seguintes componentes via Module Federation:

- `./AdminApp` - Aplicação completa de administração
- `./CompanyManagement` - Gerenciamento de empresas
- `./UserManagement` - Gerenciamento de usuários
- `./Dashboard` - Dashboard administrativo

### Exemplo de Uso no Container

```javascript
import { AdminApp } from 'admin/AdminApp';

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}
```

## Funcionalidades Detalhadas

### Dashboard

- **Estatísticas Gerais**: Total de empresas, usuários e chats
- **Métricas de Crescimento**: Novos registros no mês atual
- **Gráfico de Crescimento**: Visualização do crescimento de empresas nos últimos 30 dias
- **Distribuição por Função**: Gráfico de pizza mostrando usuários por role
- **Status da Plataforma**: Indicadores de saúde do sistema

### Gerenciamento de Empresas

#### Listagem
- Tabela paginada com todas as empresas
- Busca por nome ou email
- Filtros por status (ativa/inativa)
- Ordenação por data de criação
- Ações rápidas (visualizar, editar, ativar/desativar, excluir)

#### Formulário de Empresa
- Informações básicas (nome, email, telefone, website)
- Endereço completo com validação de CEP
- Configurações de plano (básico, premium, enterprise)
- Limites de usuários e chats por mês
- Validação completa com Yup

#### Detalhes da Empresa
- Visualização completa dos dados
- Lista de usuários vinculados
- Configurações de IA (se disponível)
- Integrações ativas
- Histórico de atividades

### Gerenciamento de Usuários

#### Listagem
- Tabela paginada com todos os usuários
- Busca por nome ou email
- Filtros por função, empresa e status
- Chips coloridos para identificar roles
- Ações rápidas (visualizar, editar, ativar/desativar, excluir)

#### Formulário de Usuário
- Informações pessoais (nome, email, telefone)
- Seleção de função (admin, company_admin, agent, customer)
- Vinculação à empresa (obrigatória para não-admins)
- Departamento e informações adicionais
- Validação baseada na função selecionada

#### Detalhes do Usuário
- Visualização completa dos dados pessoais
- Informações da empresa vinculada
- Permissões baseadas na função
- Histórico de atividades

## Validação e Segurança

### Esquemas de Validação

- **companySchema**: Validação completa de dados da empresa
- **userSchema**: Validação de usuários com regras condicionais
- **searchSchema**: Validação de parâmetros de busca
- **dateRangeSchema**: Validação de intervalos de data

### Segurança

- Validação de entrada em todos os formulários
- Sanitização de dados
- Controle de acesso baseado em roles
- Integração com sistema de autenticação
- Proteção contra XSS e injeção

## Contexto e Estado

### AdminContext

O contexto principal gerencia todo o estado da aplicação:

- **Estado de Empresas**: Lista, paginação, filtros, loading
- **Estado de Usuários**: Lista, paginação, filtros, loading
- **Dashboard**: Estatísticas e métricas
- **UI State**: Loading, erros, mensagens de sucesso
- **Ações**: CRUD completo para empresas e usuários

### Hooks Disponíveis

```javascript
const { state, actions } = useAdmin();

// Ações de empresas
actions.loadCompanies(page, search);
actions.createCompany(data);
actions.updateCompany(id, data);
actions.deleteCompany(id);
actions.toggleCompanyStatus(id, isActive);

// Ações de usuários
actions.loadUsers(page, search, companyId, role);
actions.createUser(data);
actions.updateUser(id, data);
actions.deleteUser(id);
actions.toggleUserStatus(id, isActive);

// Dashboard
actions.loadDashboardStats();
```

## Serviços de API

### adminService

Serviço completo para interação com o Supabase:

- **Empresas**: CRUD completo com paginação e busca
- **Usuários**: CRUD completo com filtros avançados
- **Dashboard**: Estatísticas e métricas
- **Configurações IA**: Gerenciamento de configurações
- **Integrações**: Controle de integrações

## Componentes Reutilizáveis

### Formulários
- **CompanyForm**: Formulário completo de empresa
- **UserForm**: Formulário de usuário com validação condicional

### Visualização
- **CompanyDetails**: Detalhes completos da empresa
- **UserDetails**: Detalhes do usuário com permissões

### Tabelas
- **DataGrid**: Tabelas paginadas com ações
- **Filtros**: Componentes de filtro reutilizáveis

## Gráficos e Visualizações

### Recharts Integration
- **LineChart**: Gráfico de crescimento temporal
- **PieChart**: Distribuição de usuários por função
- **BarChart**: Métricas comparativas
- **ResponsiveContainer**: Gráficos responsivos

## Testes

Para executar os testes:

```bash
npm test
```

## Performance

### Otimizações
- Lazy loading de componentes
- Paginação server-side
- Debounce em buscas
- Memoização de componentes pesados
- Code splitting automático

### Métricas
- Bundle size: ~1.55MB (com warnings para otimização)
- Tempo de build: ~20s
- Tempo de carregamento: <3s

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Roadmap

### Próximas Funcionalidades
- [ ] Configurações de IA por empresa
- [ ] Gerenciamento de integrações
- [ ] Relatórios avançados
- [ ] Auditoria de ações
- [ ] Backup e restore
- [ ] Notificações em tempo real
- [ ] Temas personalizáveis
- [ ] Exportação de dados

### Melhorias Técnicas
- [ ] Testes unitários completos
- [ ] Testes de integração
- [ ] Storybook para componentes
- [ ] Documentação de API
- [ ] Otimização de bundle
- [ ] PWA support