import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Container,
  Avatar,
  AppBar,
  Toolbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import {
  getChatById,
  getMessages,
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead,
} from '../services/chatService';

const ChatWindow = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Simulando um usuário logado
  const currentUserId = '1';
  const currentUserType = 'agent';

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatData = await getChatById(chatId);
        setChat(chatData);

        const messagesData = await getMessages(chatId);
        setMessages(messagesData);

        // Marcar mensagens como lidas
        await markMessagesAsRead(chatId, currentUserId);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();

    // Inscrever-se para novas mensagens
    const subscription = subscribeToMessages(chatId, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Se a mensagem não for do usuário atual, marcar como lida
      if (newMessage.sender_id !== currentUserId) {
        markMessagesAsRead(chatId, currentUserId);
      }
    });

    return () => {
      // Cancelar inscrição ao desmontar
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [chatId, currentUserId]);

  useEffect(() => {
    // Rolar para o final quando as mensagens mudarem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content) => {
    try {
      const newMessage = await sendMessage(
        chatId,
        currentUserId,
        currentUserType,
        content
      );
      
      // A mensagem será adicionada via subscription
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Dados simulados para demonstração
  const mockChat = {
    id: chatId,
    customers: { name: 'João Silva' },
    title: 'Suporte Técnico',
  };

  const mockMessages = [
    {
      id: '1',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender_id: '2',
      sender_type: 'customer',
      content: 'Olá, estou com um problema no meu pedido.',
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 3500000).toISOString(),
      sender_id: '1',
      sender_type: 'agent',
      content: 'Olá! Em que posso ajudar?',
    },
    {
      id: '3',
      created_at: new Date(Date.now() - 3400000).toISOString(),
      sender_id: '2',
      sender_type: 'customer',
      content: 'Meu pedido está atrasado há 3 dias.',
    },
    {
      id: '4',
      created_at: new Date(Date.now() - 3300000).toISOString(),
      sender_id: '1',
      sender_type: 'agent',
      content: 'Vou verificar isso para você. Pode me informar o número do pedido?',
    },
  ];

  // Use mockChat e mockMessages se não houver dados reais
  const displayChat = chat || mockChat;
  const displayMessages = messages.length > 0 ? messages : mockMessages;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="voltar"
              component={RouterLink}
              to="/chat"
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" component="div">
                {displayChat.customers.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {displayChat.title}
              </Typography>
            </Box>
            <IconButton edge="end" color="inherit" aria-label="menu">
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Divider />

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {displayMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.sender_id === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <ChatInput onSendMessage={handleSendMessage} />
      </Paper>
    </Container>
  );
};

export default ChatWindow;