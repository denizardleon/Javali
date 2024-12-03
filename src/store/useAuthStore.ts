import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useWaterStore } from './useWaterStore'

interface AuthState {
  user: any
  session: any
  isLoading: boolean
  error: string | null
  setUser: (user: any) => void
  setSession: (session: any) => void
  signOut: () => Promise<void>
  clearError: () => void
  loadUserSettings: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  setUser: async (user) => {
    set({ user });
    if (user) {
      // Primeiro carrega as configurações do usuário
      await get().loadUserSettings();
      // Depois carrega o histórico
      await useWaterStore.getState().loadHistory();
    }
  },

  setSession: (session) => set({ session }),

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

  clearError: () => set({ error: null }),

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

      console.log('Configurações carregadas:', settings);

      if (settings) {
        await useWaterStore.getState().loadHistory();
      } else {
        console.log('Nenhuma configuração encontrada para o usuário');
        // Criar configurações padrão se não existirem
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            daily_goal: 2000,
            selected_pet: 'capybara',
            cup_volume: 250,
            weight: null
          });

        if (insertError) {
          console.error('Erro ao criar configurações padrão:', insertError);
          throw insertError;
        }

        console.log('Configurações padrão criadas');
        await useWaterStore.getState().loadHistory();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do usuário:', error);
    }
  }
}))