import React, { useState } from 'react'
import { useWaterStore } from '../store/useWaterStore'
import { useAuthStore } from '../store/useAuthStore'
import { X } from 'lucide-react'

interface DailyGoalModalProps {
  onClose: () => void
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({ onClose }) => {
  const { dailyGoal, setDailyGoal } = useWaterStore()
  const { user } = useAuthStore()
  const [goal, setGoal] = useState(dailyGoal)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || saving) return

    setSaving(true)
    try {
      await setDailyGoal(goal, user.id)
      onClose()
    } catch (err) {
      console.error('Failed to update daily goal:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Meta Diária de Água</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade em mililitros (ml)
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              min="500"
              max="5000"
              step="100"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}