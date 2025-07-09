import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatList from './pages/ChatList';
import ChatWindow from './pages/ChatWindow';

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
        <Routes>
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<ChatWindow />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;