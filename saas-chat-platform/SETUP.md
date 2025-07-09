# Configuração da Plataforma SaaS de Chat

Este documento contém instruções para configurar os serviços externos necessários para a plataforma SaaS de chat.

## Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com/) e crie um novo projeto.

2. No SQL Editor do Supabase, execute o script `supabase-schema.sql` para criar as tabelas e configurações necessárias.

3. Obtenha as credenciais do Supabase:
   - URL do projeto
   - Chave anônima (para o frontend)
   - Chave de serviço (para o backend)

4. Configure as credenciais:
   - No arquivo `.env` do API Gateway
   - No arquivo `src/services/supabaseClient.js` do MFE de Chat
   - No arquivo `.env` do MFE de Autenticação
   - No arquivo `.env` do MFE de Administração

## Configuração do n8n

1. Configure uma instância do [n8n](https://n8n.io/), seja localmente ou na nuvem.

2. Importe o fluxo de trabalho `n8n-workflow.json`.

3. Configure as credenciais do Supabase no n8n:
   - URL do projeto
   - Chave de serviço

4. Configure as credenciais da OpenAI no n8n (para processamento de IA).

5. Ative o webhook e obtenha a URL.

6. Configure a URL do webhook no arquivo `.env` do API Gateway.

## Configuração do Ambiente de Desenvolvimento

1. Instale as dependências:
   ```
   npm run install:all
   ```

2. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env` em cada MFE
   - Configure as credenciais do Supabase

3. Inicie os serviços:
   ```
   npm start
   ```

   Isso iniciará:
   - Container (porta 12000)
   - MFE Auth (porta 12001)
   - MFE Chat (porta 12002)
   - MFE Admin (porta 12003)
   - API Gateway (porta 3001)

## Estrutura do Banco de Dados

### Tabelas Principais

- `companies`: Empresas que utilizam a plataforma
- `users`: Usuários da plataforma (administradores, agentes, etc.)
- `customers`: Clientes das empresas
- `chats`: Conversas entre clientes e agentes
- `messages`: Mensagens trocadas nas conversas
- `ai_configurations`: Configurações de IA para cada empresa
- `integrations`: Integrações externas configuradas pelas empresas

### Relacionamentos

- Uma empresa tem muitos usuários
- Uma empresa tem muitos clientes
- Um cliente pertence a uma empresa
- Um chat pertence a uma empresa e envolve um cliente e um agente
- Uma mensagem pertence a um chat

## Fluxo de Processamento de IA

1. Cliente envia uma mensagem
2. API Gateway salva a mensagem no Supabase
3. API Gateway envia a mensagem para o n8n
4. n8n verifica se a empresa tem IA habilitada
5. n8n obtém o histórico recente da conversa
6. n8n gera uma resposta usando a OpenAI
7. n8n salva a resposta como uma nova mensagem no Supabase
8. Frontend recebe a nova mensagem em tempo real via Supabase Realtime