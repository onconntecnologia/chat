# Plataforma SaaS de Atendimento ao Cliente

Uma plataforma SaaS de atendimento ao cliente com foco em chat, onde empresas podem atender seus clientes através de uma interface moderna e intuitiva. A plataforma utiliza arquitetura de Micro Frontend (MFE) para permitir escalabilidade e adição de novos recursos no futuro.

## Características Principais

- **Arquitetura MFE**: Permite desenvolvimento independente e escalabilidade
- **Chat em Tempo Real**: Core da plataforma para atendimento ao cliente
- **Integração com IA**: Processamento de mensagens com n8n e OpenAI
- **Multi-tenant**: Suporte para múltiplas empresas na mesma plataforma
- **Responsivo**: Interface adaptável para desktop e dispositivos móveis

## Tecnologias Utilizadas

- **Frontend**: React, Material UI, Module Federation
- **Backend**: Node.js, Express
- **Banco de Dados**: Supabase (PostgreSQL)
- **Automação**: n8n para fluxos de IA
- **Comunicação em Tempo Real**: Supabase Realtime

## Estrutura do Projeto

```
saas-chat-platform/
├── container/             # Aplicação principal que carrega os MFEs
├── mfe-auth/              # MFE de autenticação (a ser implementado)
├── mfe-chat/              # MFE de chat (core da plataforma)
├── mfe-admin/             # MFE de administração (a ser implementado)
├── api-gateway/           # API Gateway para comunicação com serviços externos
├── supabase-schema.sql    # Estrutura do banco de dados Supabase
├── n8n-workflow.json      # Fluxo de trabalho n8n para processamento de IA
├── ARCHITECTURE.md        # Documentação da arquitetura
└── SETUP.md               # Instruções de configuração
```

## Níveis de Acesso

1. **Administrador da Plataforma**
   - Acesso total à plataforma
   - Gerenciamento de empresas
   - Configurações globais

2. **Administrador da Empresa**
   - Gerenciamento de agentes
   - Configurações da empresa
   - Relatórios e análises

3. **Agente**
   - Atendimento aos clientes
   - Visualização de histórico de conversas
   - Acesso às ferramentas de atendimento

4. **Cliente**
   - Iniciar conversas
   - Enviar mensagens
   - Visualizar histórico de conversas próprias

## Instalação e Configuração

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/saas-chat-platform.git
   cd saas-chat-platform
   ```

2. Instale as dependências:
   ```
   npm run install:all
   ```

3. Configure o Supabase e o n8n (veja SETUP.md para detalhes)

4. Inicie a aplicação:
   ```
   npm start
   ```

## Documentação

- [Arquitetura](ARCHITECTURE.md): Detalhes sobre a arquitetura da plataforma
- [Configuração](SETUP.md): Instruções para configurar o Supabase e o n8n

## Roadmap

- [x] Estrutura básica do projeto
- [x] Container App
- [x] MFE de Chat
- [x] API Gateway
- [ ] MFE de Autenticação
- [ ] MFE de Administração
- [ ] Integração completa com Supabase
- [ ] Integração completa com n8n
- [ ] Testes automatizados
- [ ] Documentação completa
- [ ] Deploy em produção
