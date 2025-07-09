const supabase = require('../services/supabaseClient');
const n8nClient = require('../services/n8nClient');

// Obter todos os chats de um usuário
exports.getChats = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    
    let query = supabase.from('chats').select(`
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
    `);
    
    if (userType === 'agent') {
      query = query.eq('agent_id', userId);
    } else if (userType === 'customer') {
      query = query.eq('customer_id', userId);
    } else if (userType === 'company') {
      query = query.eq('company_id', userId);
    }
    
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter um chat específico
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    
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
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter mensagens de um chat
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
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
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Enviar uma mensagem
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, senderType, content } = req.body;
    
    // Inserir a mensagem no Supabase
    const { data: messageData, error: messageError } = await supabase
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
    
    if (messageError) {
      throw messageError;
    }
    
    // Atualizar o timestamp do chat
    const { error: chatError } = await supabase
      .from('chats')
      .update({ updated_at: new Date() })
      .eq('id', chatId);
    
    if (chatError) {
      throw chatError;
    }
    
    // Se a mensagem for do cliente, enviar para o n8n para processamento de IA
    if (senderType === 'customer') {
      try {
        // Obter informações do chat para contexto
        const { data: chatData } = await supabase
          .from('chats')
          .select(`
            id,
            title,
            company_id,
            companies(id, name),
            customer_id,
            customers(id, name, email)
          `)
          .eq('id', chatId)
          .single();
        
        // Enviar para o n8n
        await n8nClient.post('/webhook/chat-message', {
          messageId: messageData[0].id,
          chatId,
          senderId,
          senderType,
          content,
          chatData,
        });
      } catch (n8nError) {
        console.error('Error sending message to n8n:', n8nError);
        // Não falhar a requisição se o n8n falhar
      }
    }
    
    res.status(201).json(messageData[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Marcar mensagens como lidas
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', userId);
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo chat
exports.createChat = async (req, res) => {
  try {
    const { companyId, customerId, title } = req.body;
    
    // Verificar se já existe um chat entre a empresa e o cliente
    const { data: existingChat, error: findError } = await supabase
      .from('chats')
      .select('id')
      .eq('company_id', companyId)
      .eq('customer_id', customerId)
      .eq('status', 'open')
      .maybeSingle();
    
    if (findError) {
      throw findError;
    }
    
    if (existingChat) {
      return res.status(200).json({ id: existingChat.id, isNew: false });
    }
    
    // Encontrar um agente disponível
    const { data: agents, error: agentsError } = await supabase
      .from('users')
      .select('id')
      .eq('company_id', companyId)
      .eq('role', 'agent')
      .eq('status', 'online')
      .limit(1);
    
    if (agentsError) {
      throw agentsError;
    }
    
    const agentId = agents && agents.length > 0 ? agents[0].id : null;
    
    // Criar um novo chat
    const { data: newChat, error: createError } = await supabase
      .from('chats')
      .insert([
        {
          company_id: companyId,
          customer_id: customerId,
          agent_id: agentId,
          title: title || 'Novo atendimento',
          status: 'open',
        },
      ])
      .select();
    
    if (createError) {
      throw createError;
    }
    
    res.status(201).json({ id: newChat[0].id, isNew: true });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: error.message });
  }
};