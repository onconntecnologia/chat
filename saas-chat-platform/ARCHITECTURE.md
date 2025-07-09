# Arquitetura da Plataforma SaaS de Chat

## Visão Geral

A plataforma SaaS de chat é construída com uma arquitetura de Micro Frontend (MFE) para permitir escalabilidade e adição de novos recursos no futuro. O core da plataforma é o sistema de chat, que permite que empresas atendam seus clientes.

## Componentes Principais

### Frontend

1. **Container App**
   - Aplicação principal que carrega os MFEs
   - Gerencia o roteamento entre os MFEs
   - Fornece uma interface comum para toda a plataforma

2. **Auth MFE**
   - Gerencia autenticação e autorização
   - Cadastro e login de usuários
   - Gerenciamento de perfis

3. **Chat MFE**
   - Core da aplicação
   - Interface de chat em tempo real
   - Lista de conversas
   - Notificações

4. **Admin MFE**
   - Painel administrativo
   - Gerenciamento de empresas
   - Configurações da plataforma
   - Relatórios e análises

### Backend

1. **API Gateway**
   - Intermediário entre o frontend e os serviços externos
   - Gerencia autenticação e autorização
   - Roteamento de requisições

2. **Supabase**
   - Banco de dados PostgreSQL
   - Autenticação de usuários
   - Armazenamento de mensagens
   - Realtime para atualizações em tempo real

3. **n8n**
   - Automação de fluxos de trabalho
   - Processamento de IA para mensagens
   - Integração com serviços externos

## Fluxo de Dados

1. **Autenticação**
   - Usuário se autentica através do Auth MFE
   - Supabase gerencia tokens e sessões
   - Container App armazena o token de autenticação

2. **Chat**
   - Chat MFE exibe lista de conversas do usuário
   - Ao selecionar uma conversa, as mensagens são carregadas do Supabase
   - Novas mensagens são enviadas para o API Gateway
   - API Gateway salva a mensagem no Supabase e notifica o n8n
   - n8n processa a mensagem com IA, se configurado
   - Supabase Realtime notifica o frontend sobre novas mensagens

3. **Administração**
   - Admin MFE permite gerenciar empresas e configurações
   - Configurações são salvas no Supabase
   - Relatórios são gerados a partir dos dados no Supabase

## Tecnologias

- **Frontend**: React, Module Federation, Material UI
- **Backend**: Node.js, Express
- **Banco de Dados**: Supabase (PostgreSQL)
- **Automação**: n8n
- **Comunicação em Tempo Real**: Supabase Realtime

## Escalabilidade

A arquitetura de Micro Frontend permite:

1. **Desenvolvimento Independente**: Cada MFE pode ser desenvolvido e implantado independentemente
2. **Escalabilidade Horizontal**: Cada MFE pode ser escalado conforme necessário
3. **Extensibilidade**: Novos MFEs podem ser adicionados sem modificar os existentes

## Segurança

1. **Autenticação**: Gerenciada pelo Supabase com JWT
2. **Autorização**: Políticas de segurança no nível de linha (RLS) no Supabase
3. **API Gateway**: Validação de tokens e controle de acesso

## Monitoramento

1. **Logs**: Cada componente gera logs para depuração
2. **Métricas**: Monitoramento de desempenho e uso
3. **Alertas**: Notificações para eventos críticos