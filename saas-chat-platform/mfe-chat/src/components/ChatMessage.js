import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const MessagePaper = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  maxWidth: '70%',
  borderRadius: isUser
    ? theme.spacing(2, 0, 2, 2)
    : theme.spacing(0, 2, 2, 2),
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
}));

const TimeStamp = styled(Typography)(({ theme, isUser }) => ({
  fontSize: '0.7rem',
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: isUser ? 'right' : 'left',
}));

const ChatMessage = ({ message, isUser }) => {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <MessagePaper isUser={isUser}>
        <Typography variant="body1">{message.content}</Typography>
        <TimeStamp isUser={isUser} variant="caption">
          {formattedTime}
        </TimeStamp>
      </MessagePaper>
    </Box>
  );
};

export default ChatMessage;