import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Paper,
  Container,
  Badge,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { getChats } from '../services/chatService';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulando um usuário logado
  const currentUserId = '1';

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatData = await getChats(currentUserId);
        setChats(chatData);
        setFilteredChats(chatData);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [currentUserId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = chats.filter(
        (chat) =>
          chat.customers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (chat.title && chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }, [searchTerm, chats]);

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };

  // Dados simulados para demonstração
  const mockChats = [
    {
      id: '1',
      updated_at: new Date().toISOString(),
      customers: { name: 'João Silva' },
      title: 'Suporte Técnico',
      unread_count: 3,
    },
    {
      id: '2',
      updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      customers: { name: 'Maria Oliveira' },
      title: 'Dúvida sobre Produto',
      unread_count: 0,
    },
    {
      id: '3',
      updated_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
      customers: { name: 'Pedro Santos' },
      title: 'Reclamação',
      unread_count: 1,
    },
  ];

  // Use mockChats se não houver dados reais
  const displayChats = filteredChats.length > 0 ? filteredChats : mockChats;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="h1" gutterBottom>
            Conversas
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar conversa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {displayChats.map((chat) => (
            <React.Fragment key={chat.id}>
              <ListItem
                button
                component={RouterLink}
                to={`/chat/${chat.id}`}
                alignItems="flex-start"
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Badge
                    color="error"
                    badgeContent={chat.unread_count}
                    invisible={!chat.unread_count}
                  >
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" component="span">
                        {chat.customers.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(chat.updated_at)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        display: 'inline',
                        fontWeight: chat.unread_count ? 'bold' : 'normal',
                      }}
                    >
                      {chat.title}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ChatList;