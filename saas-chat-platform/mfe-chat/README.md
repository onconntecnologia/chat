# Chat MFE

Este é o Micro Frontend de Chat, que é o core da plataforma SaaS de atendimento.

## Funcionalidades

- Lista de conversas
- Interface de chat em tempo real
- Integração com Supabase para armazenamento de mensagens
- Integração com n8n para processamento de IA

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis
- `src/pages`: Páginas da aplicação
- `src/services`: Serviços para comunicação com APIs

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure o Supabase:
   - Edite o arquivo `src/services/supabaseClient.js` com suas credenciais

3. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```

## Integração com Container

Este MFE é exposto através do Module Federation e pode ser carregado pelo Container App.