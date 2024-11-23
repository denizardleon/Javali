import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { useWaterStore } from './useWaterStore'

interface AuthState {
  user: any | null
  session: any | null
  isLoading: boolean
  error: string | null
  setUser: (user: any) => void
  setSession: (session: any) => void
  signOut: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      setUser: (user) => {
        set({ user });
        if (user) {
          // Ao fazer login, carregar histórico
          useWaterStore.getState().loadHistory();
        }
      },
      setSession: (session) => set({ session }),
      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await supabase.auth.signOut();
          useWaterStore.getState().resetState();
          set({ user: null, session: null, isLoading: false });
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('water-storage');
        } catch (err: any) {
          set({ 
            error: err.message || 'Failed to sign out',
            isLoading: false
          });
        }
      },
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session
      })
    }
  )
)