import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from '../utils/validationSchemas';

const UserForm = ({ user, companies = [], onSubmit, onCancel, loading = false }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'customer',
      company_id: user?.company_id || '',
      phone: user?.phone || '',
      department: user?.department || '',
    }
  });

  const watchedRole = watch('role');

  const formatPhone = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'company_admin', label: 'Administrador da Empresa' },
    { value: 'agent', label: 'Agente' },
    { value: 'customer', label: 'Cliente' }
  ];

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  const requiresCompany = watchedRole && watchedRole !== 'admin';

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome Completo"
                error={!!errors.name}
                helperText={errors.name?.message}
                required
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                required
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Função</InputLabel>
                <Select {...field} label="Função" required>
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.company_id}>
                <InputLabel>Empresa</InputLabel>
                <Select 
                  {...field} 
                  label="Empresa" 
                  required={requiresCompany}
                  disabled={!requiresCompany}
                >
                  <MenuItem value="">
                    <em>Selecione uma empresa</em>
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.company_id && (
                  <FormHelperText>{errors.company_id.message}</FormHelperText>
                )}
                {!requiresCompany && (
                  <FormHelperText>
                    Administradores não precisam estar vinculados a uma empresa
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Informações de Contato */}
        <Grid item xs={12} md={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Telefone"
                placeholder="(11) 99999-9999"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                onChange={(e) => field.onChange(formatPhone(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Departamento"
                error={!!errors.department}
                helperText={errors.department?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Botões de Ação */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;