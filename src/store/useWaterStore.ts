import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

interface WaterEntry {
  id: string
  date: string
  amount: number
}

interface WaterState {
  dailyGoal: number
  waterIntake: number
  history: WaterEntry[]
  selectedPet: 'capybara' | 'cat' | 'dog'
  setDailyGoal: (goal: number, userId: string) => Promise<void>
  addWater: (amount: number, userId: string) => Promise<void>
  loadHistory: (userId: string) => Promise<void>
  setSelectedPet: (pet: 'capybara' | 'cat' | 'dog', userId: string) => Promise<void>
  resetState: () => void
  getDailyProgress: () => number
  getStreak: () => number
}

const initialState = {
  dailyGoal: 2000,
  waterIntake: 0,
  history: [],
  selectedPet: 'capybara' as const,
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setDailyGoal: async (goal, userId) => {
        set({ dailyGoal: goal })
        await supabase
          .from('user_settings')
          .upsert({ user_id: userId, daily_goal: goal })
      },
      addWater: async (amount, userId) => {
        const today = new Date().toISOString().split('T')[0]
        
        // Add to database
        const { data, error } = await supabase
          .from('water_history')
          .insert([
            { user_id: userId, amount, date: today }
          ])
          .select()

        if (error) throw error
        
        // Update local state
        if (data?.[0]) {
          set((state) => ({
            waterIntake: state.waterIntake + amount,
            history: [...state.history, data[0]]
          }))
        }
      },
      loadHistory: async (userId) => {
        const { data, error } = await supabase
          .from('water_history')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })

        if (error) throw error

        if (data) {
          const today = new Date().toISOString().split('T')[0]
          const todayTotal = data
            .filter(entry => entry.date === today)
            .reduce((sum, entry) => sum + entry.amount, 0)

          set({
            history: data,
            waterIntake: todayTotal
          })
        }
      },
      setSelectedPet: async (pet, userId) => {
        set({ selectedPet: pet })
        await supabase
          .from('user_settings')
          .upsert({ user_id: userId, selected_pet: pet })
      },
      resetState: () => set(initialState),
      getDailyProgress: () => {
        const { waterIntake, dailyGoal } = get()
        return (waterIntake / dailyGoal) * 100
      },
      getStreak: () => {
        const { history, dailyGoal } = get()
        let streak = 0
        const dailyTotals = new Map<string, number>()

        // Agrupar consumo por dia
        history.forEach(entry => {
          const current = dailyTotals.get(entry.date) || 0
          dailyTotals.set(entry.date, current + entry.amount)
        })

        // Converter para array e ordenar por data
        const sortedDays = Array.from(dailyTotals.entries())
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())

        // Calcular streak
        for (const [_, total] of sortedDays) {
          if (total >= dailyGoal) {
            streak++
          } else {
            break
          }
        }

        return streak
      }
    }),
    {
      name: 'water-storage',
    }
  )
)