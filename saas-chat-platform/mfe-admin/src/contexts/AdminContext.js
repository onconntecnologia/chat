import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AdminContext = createContext();

const initialState = {
  // Dashboard
  dashboardStats: null,
  
  // Companies
  companies: [],
  companiesLoading: false,
  companiesError: null,
  companiesPagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  },
  
  // Users
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  },
  
  // AI Configurations
  aiConfigurations: [],
  aiConfigurationsLoading: false,
  aiConfigurationsError: null,
  
  // Integrations
  integrations: [],
  integrationsLoading: false,
  integrationsError: null,
  
  // Filters
  companyFilters: {
    search: '',
    status: 'all'
  },
  userFilters: {
    search: '',
    role: 'all',
    companyId: null,
    status: 'all'
  },
  
  // Selected items
  selectedCompany: null,
  selectedUser: null,
  
  // UI State
  loading: false,
  error: null,
  success: null
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, loading: false };
    
    case 'CLEAR_MESSAGES':
      return { ...state, error: null, success: null };
    
    // Dashboard
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    
    // Companies
    case 'SET_COMPANIES_LOADING':
      return { ...state, companiesLoading: action.payload };
    
    case 'SET_COMPANIES':
      return {
        ...state,
        companies: action.payload.companies,
        companiesPagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: state.companiesPagination.limit
        },
        companiesLoading: false,
        companiesError: null
      };
    
    case 'SET_COMPANIES_ERROR':
      return { ...state, companiesError: action.payload, companiesLoading: false };
    
    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [action.payload, ...state.companies],
        companiesPagination: {
          ...state.companiesPagination,
          total: state.companiesPagination.total + 1
        }
      };
    
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id ? action.payload : company
        )
      };
    
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        companiesPagination: {
          ...state.companiesPagination,
          total: state.companiesPagination.total - 1
        }
      };
    
    case 'SET_SELECTED_COMPANY':
      return { ...state, selectedCompany: action.payload };
    
    case 'SET_COMPANY_FILTERS':
      return { ...state, companyFilters: { ...state.companyFilters, ...action.payload } };
    
    // Users
    case 'SET_USERS_LOADING':
      return { ...state, usersLoading: action.payload };
    
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload.users,
        usersPagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: state.usersPagination.limit
        },
        usersLoading: false,
        usersError: null
      };
    
    case 'SET_USERS_ERROR':
      return { ...state, usersError: action.payload, usersLoading: false };
    
    case 'ADD_USER':
      return {
        ...state,
        users: [action.payload, ...state.users],
        usersPagination: {
          ...state.usersPagination,
          total: state.usersPagination.total + 1
        }
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        usersPagination: {
          ...state.usersPagination,
          total: state.usersPagination.total - 1
        }
      };
    
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    
    case 'SET_USER_FILTERS':
      return { ...state, userFilters: { ...state.userFilters, ...action.payload } };
    
    // AI Configurations
    case 'SET_AI_CONFIGURATIONS_LOADING':
      return { ...state, aiConfigurationsLoading: action.payload };
    
    case 'SET_AI_CONFIGURATIONS':
      return {
        ...state,
        aiConfigurations: action.payload,
        aiConfigurationsLoading: false,
        aiConfigurationsError: null
      };
    
    case 'SET_AI_CONFIGURATIONS_ERROR':
      return { ...state, aiConfigurationsError: action.payload, aiConfigurationsLoading: false };
    
    case 'UPDATE_AI_CONFIGURATION':
      return {
        ...state,
        aiConfigurations: state.aiConfigurations.map(config =>
          config.id === action.payload.id ? action.payload : config
        )
      };
    
    // Integrations
    case 'SET_INTEGRATIONS_LOADING':
      return { ...state, integrationsLoading: action.payload };
    
    case 'SET_INTEGRATIONS':
      return {
        ...state,
        integrations: action.payload,
        integrationsLoading: false,
        integrationsError: null
      };
    
    case 'SET_INTEGRATIONS_ERROR':
      return { ...state, integrationsError: action.payload, integrationsLoading: false };
    
    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(integration =>
          integration.id === action.payload.id ? action.payload : integration
        )
      };
    
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Actions
  const actions = {
    // Utility actions
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setSuccess: (message) => dispatch({ type: 'SET_SUCCESS', payload: message }),
    clearMessages: () => dispatch({ type: 'CLEAR_MESSAGES' }),

    // Dashboard actions
    async loadDashboardStats() {
      try {
        const stats = await adminService.getDashboardStats();
        dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    },

    setDashboardStats: (stats) => dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats }),

    // Company actions
    async loadCompanies(page = 1, search = '') {
      dispatch({ type: 'SET_COMPANIES_LOADING', payload: true });
      try {
        const result = await adminService.getCompanies(page, state.companiesPagination.limit, search);
        dispatch({ type: 'SET_COMPANIES', payload: result });
      } catch (error) {
        dispatch({ type: 'SET_COMPANIES_ERROR', payload: error.message });
      }
    },

    async createCompany(companyData) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const newCompany = await adminService.createCompany(companyData);
        dispatch({ type: 'ADD_COMPANY', payload: newCompany });
        dispatch({ type: 'SET_SUCCESS', payload: 'Empresa criada com sucesso!' });
        return newCompany;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async updateCompany(id, updates) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const updatedCompany = await adminService.updateCompany(id, updates);
        dispatch({ type: 'UPDATE_COMPANY', payload: updatedCompany });
        dispatch({ type: 'SET_SUCCESS', payload: 'Empresa atualizada com sucesso!' });
        return updatedCompany;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async deleteCompany(id) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await adminService.deleteCompany(id);
        dispatch({ type: 'DELETE_COMPANY', payload: id });
        dispatch({ type: 'SET_SUCCESS', payload: 'Empresa excluída com sucesso!' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async toggleCompanyStatus(id, isActive) {
      try {
        const updatedCompany = await adminService.toggleCompanyStatus(id, isActive);
        dispatch({ type: 'UPDATE_COMPANY', payload: updatedCompany });
        dispatch({ type: 'SET_SUCCESS', payload: `Empresa ${isActive ? 'ativada' : 'desativada'} com sucesso!` });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    setSelectedCompany: (company) => dispatch({ type: 'SET_SELECTED_COMPANY', payload: company }),
    setCompanyFilters: (filters) => dispatch({ type: 'SET_COMPANY_FILTERS', payload: filters }),
    setCompanies: (data) => dispatch({ type: 'SET_COMPANIES', payload: data }),

    // User actions
    async loadUsers(page = 1, search = '', companyId = null, role = null) {
      dispatch({ type: 'SET_USERS_LOADING', payload: true });
      try {
        const result = await adminService.getUsers(page, state.usersPagination.limit, search, companyId, role);
        dispatch({ type: 'SET_USERS', payload: result });
      } catch (error) {
        dispatch({ type: 'SET_USERS_ERROR', payload: error.message });
      }
    },

    async createUser(userData) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const newUser = await adminService.createUser(userData);
        dispatch({ type: 'ADD_USER', payload: newUser });
        dispatch({ type: 'SET_SUCCESS', payload: 'Usuário criado com sucesso!' });
        return newUser;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async updateUser(id, updates) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const updatedUser = await adminService.updateUser(id, updates);
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        dispatch({ type: 'SET_SUCCESS', payload: 'Usuário atualizado com sucesso!' });
        return updatedUser;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async deleteUser(id) {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await adminService.deleteUser(id);
        dispatch({ type: 'DELETE_USER', payload: id });
        dispatch({ type: 'SET_SUCCESS', payload: 'Usuário excluído com sucesso!' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    async toggleUserStatus(id, isActive) {
      try {
        const updatedUser = await adminService.toggleUserStatus(id, isActive);
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        dispatch({ type: 'SET_SUCCESS', payload: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!` });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    setSelectedUser: (user) => dispatch({ type: 'SET_SELECTED_USER', payload: user }),
    setUserFilters: (filters) => dispatch({ type: 'SET_USER_FILTERS', payload: filters }),
    setUsers: (data) => dispatch({ type: 'SET_USERS', payload: data }),

    // AI Configuration actions
    async loadAIConfigurations(companyId = null) {
      dispatch({ type: 'SET_AI_CONFIGURATIONS_LOADING', payload: true });
      try {
        const configurations = await adminService.getAIConfigurations(companyId);
        dispatch({ type: 'SET_AI_CONFIGURATIONS', payload: configurations });
      } catch (error) {
        dispatch({ type: 'SET_AI_CONFIGURATIONS_ERROR', payload: error.message });
      }
    },

    async updateAIConfiguration(id, updates) {
      try {
        const updatedConfig = await adminService.updateAIConfiguration(id, updates);
        dispatch({ type: 'UPDATE_AI_CONFIGURATION', payload: updatedConfig });
        dispatch({ type: 'SET_SUCCESS', payload: 'Configuração de IA atualizada com sucesso!' });
        return updatedConfig;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    // Integration actions
    async loadIntegrations(companyId = null) {
      dispatch({ type: 'SET_INTEGRATIONS_LOADING', payload: true });
      try {
        const integrations = await adminService.getIntegrations(companyId);
        dispatch({ type: 'SET_INTEGRATIONS', payload: integrations });
      } catch (error) {
        dispatch({ type: 'SET_INTEGRATIONS_ERROR', payload: error.message });
      }
    },

    async toggleIntegration(id, isActive) {
      try {
        const updatedIntegration = await adminService.toggleIntegration(id, isActive);
        dispatch({ type: 'UPDATE_INTEGRATION', payload: updatedIntegration });
        dispatch({ type: 'SET_SUCCESS', payload: `Integração ${isActive ? 'ativada' : 'desativada'} com sucesso!` });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    }
  };

  return (
    <AdminContext.Provider value={{ state, actions }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};