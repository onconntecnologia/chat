-- Estrutura do banco de dados para a plataforma SaaS de chat

-- Tabela de empresas
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'expired', 'cancelled')),
  subscription_expiry TIMESTAMP WITH TIME ZONE
);

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auth_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company_id UUID REFERENCES companies(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'company_admin', 'agent', 'customer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'online', 'offline', 'away')),
  last_seen TIMESTAMP WITH TIME ZONE
);

-- Tabela de clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  metadata JSONB
);

-- Tabela de chats
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  company_id UUID REFERENCES companies(id) NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  agent_id UUID REFERENCES users(id),
  metadata JSONB
);

-- Tabela de mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  chat_id UUID REFERENCES chats(id) NOT NULL,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('agent', 'customer', 'system', 'ai')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Tabela de configurações de IA
CREATE TABLE ai_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE,
  model TEXT DEFAULT 'gpt-3.5-turbo',
  temperature FLOAT DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 500,
  prompt_template TEXT,
  trigger_conditions JSONB,
  metadata JSONB
);

-- Tabela de integrações
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('n8n', 'zapier', 'make', 'webhook', 'api')),
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE
);

-- Índices
CREATE INDEX idx_chats_company_id ON chats(company_id);
CREATE INDEX idx_chats_customer_id ON chats(customer_id);
CREATE INDEX idx_chats_agent_id ON chats(agent_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_customers_company_id ON customers(company_id);

-- Funções e Triggers

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp de updated_at em todas as tabelas
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_ai_configurations_updated_at
BEFORE UPDATE ON ai_configurations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Função para notificar sobre novas mensagens
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_message',
    json_build_object(
      'id', NEW.id,
      'chat_id', NEW.chat_id,
      'sender_id', NEW.sender_id,
      'sender_type', NEW.sender_type,
      'content', NEW.content,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar sobre novas mensagens
CREATE TRIGGER notify_new_message_trigger
AFTER INSERT ON messages
FOR EACH ROW EXECUTE PROCEDURE notify_new_message();

-- Políticas de segurança RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Política para administradores da plataforma (acesso total)
CREATE POLICY admin_all_access ON companies TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Política para empresas (acesso apenas aos seus próprios dados)
CREATE POLICY company_access ON companies TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.company_id = companies.id
  )
);

-- Política para usuários (acesso baseado na empresa)
CREATE POLICY users_company_access ON users TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid()
    AND (
      u.role = 'admin'
      OR u.company_id = users.company_id
      OR u.id = users.id
    )
  )
);

-- Política para clientes (acesso baseado na empresa)
CREATE POLICY customers_company_access ON customers TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND (
      users.role = 'admin'
      OR users.company_id = customers.company_id
      OR users.id = customers.user_id
    )
  )
);

-- Política para chats (acesso baseado na empresa, agente ou cliente)
CREATE POLICY chats_access ON chats TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND (
      users.role = 'admin'
      OR users.company_id = chats.company_id
      OR users.id = chats.agent_id
      OR EXISTS (
        SELECT 1 FROM customers
        WHERE customers.user_id = users.id
        AND customers.id = chats.customer_id
      )
    )
  )
);

-- Política para mensagens (acesso baseado no chat)
CREATE POLICY messages_access ON messages TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chats
    JOIN users ON (
      users.auth_id = auth.uid()
      AND (
        users.role = 'admin'
        OR users.company_id = chats.company_id
        OR users.id = chats.agent_id
        OR EXISTS (
          SELECT 1 FROM customers
          WHERE customers.user_id = users.id
          AND customers.id = chats.customer_id
        )
      )
    )
    WHERE chats.id = messages.chat_id
  )
);

-- Política para configurações de IA (acesso baseado na empresa)
CREATE POLICY ai_configurations_access ON ai_configurations TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND (
      users.role = 'admin'
      OR (users.role = 'company_admin' AND users.company_id = ai_configurations.company_id)
    )
  )
);

-- Política para integrações (acesso baseado na empresa)
CREATE POLICY integrations_access ON integrations TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND (
      users.role = 'admin'
      OR (users.role = 'company_admin' AND users.company_id = integrations.company_id)
    )
  )
);