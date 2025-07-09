import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { userData, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    return isAuthenticated && userData?.role === role;
  };

  const hasAnyRole = (roles) => {
    return isAuthenticated && roles.includes(userData?.role);
  };

  const canAccessCompany = (companyId) => {
    if (!isAuthenticated || !userData) return false;
    
    // Admin pode acessar qualquer empresa
    if (userData.role === 'admin') return true;
    
    // Outros usuários só podem acessar sua própria empresa
    return userData.company_id === companyId;
  };

  const canManageUsers = () => {
    return hasAnyRole(['admin', 'company_admin']);
  };

  const canManageCompany = () => {
    return hasAnyRole(['admin', 'company_admin']);
  };

  const canAccessAdminPanel = () => {
    return hasRole('admin');
  };

  const canHandleChats = () => {
    return hasAnyRole(['admin', 'company_admin', 'agent']);
  };

  return {
    hasRole,
    hasAnyRole,
    canAccessCompany,
    canManageUsers,
    canManageCompany,
    canAccessAdminPanel,
    canHandleChats,
  };
};