import React, { useState } from 'react'
import { useWaterStore } from '../store/useWaterStore'
import { useAuthStore } from '../store/useAuthStore'
import { X } from 'lucide-react'

interface PetSelectionModalProps {
  onClose: () => void
}

const pets = [
  { id: 'capybara', name: 'Capivara', emoji: '🐗' },
  { id: 'cat', name: 'Gato', emoji: '🐱' },
  { id: 'dog', name: 'Cachorro', emoji: '🐕' },
] as const

export const PetSelectionModal: React.FC<PetSelectionModalProps> = ({ onClose }) => {
  const { selectedPet, setSelectedPet } = useWaterStore()
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)

  const handleSelect = async (petId: typeof selectedPet) => {
    if (!user?.id || saving) return

    setSaving(true)
    try {
      await setSelectedPet(petId, user.id)
      onClose()
    } catch (err) {
      console.error('Failed to update pet:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Escolha seu Pet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {pets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => handleSelect(pet.id)}
                disabled={saving}
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
                  selectedPet === pet.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <span className="text-4xl">{pet.emoji}</span>
                <span className="text-sm font-medium text-gray-700">
                  {pet.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}