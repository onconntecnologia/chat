import supabase from './supabaseClient';

export const authService = {
  // Login com email e senha
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Buscar dados do usuário na tabela users
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            company:companies(*)
          `)
          .eq('auth_id', data.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Erro ao buscar dados do usuário:', userError);
        }

        return {
          user: data.user,
          session: data.session,
          userData: userData || null,
        };
      }

      return { user: data.user, session: data.session, userData: null };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Registro de novo usuário
  async signUp(email, password, userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (error) throw error;

      // Se o usuário foi criado com sucesso, criar registro na tabela users
      if (data.user && !data.user.email_confirmed_at) {
        // Usuário precisa confirmar email
        return {
          user: data.user,
          session: data.session,
          needsEmailConfirmation: true,
        };
      }

      if (data.user) {
        // Criar registro na tabela users
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert([
            {
              auth_id: data.user.id,
              email: data.user.email,
              name: userData.name,
              role: userData.role || 'customer',
              company_id: userData.company_id || null,
            },
          ])
          .select()
          .single();

        if (userError) {
          console.error('Erro ao criar usuário na tabela users:', userError);
          throw userError;
        }

        return {
          user: data.user,
          session: data.session,
          userData: newUser,
        };
      }

      return { user: data.user, session: data.session, userData: null };
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  // Recuperar senha
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      throw error;
    }
  },

  // Atualizar senha
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  },

  // Obter sessão atual
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      throw error;
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        // Buscar dados do usuário na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            *,
            company:companies(*)
          `)
          .eq('auth_id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Erro ao buscar dados do usuário:', userError);
        }

        return {
          user,
          userData: userData || null,
        };
      }

      return { user: null, userData: null };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      throw error;
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(updates) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user) throw new Error('Usuário não autenticado');

      // Atualizar dados na tabela users
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Se houver mudança de email, atualizar também no auth
      if (updates.email && updates.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: updates.email,
        });
        if (emailError) throw emailError;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  // Listener para mudanças de autenticação
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};