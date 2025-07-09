import supabase from './supabaseClient';

export const getChats = async (userId) => {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      id,
      created_at,
      updated_at,
      title,
      status,
      company_id,
      customer_id,
      agent_id,
      customers(id, name, email),
      companies(id, name)
    `)
    .eq('agent_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    return [];
  }

  return data;
};

export const getChatById = async (chatId) => {
  const { data, error } = await supabase
    .from('chats')
    .select(`
      id,
      created_at,
      updated_at,
      title,
      status,
      company_id,
      customer_id,
      agent_id,
      customers(id, name, email),
      companies(id, name)
    `)
    .eq('id', chatId)
    .single();

  if (error) {
    console.error('Error fetching chat:', error);
    return null;
  }

  return data;
};

export const getMessages = async (chatId) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      created_at,
      chat_id,
      sender_id,
      sender_type,
      content,
      is_read
    `)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data;
};

export const sendMessage = async (chatId, senderId, senderType, content) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        chat_id: chatId,
        sender_id: senderId,
        sender_type: senderType,
        content,
        is_read: false,
      },
    ])
    .select();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  // Atualiza o timestamp do chat
  await supabase
    .from('chats')
    .update({ updated_at: new Date() })
    .eq('id', chatId);

  return data[0];
};

export const subscribeToMessages = (chatId, callback) => {
  return supabase
    .channel(`chat:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};

export const markMessagesAsRead = async (chatId, userId) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('chat_id', chatId)
    .neq('sender_id', userId);

  if (error) {
    console.error('Error marking messages as read:', error);
  }
};