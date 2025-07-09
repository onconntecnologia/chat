import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
  role: yup
    .string()
    .oneOf(['customer', 'agent', 'company_admin'], 'Tipo de usuário inválido')
    .required('Tipo de usuário é obrigatório'),
});

export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
});

export const updatePasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Nova senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é obrigatório'),
});