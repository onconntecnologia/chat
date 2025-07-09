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
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useAdmin } from '../contexts/AdminContext';
import UserForm from './UserForm';
import UserDetails from './UserDetails';

const UserManagement = () => {
  const { state, actions } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUserId, setMenuUserId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Dados mock para demonstração
    const mockUsers = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@techsolutions.com',
        role: 'company_admin',
        is_active: true,
        created_at: '2024-01-15T10:30:00Z',
        companies: { name: 'Tech Solutions Ltda' }
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@inovacaodigital.com',
        role: 'agent',
        is_active: true,
        created_at: '2024-01-12T14:20:00Z',
        companies: { name: 'Inovação Digital' }
      },
      {
        id: '3',
        name: 'Pedro Admin',
        email: 'pedro@admin.com',
        role: 'admin',
        is_active: true,
        created_at: '2024-01-01T09:15:00Z',
        companies: null
      },
      {
        id: '4',
        name: 'Ana Costa',
        email: 'ana@startupcriativa.com',
        role: 'customer',
        is_active: false,
        created_at: '2024-01-08T16:45:00Z',
        companies: { name: 'StartUp Criativa' }
      }
    ];

    const mockCompanies = [
      { id: '1', name: 'Tech Solutions Ltda' },
      { id: '2', name: 'Inovação Digital' },
      { id: '3', name: 'StartUp Criativa' }
    ];

    // Simular carregamento
    setTimeout(() => {
      let filteredUsers = mockUsers;
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(u => 
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.role === roleFilter);
      }

      actions.setUsers({
        users: filteredUsers,
        currentPage: 1,
        totalPages: 1,
        total: filteredUsers.length
      });

      actions.setCompanies({
        companies: mockCompanies,
        currentPage: 1,
        totalPages: 1,
        total: mockCompanies.length
      });
    }, 500);
  }, [searchTerm, roleFilter, companyFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogMode('edit');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDialogMode('view');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await actions.deleteUser(userToDelete.id);
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await actions.toggleUserStatus(user.id, !user.is_active);
    } catch (error) {
      // Error is handled by context
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (dialogMode === 'create') {
        await actions.createUser(formData);
      } else if (dialogMode === 'edit') {
        await actions.updateUser(selectedUser.id, formData);
      }
      handleDialogClose();
    } catch (error) {
      // Error is handled by context
    }
  };

  const handlePageChange = (newPage) => {
    actions.loadUsers(newPage + 1, searchTerm, companyFilter === 'all' ? null : companyFilter, roleFilter === 'all' ? null : roleFilter);
  };

  const getStatusChip = (isActive) => {
    return (
      <Chip
        label={isActive ? 'Ativo' : 'Inativo'}
        color={isActive ? 'success' : 'default'}
        size="small"
      />
    );
  };

  const getRoleChip = (role) => {
    const colors = {
      admin: 'error',
      company_admin: 'warning',
      agent: 'info',
      customer: 'default'
    };
    
    const labels = {
      admin: 'Admin',
      company_admin: 'Admin Empresa',
      agent: 'Agente',
      customer: 'Cliente'
    };

    return (
      <Chip
        label={labels[role] || role}
        color={colors[role] || 'default'}
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
          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
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
      field: 'role',
      headerName: 'Função',
      width: 130,
      renderCell: (params) => getRoleChip(params.value)
    },
    {
      field: 'companies',
      headerName: 'Empresa',
      width: 150,
      renderCell: (params) => params.row.companies?.name || 'N/A'
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

  const currentUser = state.users.find(u => u.id === menuUserId);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Gerenciamento de Usuários
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateUser}
            >
              Novo Usuário
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Buscar usuários..."
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

        {/* Filtros */}
        {showFilters && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Função</InputLabel>
                <Select
                  value={roleFilter}
                  label="Função"
                  onChange={handleRoleFilterChange}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="company_admin">Admin Empresa</MenuItem>
                  <MenuItem value="agent">Agente</MenuItem>
                  <MenuItem value="customer">Cliente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Empresa</InputLabel>
                <Select
                  value={companyFilter}
                  label="Empresa"
                  onChange={handleCompanyFilterChange}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {state.companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {state.usersError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.usersError}
          </Alert>
        )}

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={state.users}
            columns={columns}
            loading={state.usersLoading}
            paginationMode="server"
            rowCount={state.usersPagination.total}
            page={state.usersPagination.currentPage - 1}
            pageSize={state.usersPagination.limit}
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
        <MenuItem onClick={() => handleViewUser(currentUser)}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => handleEditUser(currentUser)}>
          <EditIcon sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(currentUser)}>
          {currentUser?.is_active ? (
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
          onClick={() => handleDeleteUser(currentUser)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Dialog para Criar/Editar/Visualizar Usuário */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Novo Usuário'}
          {dialogMode === 'edit' && 'Editar Usuário'}
          {dialogMode === 'view' && 'Detalhes do Usuário'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            <UserDetails user={selectedUser} />
          ) : (
            <UserForm
              user={selectedUser}
              companies={state.companies}
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
            Tem certeza que deseja excluir o usuário "{userToDelete?.name}"?
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

export default UserManagement;