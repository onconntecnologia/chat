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
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { companySchema } from '../utils/validationSchemas';

const CompanyForm = ({ company, onSubmit, onCancel, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      email: company?.email || '',
      phone: company?.phone || '',
      website: company?.website || '',
      address: company?.address || '',
      city: company?.city || '',
      state: company?.state || '',
      zip_code: company?.zip_code || '',
      plan: company?.plan || 'basic',
      max_users: company?.max_users || 10,
      max_chats_per_month: company?.max_chats_per_month || 1000,
    }
  });

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

  const formatZipCode = (value) => {
    if (!value) return value;
    const zipCode = value.replace(/[^\d]/g, '');
    if (zipCode.length <= 5) return zipCode;
    return `${zipCode.slice(0, 5)}-${zipCode.slice(5, 8)}`;
  };

  const planOptions = [
    { value: 'basic', label: 'Básico' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const stateOptions = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Informações Básicas */}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome da Empresa"
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

        <Grid item xs={12}>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Website"
                placeholder="https://www.exemplo.com"
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            )}
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={12}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Endereço"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Cidade"
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>Estado</InputLabel>
                <Select {...field} label="Estado">
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {stateOptions.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <FormHelperText>{errors.state.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="zip_code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="CEP"
                placeholder="12345-678"
                error={!!errors.zip_code}
                helperText={errors.zip_code?.message}
                onChange={(e) => field.onChange(formatZipCode(e.target.value))}
              />
            )}
          />
        </Grid>

        {/* Configurações do Plano */}
        <Grid item xs={12} md={4}>
          <Controller
            name="plan"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.plan}>
                <InputLabel>Plano</InputLabel>
                <Select {...field} label="Plano" required>
                  {planOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.plan && (
                  <FormHelperText>{errors.plan.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="max_users"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Máximo de Usuários"
                type="number"
                error={!!errors.max_users}
                helperText={errors.max_users?.message}
                required
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="max_chats_per_month"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Máximo de Chats/Mês"
                type="number"
                error={!!errors.max_chats_per_month}
                helperText={errors.max_chats_per_month?.message}
                required
                InputProps={{
                  inputProps: { min: 1 }
                }}
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
          {loading ? 'Salvando...' : company ? 'Atualizar' : 'Criar'}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyForm;