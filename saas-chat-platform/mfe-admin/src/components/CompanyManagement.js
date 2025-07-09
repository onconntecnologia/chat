import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useAdmin } from '../contexts/AdminContext';
import CompanyForm from './CompanyForm';
import CompanyDetails from './CompanyDetails';

const CompanyManagement = () => {
  const { state, actions } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCompanyId, setMenuCompanyId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    // Dados mock para demonstração
    const mockCompanies = [
      {
        id: '1',
        name: 'Tech Solutions Ltda',
        email: 'contato@techsolutions.com',
        plan: 'premium',
        max_users: 50,
        is_active: true,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Inovação Digital',
        email: 'admin@inovacaodigital.com',
        plan: 'enterprise',
        max_users: 100,
        is_active: true,
        created_at: '2024-01-10T14:20:00Z'
      },
      {
        id: '3',
        name: 'StartUp Criativa',
        email: 'hello@startupcriativa.com',
        plan: 'basic',
        max_users: 10,
        is_active: false,
        created_at: '2024-01-05T09:15:00Z'
      }
    ];

    // Simular carregamento
    setTimeout(() => {
      actions.setCompanies({
        companies: mockCompanies.filter(c => 
          !searchTerm || 
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        currentPage: 1,
        totalPages: 1,
        total: mockCompanies.length
      });
    }, 500);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateCompany = () => {
    setSelectedCompany(null);
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setDialogMode('edit');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setDialogMode('view');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await actions.deleteCompany(companyToDelete.id);
        setDeleteConfirmOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  const handleToggleStatus = async (company) => {
    try {
      await actions.toggleCompanyStatus(company.id, !company.is_active);
    } catch (error) {
      // Error is handled by context
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event, companyId) => {
    setAnchorEl(event.currentTarget);
    setMenuCompanyId(companyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCompanyId(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCompany(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (dialogMode === 'create') {
        await actions.createCompany(formData);
      } else if (dialogMode === 'edit') {
        await actions.updateCompany(selectedCompany.id, formData);
      }
      handleDialogClose();
    } catch (error) {
      // Error is handled by context
    }
  };

  const handlePageChange = (newPage) => {
    actions.loadCompanies(newPage + 1, searchTerm);
  };

  const getStatusChip = (isActive) => {
    return (
      <Chip
        label={isActive ? 'Ativa' : 'Inativa'}
        color={isActive ? 'success' : 'default'}
        size="small"
      />
    );
  };

  const getPlanChip = (plan) => {
    const colors = {
      basic: 'default',
      premium: 'primary',
      enterprise: 'secondary'
    };
    
    const labels = {
      basic: 'Básico',
      premium: 'Premium',
      enterprise: 'Enterprise'
    };

    return (
      <Chip
        label={labels[plan] || plan}
        color={colors[plan] || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'plan',
      headerName: 'Plano',
      width: 120,
      renderCell: (params) => getPlanChip(params.value)
    },
    {
      field: 'max_users',
      headerName: 'Max Usuários',
      width: 120,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: 'created_at',
      headerName: 'Criado em',
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString('pt-BR')
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, params.row.id)}
        >
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];

  const currentCompany = state.companies.find(c => c.id === menuCompanyId);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Gerenciamento de Empresas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCompany}
          >
            Nova Empresa
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        {state.companiesError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.companiesError}
          </Alert>
        )}

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={state.companies}
            columns={columns}
            loading={state.companiesLoading}
            paginationMode="server"
            rowCount={state.companiesPagination.total}
            page={state.companiesPagination.currentPage - 1}
            pageSize={state.companiesPagination.limit}
            onPageChange={handlePageChange}
            disableSelectionOnClick
            disableColumnMenu
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewCompany(currentCompany)}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => handleEditCompany(currentCompany)}>
          <EditIcon sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(currentCompany)}>
          {currentCompany?.is_active ? (
            <>
              <ToggleOffIcon sx={{ mr: 1 }} />
              Desativar
            </>
          ) : (
            <>
              <ToggleOnIcon sx={{ mr: 1 }} />
              Ativar
            </>
          )}
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteCompany(currentCompany)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Dialog para Criar/Editar/Visualizar Empresa */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Nova Empresa'}
          {dialogMode === 'edit' && 'Editar Empresa'}
          {dialogMode === 'view' && 'Detalhes da Empresa'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            <CompanyDetails company={selectedCompany} />
          ) : (
            <CompanyForm
              company={selectedCompany}
              onSubmit={handleFormSubmit}
              onCancel={handleDialogClose}
              loading={state.loading}
            />
          )}
        </DialogContent>
        {dialogMode === 'view' && (
          <DialogActions>
            <Button onClick={handleDialogClose}>Fechar</Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a empresa "{companyToDelete?.name}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={state.loading}
          >
            {state.loading ? <CircularProgress size={20} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      {state.error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={actions.clearMessages}>
          {state.error}
        </Alert>
      )}
      {state.success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={actions.clearMessages}>
          {state.success}
        </Alert>
      )}
    </Box>
  );
};

export default CompanyManagement;