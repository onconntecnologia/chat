# Container App

Aplicação principal que carrega os Micro Frontends (MFEs) da plataforma SaaS de atendimento.

## Funcionalidades

- Carregamento dinâmico dos MFEs
- Roteamento entre os MFEs
- Interface comum para toda a plataforma

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis
- `src/pages`: Páginas da aplicação
- `src/mfeComponents`: Componentes para carregar os MFEs

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```

## Integração com MFEs

O Container App utiliza Module Federation para carregar os seguintes MFEs:

- Auth MFE: Autenticação e gerenciamento de usuários
- Chat MFE: Core da aplicação - sistema de chat para atendimento
- Admin MFE: Painel administrativo para gerenciar empresas e configurações