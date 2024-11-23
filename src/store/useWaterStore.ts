import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
  created_at: string
  updated_at: string
}

interface WaterState {
  dailyGoal: number
  waterIntake: number
  history: WaterEntry[]
  selectedPet: 'capybara' | 'cat'
  cupVolume: number
  isLoading: boolean
  error: string | null
  setDailyGoal: (goal: number) => Promise<void>
  addWater: (amount: number) => Promise<void>
  loadHistory: () => Promise<void>
  setSelectedPet: (pet: 'capybara' | 'cat') => Promise<void>
  setCupVolume: (volume: number) => Promise<void>
  resetState: () => void
  getDailyProgress: () => number
  getStreak: () => number
  clearError: () => void
}

const initialState = {
  dailyGoal: 2000,
  waterIntake: 0,
  history: [],
  selectedPet: 'capybara' as const,
  cupVolume: 250,
  isLoading: false,
  error: null
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDailyGoal: async (goal) => {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user?.id;
        
        if (!userId) {
          set({ error: 'User not authenticated' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Primeiro, tenta buscar as configurações existentes
          const { data: settings } = await supabase
            .from('user_settings')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (settings) {
            // Se existir, atualiza
            const { error } = await supabase
              .from('user_settings')
              .update({ daily_goal: goal })
              .eq('user_id', userId);

            if (error) throw error;
          } else {
            // Se não existir, cria
            const { error } = await supabase
              .from('user_settings')
              .insert({
                user_id: userId,
                daily_goal: goal,
                selected_pet: initialState.selectedPet,
                cup_volume: initialState.cupVolume
              });

            if (error) throw error;
          }

          set({ dailyGoal: goal, isLoading: false });
        } catch (error) {
          console.error('Error setting daily goal:', error);
          set({ error: 'Failed to set daily goal', isLoading: false });
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

          // Calcular novo total
          const newTotal = entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

          // Verificar se não excede a meta diária
          if (newTotal > get().dailyGoal) {
            set({ 
              error: 'Meta diária já atingida!', 
              isLoading: false 
            });
            return;
          }

          // Atualizar estado local
          set({ 
            waterIntake: newTotal,
            isLoading: false,
            error: null
          });

          // Recarregar histórico para manter consistência
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
          set({ error: 'Usuário não autenticado' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Carregar configurações do usuário
          const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (settingsError && settingsError.code !== 'PGRST116') {
            throw settingsError;
          }

          // Se encontrou configurações, atualizar o estado
          if (settings) {
            set({
              dailyGoal: settings.daily_goal,
              selectedPet: settings.selected_pet,
              cupVolume: settings.cup_volume
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

          if (entriesError) throw entriesError;

          // Calcular total de água para hoje
          const todayTotal = entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

          // Atualizar estado com os dados do banco
          set(state => ({
            waterIntake: todayTotal,
            history: entries || [],
            isLoading: false,
            error: null
          }));
        } catch (error: any) {
          console.error('Erro ao carregar histórico:', error);
          set({ 
            error: 'Erro ao carregar histórico', 
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

      resetState: () => {
        // Limpar storage local primeiro
        localStorage.removeItem('water-storage');
        
        // Resetar estado para valores iniciais
        set({
          ...initialState,
          history: [],
          waterIntake: 0,
          isLoading: false,
          error: null
        });
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

      clearError: () => set({ error: null })
    }),
    {
      name: 'water-storage',
      partialize: (state) => ({
        dailyGoal: state.dailyGoal,
        waterIntake: state.waterIntake,
        history: state.history,
        selectedPet: state.selectedPet,
        cupVolume: state.cupVolume
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const state = JSON.parse(str);
            // Garantir que o histórico é um array
            if (!Array.isArray(state.state.history)) {
              state.state.history = [];
            }
            return state;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)