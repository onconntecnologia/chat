import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';

// Lazy load MFEs
const AuthApp = React.lazy(() => import('./mfeComponents/AuthApp'));
const ChatApp = React.lazy(() => import('./mfeComponents/ChatApp'));
const AdminApp = React.lazy(() => import('./mfeComponents/AdminApp'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <React.Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth/*" element={<AuthApp />} />
            <Route path="/chat/*" element={<ChatApp />} />
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </React.Suspense>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;