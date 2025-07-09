# API Gateway

API Gateway para a plataforma SaaS de atendimento, responsável por intermediar a comunicação entre os MFEs e os serviços externos (Supabase e n8n).

## Funcionalidades

- Gerenciamento de chats e mensagens
- Integração com Supabase para armazenamento de dados
- Integração com n8n para processamento de IA

## Estrutura do Projeto

- `src/controllers`: Controladores para as rotas
- `src/routes`: Definição das rotas da API
- `src/services`: Serviços para comunicação com APIs externas

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Edite o arquivo `.env` com suas credenciais

3. Inicie o servidor:
   ```
   npm start
   ```

   Ou para desenvolvimento:
   ```
   npm run dev
   ```

## Endpoints

### Chats

- `GET /api/users/:userId/type/:userType/chats`: Obter todos os chats de um usuário
- `GET /api/chats/:chatId`: Obter um chat específico
- `POST /api/chats`: Criar um novo chat

### Mensagens

- `GET /api/chats/:chatId/messages`: Obter mensagens de um chat
- `POST /api/chats/:chatId/messages`: Enviar uma mensagem
- `POST /api/chats/:chatId/read`: Marcar mensagens como lidas