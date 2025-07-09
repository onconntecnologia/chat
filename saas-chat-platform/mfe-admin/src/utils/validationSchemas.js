import * as yup from 'yup';

export const companySchema = yup.object({
  name: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  phone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX')
    .nullable(),
  website: yup
    .string()
    .url('Website deve ser uma URL válida')
    .nullable(),
  address: yup
    .string()
    .max(255, 'Endereço deve ter no máximo 255 caracteres')
    .nullable(),
  city: yup
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .nullable(),
  state: yup
    .string()
    .length(2, 'Estado deve ter 2 caracteres')
    .nullable(),
  zip_code: yup
    .string()
    .matches(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato XXXXX-XXX')
    .nullable(),
  plan: yup
    .string()
    .oneOf(['basic', 'premium', 'enterprise'], 'Plano inválido')
    .required('Plano é obrigatório'),
  max_users: yup
    .number()
    .positive('Número máximo de usuários deve ser positivo')
    .integer('Número máximo de usuários deve ser um número inteiro')
    .required('Número máximo de usuários é obrigatório'),
  max_chats_per_month: yup
    .number()
    .positive('Número máximo de chats deve ser positivo')
    .integer('Número máximo de chats deve ser um número inteiro')
    .required('Número máximo de chats é obrigatório'),
});

export const userSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  role: yup
    .string()
    .oneOf(['admin', 'company_admin', 'agent', 'customer'], 'Role inválido')
    .required('Role é obrigatório'),
  company_id: yup
    .string()
    .uuid('ID da empresa inválido')
    .when('role', {
      is: (role) => role !== 'admin',
      then: (schema) => schema.required('Empresa é obrigatória para este role'),
      otherwise: (schema) => schema.nullable(),
    }),
  phone: yup
    .string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX')
    .nullable(),
  department: yup
    .string()
    .max(100, 'Departamento deve ter no máximo 100 caracteres')
    .nullable(),
});

export const aiConfigurationSchema = yup.object({
  company_id: yup
    .string()
    .uuid('ID da empresa inválido')
    .required('Empresa é obrigatória'),
  is_enabled: yup
    .boolean()
    .required('Status da IA é obrigatório'),
  model: yup
    .string()
    .oneOf(['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'], 'Modelo inválido')
    .required('Modelo é obrigatório'),
  max_tokens: yup
    .number()
    .positive('Número máximo de tokens deve ser positivo')
    .integer('Número máximo de tokens deve ser um número inteiro')
    .max(4000, 'Número máximo de tokens não pode exceder 4000')
    .required('Número máximo de tokens é obrigatório'),
  temperature: yup
    .number()
    .min(0, 'Temperatura deve ser entre 0 e 2')
    .max(2, 'Temperatura deve ser entre 0 e 2')
    .required('Temperatura é obrigatória'),
  system_prompt: yup
    .string()
    .max(1000, 'Prompt do sistema deve ter no máximo 1000 caracteres')
    .nullable(),
  auto_response_enabled: yup
    .boolean()
    .required('Status de resposta automática é obrigatório'),
  response_delay_seconds: yup
    .number()
    .min(0, 'Delay deve ser positivo')
    .max(300, 'Delay não pode exceder 300 segundos')
    .integer('Delay deve ser um número inteiro')
    .required('Delay de resposta é obrigatório'),
});

export const integrationSchema = yup.object({
  company_id: yup
    .string()
    .uuid('ID da empresa inválido')
    .required('Empresa é obrigatória'),
  type: yup
    .string()
    .oneOf(['whatsapp', 'telegram', 'facebook', 'instagram', 'website'], 'Tipo de integração inválido')
    .required('Tipo de integração é obrigatório'),
  name: yup
    .string()
    .required('Nome da integração é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  config: yup
    .object()
    .required('Configuração é obrigatória'),
  webhook_url: yup
    .string()
    .url('URL do webhook deve ser válida')
    .nullable(),
  is_active: yup
    .boolean()
    .required('Status da integração é obrigatório'),
});

export const searchSchema = yup.object({
  query: yup
    .string()
    .max(100, 'Busca deve ter no máximo 100 caracteres'),
  page: yup
    .number()
    .positive('Página deve ser positiva')
    .integer('Página deve ser um número inteiro')
    .default(1),
  limit: yup
    .number()
    .positive('Limite deve ser positivo')
    .integer('Limite deve ser um número inteiro')
    .max(100, 'Limite não pode exceder 100')
    .default(10),
});

export const dateRangeSchema = yup.object({
  startDate: yup
    .date()
    .required('Data inicial é obrigatória'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'Data final deve ser posterior à data inicial')
    .required('Data final é obrigatória'),
});