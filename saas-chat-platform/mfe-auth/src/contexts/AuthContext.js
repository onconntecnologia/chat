import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          const { user, userData } = await authService.getCurrentUser();
          setUser(user);
          setUserData(userData);
          setSession(session);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            const { user, userData } = await authService.getCurrentUser();
            setUser(user);
            setUserData(userData);
          } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
            setError(error.message);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signIn(email, password);
      setUser(result.user);
      setUserData(result.userData);
      setSession(result.session);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signUp(email, password, userData);
      
      if (!result.needsEmailConfirmation) {
        setUser(result.user);
        setUserData(result.userData);
        setSession(result.session);
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
      setUserData(null);
      setSession(null);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      await authService.updatePassword(newPassword);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const updatedUserData = await authService.updateProfile(updates);
      setUserData(updatedUserData);
      return updatedUserData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user && !!session;
  const isAdmin = userData?.role === 'admin';
  const isCompanyAdmin = userData?.role === 'company_admin';
  const isAgent = userData?.role === 'agent';
  const isCustomer = userData?.role === 'customer';

  const value = {
    // Estado
    user,
    userData,
    session,
    loading,
    error,
    isAuthenticated,
    
    // Roles
    isAdmin,
    isCompanyAdmin,
    isAgent,
    isCustomer,
    
    // Métodos
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;