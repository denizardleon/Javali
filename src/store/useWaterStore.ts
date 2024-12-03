import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// Estrutura que define os dados de uma entrada de água no histórico
// Cada registro contém id único, id do usuário, quantidade de água, data e momento do registro
interface WaterEntry {
  id: string
  user_id: string
  amount: number
  date: string
  created_at: string
}

// Define a estrutura do estado global e suas funções de manipulação
// Inclui metas, consumo, histórico, preferências e funções de gerenciamento
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

// Estado inicial da aplicação com valores padrão
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

  // Atualiza a meta diária de consumo de água do usuário
  // Valida se está entre 500ml e 5000ml antes de salvar no banco
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
      const { error } = await supabase
        .from('user_settings')
        .update({ daily_goal: goal })
        .eq('user_id', userId);

      if (error) throw error;

      set({ dailyGoal: goal, isLoading: false, error: null });
    } catch (error: any) {
      console.error('Erro ao definir meta diária:', error);
      set({ 
        error: 'Falha ao definir meta diária. Tente novamente.',
        isLoading: false 
      });
    }
  },

  // Registra novo consumo de água
  // Valida o total diário para não ultrapassar a meta
  // Atualiza o histórico e total consumido
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

  // Carrega o histórico de consumo do dia atual
  // Calcula o total consumido e atualiza o estado
  loadHistory: async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    
    if (!userId) {
      set({ ...initialState, error: 'Usuário não autenticado' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const today = new Date().toISOString().split('T')[0];
      //select para buscar as entradas de água
      const { data: entries, error: entriesError } = await supabase
        .from('water_entries')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .order('created_at', { ascending: true });

      if (entriesError) throw entriesError;

      set({
        waterIntake: entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0,
        history: entries || [],
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      set({ 
        ...initialState,
        error: 'Erro ao carregar dados. Por favor, tente novamente.',
        isLoading: false
      });
    }
  },

  // Salva a preferência do pet virtual escolhido pelo usuário
  // Cria ou atualiza as configurações no banco de dados
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

  // Define o volume do copo padrão usado para registros rápidos
  // Mantém a preferência sincronizada com o banco de dados
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

  // Registra o peso do usuário e recalcula meta diária recomendada
  // A meta é calculada multiplicando o peso por 35ml
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

  // Reseta o estado da aplicação para os valores iniciais
  resetState: () => {
    set({ ...initialState });
  },

  // Calcula a porcentagem da meta diária já atingida
  // Retorna no máximo 100% mesmo se ultrapassar a meta
  getDailyProgress: () => {
    const { waterIntake, dailyGoal } = get();
    return Math.min((waterIntake / dailyGoal) * 100, 100);
  },

  // Calcula quantos dias seguidos o usuário atingiu algum consumo
  // Analisa o histórico retroativamente até encontrar um dia sem registros
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

  // Limpa mensagens de erro do estado
  clearError: () => set({ error: null }),

  // Calcula consumo diário recomendado baseado no peso
  // Se não houver peso registrado, retorna 2000ml como padrão
  getRecommendedIntake: () => {
    const { weight } = get();
    return weight ? weight * 35 : 2000;
  }
}))
