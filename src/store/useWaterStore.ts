import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface WaterEntry {
  id: string
  user_id: string
  amount: number
  date: string
  created_at: string
}

interface UserSettings {
  id: string
  user_id: string
  daily_goal: number
  selected_pet: 'capybara' | 'cat'
  cup_volume: number
  weight: number | null
  created_at: string
  updated_at: string
}

interface WaterState {
  dailyGoal: number
  waterIntake: number
  history: WaterEntry[]
  selectedPet: 'capybara' | 'cat'
  cupVolume: number
  weight: number | null
  isLoading: boolean
  error: string | null
  setDailyGoal: (goal: number) => Promise<void>
  addWater: (amount: number) => Promise<void>
  loadHistory: () => Promise<void>
  setSelectedPet: (pet: 'capybara' | 'cat') => Promise<void>
  setCupVolume: (volume: number) => Promise<void>
  setWeight: (weight: number) => Promise<void>
  resetState: () => void
  getDailyProgress: () => number
  getStreak: () => number
  clearError: () => void
  getRecommendedIntake: () => number
}

const initialState = {
  dailyGoal: 0,
  waterIntake: 0,
  history: [],
  selectedPet: 'capybara' as const,
  cupVolume: 250,
  weight: null,
  isLoading: false,
  error: null
}

export const useWaterStore = create<WaterState>((set, get) => ({
  ...initialState,

  setDailyGoal: async (goal) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      set({ error: 'Usuário não autenticado' });
      return;
    }
    
    if (!goal || goal < 500 || goal > 5000) {
      set({ error: 'Meta diária deve estar entre 500ml e 5000ml' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Primeiro, tenta buscar as configurações existentes
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settings) {
        // Se existir, atualiza
        const { error } = await supabase
          .from('user_settings')
          .update({ 
            daily_goal: goal,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Se não existir, cria
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            daily_goal: goal,
            selected_pet: 'capybara',
            cup_volume: 250,
            weight: null
          });

        if (error) throw error;
      }

      // Atualiza o estado e recarrega os dados
      set({ dailyGoal: goal, isLoading: false, error: null });
      await get().loadHistory();
    } catch (error: any) {
      console.error('Erro ao definir meta diária:', error);
      set({ 
        error: 'Falha ao definir meta diária. Tente novamente.',
        isLoading: false 
      });
    }
  },

  addWater: async (amount) => {
    console.log('Iniciando addWater com amount:', amount);
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      set({ error: 'Usuário não autenticado' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Adicionar nova entrada
      const { error: insertError } = await supabase
        .from('water_entries')
        .insert({
          user_id: userId,
          amount: amount,
          date: today
        });

      if (insertError) throw insertError;

      // Buscar total atualizado
      const { data: entries, error: selectError } = await supabase
        .from('water_entries')
        .select('amount')
        .eq('user_id', userId)
        .eq('date', today);

      if (selectError) throw selectError;

      // Calculando o novo total de água
      const newTotal = entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

      // Verifica se não excede a meta diária
      if (newTotal > get().dailyGoal) {
        set({ 
          error: 'Meta diária já atingida!', 
          isLoading: false 
        });
        return;
      }

      // Atualiza o estado local do aplicativo
      set({ 
        waterIntake: newTotal,
        isLoading: false,
        error: null
      });

      // Recarrega o histórico para manter consistência
      await get().loadHistory();
    } catch (error: any) {
      console.error('Erro ao adicionar água:', error);
      set({ 
        error: 'Erro ao adicionar água', 
        isLoading: false 
      });
    }
  },

  loadHistory: async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      set({ ...initialState, error: 'Usuário não autenticado' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Carrega as configurações do usuário
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (settingsError) {
        console.error('Erro ao carregar configurações:', settingsError);
        throw settingsError;
      }

      // Se encontrou configurações, atualiza o estado
      if (settings) {
        set({
          dailyGoal: settings.daily_goal || 2000,
          weight: settings.weight || null,
          selectedPet: settings.selected_pet || 'capybara',
          cupVolume: settings.cup_volume || 250
        });
      } else {
        // Se não encontrou configurações, mantém os valores padrão
        set({
          dailyGoal: 2000,
          weight: null,
          selectedPet: 'capybara',
          cupVolume: 250
        });
      }

      // Carregar entradas de água para hoje
      const today = new Date().toISOString().split('T')[0];
      
      const { data: entries, error: entriesError } = await supabase
        .from('water_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .order('created_at', { ascending: true });

      if (entriesError) {
        console.error('Erro ao carregar entradas:', entriesError);
        throw entriesError;
      }

      // Atualizar estado com os dados do banco
      set({
        waterIntake: entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0,
        history: entries || [],
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      // Reseta o estado para valores padrão em caso de erro
      set({ 
        ...initialState,
        error: 'Erro ao carregar dados. Por favor, tente novamente.',
        isLoading: false
      });
    }
  },

  setSelectedPet: async (pet) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      console.error('Usuário não autenticado');
      set({ error: 'User not authenticated' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      console.log('Verificando configurações existentes...');
      // Primeiro, tenta buscar as configurações existentes
      const { data: settings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (settings) {
        console.log('Atualizando pet existente...');
        // Se existir, atualiza
        const { error } = await supabase
          .from('user_settings')
          .update({ selected_pet: pet })
          .eq('user_id', userId);

        if (error) {
          console.error('Erro ao atualizar pet:', error);
          throw error;
        }
      } else {
        console.log('Criando novas configurações com o pet...');
        // Se não existir, cria
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            daily_goal: initialState.dailyGoal,
            selected_pet: pet,
            cup_volume: initialState.cupVolume
          });

        if (error) {
          console.error('Erro ao criar configurações:', error);
          throw error;
        }
      }

      console.log('Pet atualizado com sucesso:', pet);
      set({ selectedPet: pet, isLoading: false });
    } catch (error) {
      console.error('Error setting selected pet:', error);
      set({ error: 'Failed to set selected pet', isLoading: false });
    }
  },

  setCupVolume: async (volume) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      set({ error: 'Usuário não autenticado' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Verificar se já existem configurações
      const { data: settings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (settings) {
        // Atualizar configurações existentes
        const { error } = await supabase
          .from('user_settings')
          .update({ cup_volume: volume })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Criar novas configurações
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            cup_volume: volume,
            daily_goal: get().dailyGoal,
            selected_pet: get().selectedPet
          });

        if (error) throw error;
      }

      // Atualizar estado local
      set({ 
        cupVolume: volume, 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao definir volume do copo:', error);
      set({ 
        error: 'Erro ao definir volume do copo', 
        isLoading: false 
      });
    }
  },

  setWeight: async (weight) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      set({ error: 'Usuário não autenticado' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      const recommendedGoal = weight * 35;

      if (settings) {
        const { error } = await supabase
          .from('user_settings')
          .update({ 
            weight: weight,
            daily_goal: get().dailyGoal || recommendedGoal
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            weight: weight,
            daily_goal: recommendedGoal,
            selected_pet: initialState.selectedPet,
            cup_volume: initialState.cupVolume
          });

        if (error) throw error;
      }

      set({ 
        weight: weight,
        dailyGoal: get().dailyGoal || recommendedGoal,
        isLoading: false 
      });
    } catch (error) {
      console.error('Erro ao definir peso:', error);
      set({ error: 'Erro ao definir peso', isLoading: false });
    }
  },

  resetState: () => {
    set({ ...initialState });
  },

  getDailyProgress: () => {
    const { waterIntake, dailyGoal } = get();
    return Math.min((waterIntake / dailyGoal) * 100, 100);
  },

  getStreak: () => {
    const { history } = get();
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const entries = history.filter(entry => entry.date === dateStr);
      
      if (entries.length === 0) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  },

  clearError: () => set({ error: null }),

  getRecommendedIntake: () => {
    const { weight } = get();
    return weight ? weight * 35 : 2000;
  }
}))
