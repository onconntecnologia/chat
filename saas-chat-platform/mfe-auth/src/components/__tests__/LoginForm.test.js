import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginForm from '../LoginForm';
import { AuthProvider } from '../../contexts/AuthContext';

const theme = createTheme();

const MockAuthProvider = ({ children, mockSignIn = jest.fn() }) => {
  const mockValue = {
    signIn: mockSignIn,
    error: null,
    clearError: jest.fn(),
  };

  return (
    <AuthProvider value={mockValue}>
      {children}
    </AuthProvider>
  );
};

const renderWithProviders = (component, { mockSignIn } = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <MockAuthProvider mockSignIn={mockSignIn}>
        {component}
      </MockAuthProvider>
    </ThemeProvider>
  );
};

describe('LoginForm', () => {
  test('renders login form elements', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  test('calls signIn when form is submitted with valid data', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({});
    renderWithProviders(<LoginForm />, { mockSignIn });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('toggles password visibility', () => {
    renderWithProviders(<LoginForm />);
    
    const passwordInput = screen.getByLabelText(/senha/i);
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});