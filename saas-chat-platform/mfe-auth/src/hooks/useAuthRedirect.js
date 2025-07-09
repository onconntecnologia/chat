import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && location.pathname === '/login') {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else if (!isAuthenticated && location.pathname !== '/login') {
        navigate('/login', { 
          replace: true, 
          state: { from: location } 
        });
      }
    }
  }, [isAuthenticated, loading, location, navigate]);

  return { isAuthenticated, loading };
};