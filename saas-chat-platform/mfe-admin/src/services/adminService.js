import { supabase } from './supabaseClient';

export const adminService = {
  // Gerenciamento de Empresas
  async getCompanies(page = 1, limit = 10, search = '') {
    let query = supabase
      .from('companies')
      .select(`
        *,
        users!companies_id_fkey(count)
      `, { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      companies: data,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  },

  async getCompanyById(id) {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        users!companies_id_fkey(*),
        ai_configurations(*),
        integrations(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCompany(companyData) {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCompany(id, updates) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCompany(id) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleCompanyStatus(id, isActive) {
    return this.updateCompany(id, { is_active: isActive });
  },

  // Gerenciamento de Usuários
  async getUsers(page = 1, limit = 10, search = '', companyId = null, role = null) {
    let query = supabase
      .from('users')
      .select(`
        *,
        companies(name)
      `, { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      users: data,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        companies(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleUserStatus(id, isActive) {
    return this.updateUser(id, { is_active: isActive });
  },

  // Dashboard e Estatísticas
  async getDashboardStats() {
    const [companiesResult, usersResult, chatsResult] = await Promise.all([
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('chats').select('*', { count: 'exact', head: true })
    ]);

    if (companiesResult.error) throw companiesResult.error;
    if (usersResult.error) throw usersResult.error;
    if (chatsResult.error) throw chatsResult.error;

    // Estatísticas por período
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newCompaniesResult, newUsersResult, newChatsResult] = await Promise.all([
      supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
    ]);

    return {
      totalCompanies: companiesResult.count,
      totalUsers: usersResult.count,
      totalChats: chatsResult.count,
      newCompaniesThisMonth: newCompaniesResult.count,
      newUsersThisMonth: newUsersResult.count,
      newChatsThisMonth: newChatsResult.count
    };
  },

  async getCompanyGrowthData(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('companies')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at');

    if (error) throw error;

    // Agrupar por dia
    const growthData = {};
    data.forEach(company => {
      const date = new Date(company.created_at).toISOString().split('T')[0];
      growthData[date] = (growthData[date] || 0) + 1;
    });

    return Object.entries(growthData).map(([date, count]) => ({
      date,
      count
    }));
  },

  async getUsersByRole() {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .neq('role', null);

    if (error) throw error;

    const roleCount = {};
    data.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });

    return Object.entries(roleCount).map(([role, count]) => ({
      role,
      count
    }));
  },

  // Configurações de IA
  async getAIConfigurations(companyId = null) {
    let query = supabase
      .from('ai_configurations')
      .select(`
        *,
        companies(name)
      `);

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateAIConfiguration(id, updates) {
    const { data, error } = await supabase
      .from('ai_configurations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Integrações
  async getIntegrations(companyId = null) {
    let query = supabase
      .from('integrations')
      .select(`
        *,
        companies(name)
      `);

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async toggleIntegration(id, isActive) {
    const { data, error } = await supabase
      .from('integrations')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};