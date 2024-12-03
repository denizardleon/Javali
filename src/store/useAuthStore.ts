import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useWaterStore } from './useWaterStore'

// Define as configurações do usuário que podem ser personalizadas
// Inclui meta diária de água, pet escolhido, volume do copo e peso
interface UserSettings {
  daily_goal: number
  selected_pet: 'capybara' | 'cat'
  cup_volume: number
  weight: number | null
}

// Gerencia o estado global de autenticação e configurações do usuário
// Inclui dados do usuário, sessão, estados de carregamento e funções de manipulação
interface AuthState {
  user: any
  session: any
  isLoading: boolean
  error: string | null
  settings: UserSettings | null
  setUser: (user: any) => void
  setSession: (session: any) => void
  signOut: () => Promise<void>
  clearError: () => void
  loadUserSettings: () => Promise<void>
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
}

// Configurações padrão aplicadas quando um novo usuário é criado
const DEFAULT_SETTINGS: UserSettings = {
  daily_goal: 2000,
  selected_pet: 'capybara',
  cup_volume: 250,
  weight: null
}

// Store principal de autenticação usando Zustand
// Gerencia todo o estado relacionado ao usuário e suas configurações
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,
  settings: null,
  // Atualiza o usuário atual e inicializa suas configurações e histórico
  // É chamada após login bem-sucedido ou ao recarregar a página
  setUser: async (user) => { 
    set({ user });
    if (user) {
      // Primeiro carrega as configurações do usuário
      await get().loadUserSettings();
      // Depois carrega o histórico
      await useWaterStore.getState().loadHistory();
    }
  },
  // Atualiza a sessão atual do usuário
  // Mantém o token de autenticação e outros dados da sessão
  setSession: (session) => set({ session }),

  // Realiza o processo de logout
  // Limpa os dados locais e encerra a sessão no Supabase
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      // Primeiro limpa os estados
      useWaterStore.getState().resetState();
      set({ user: null, session: null });
      
      // Depois faz o logout no Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
      set({ 
        error: err.message || 'Falha ao fazer logout',
        isLoading: false
      });
    }
  },

  // Remove mensagens de erro do estado
  clearError: () => set({ error: null }),

  // Busca as configurações do usuário no banco de dados
  // Se não existirem, cria com valores padrão
  // Sincroniza as configurações com o WaterStore
  loadUserSettings: async () => {
    const { user } = get();
    if (!user) {
      console.log('Tentativa de carregar configurações sem usuário');
      return;
    }
    
    try {
      console.log('Carregando configurações do usuário:', user.id);
      
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar configurações:', error);
        throw error;
      }

      if (settings) {
        set({ settings });
        // Atualiza o WaterStore com as configurações
        const waterStore = useWaterStore.getState();
        waterStore.setDailyGoal(settings.daily_goal);
        waterStore.setSelectedPet(settings.selected_pet);
        waterStore.setCupVolume(settings.cup_volume);
        if (settings.weight) waterStore.setWeight(settings.weight);
      } else {
        await get().updateSettings(DEFAULT_SETTINGS);
      }

      await useWaterStore.getState().loadHistory();
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  },

  // Atualiza as configurações do usuário no banco e no estado local
  // Aceita atualizações parciais, mantendo valores existentes
  // Sincroniza alterações com o WaterStore para manter consistência
  updateSettings: async (newSettings: Partial<UserSettings>) => {
    const { user, settings } = get();
    if (!user) return;

    try {
      const updatedSettings = { ...DEFAULT_SETTINGS, ...settings, ...newSettings };
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id,
          ...updatedSettings
        });

      if (error) throw error;

      set({ settings: updatedSettings as UserSettings });
      
      // Atualiza o WaterStore conforme necessário
      const waterStore = useWaterStore.getState();
      if (newSettings.daily_goal) waterStore.setDailyGoal(newSettings.daily_goal);
      if (newSettings.selected_pet) waterStore.setSelectedPet(newSettings.selected_pet);
      if (newSettings.cup_volume) waterStore.setCupVolume(newSettings.cup_volume);
      if (newSettings.weight) waterStore.setWeight(newSettings.weight);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    }
  }
}))