import React, { useState } from 'react'
import { ChevronLeft, GlassWater, LogOut, Dog, History } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { DailyGoalModal } from './DailyGoalModal'
import { PetSelectionModal } from './PetSelectionModal'
import { HistoryModal } from './HistoryModal'

interface SettingsProps {
  onBack: () => void
}

const SettingItem: React.FC<{
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
}> = ({ icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-4 px-6 py-4 hover:bg-black/5 w-full disabled:opacity-50"
  >
    <div className="text-gray-600">{icon}</div>
    <span className="flex-1 text-left text-gray-700">{label}</span>
    <ChevronLeft className="text-gray-400 rotate-180" size={20} />
  </button>
)

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { signOut } = useAuthStore()
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false)
  const [showPetModal, setShowPetModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-primary p-6 pb-32">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl -mt-24 min-h-[calc(100vh-8rem)]">
        <div className="divide-y">
          <SettingItem 
            icon={<History size={24} />} 
            label="Histórico" 
            onClick={() => setShowHistoryModal(true)} 
          />
          <SettingItem 
            icon={<GlassWater size={24} />} 
            label="Meta diária" 
            onClick={() => setShowDailyGoalModal(true)} 
          />
          <SettingItem 
            icon={<Dog size={24} />} 
            label="Escolher Pet" 
            onClick={() => setShowPetModal(true)} 
          />
          <SettingItem 
            icon={<LogOut size={24} className="text-red-500" />} 
            label="Deslogar" 
            onClick={signOut}
          />
        </div>
      </div>

      {showDailyGoalModal && (
        <DailyGoalModal onClose={() => setShowDailyGoalModal(false)} />
      )}

      {showPetModal && (
        <PetSelectionModal onClose={() => setShowPetModal(false)} />
      )}

      {showHistoryModal && (
        <HistoryModal onClose={() => setShowHistoryModal(false)} />
      )}
    </div>
  )
}