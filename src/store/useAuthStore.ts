import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { useWaterStore } from './useWaterStore'

interface AuthState {
  user: any | null
  session: any | null
  setUser: (user: any) => void
  setSession: (session: any) => void
  signOut: () => Promise<void>
  loadUserSettings: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      signOut: async () => {
        await supabase.auth.signOut()
        useWaterStore.getState().resetState()
        set({ user: null, session: null })
      },
      loadUserSettings: async () => {
        const { user } = get()
        if (!user) return

        const { data: settings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (settings) {
          const waterStore = useWaterStore.getState()
          waterStore.setDailyGoal(settings.daily_goal, user.id)
          waterStore.setSelectedPet(settings.selected_pet, user.id)
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)