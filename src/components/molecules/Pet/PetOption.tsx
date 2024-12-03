import React from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { useAuthStore } from '../../../store/useAuthStore';

interface PetOptionProps {
  pet: 'capybara' | 'cat';
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect: () => void;
}

const petInfo = {
  capybara: {
    name: 'Capivara',
    image: '/assets/capy.png'
  },
  cat: {
    name: 'Gato',
    image: '/assets/cat.png'
  }
} as const;

/**
 * molecula para selecionar um pet
 */
export const PetOption: React.FC<PetOptionProps> = ({ 
  pet,
  isSelected = false,
  isDisabled = false,
  onSelect
}) => {
  const { selectedPet, setSelectedPet } = useWaterStore();
  const { user } = useAuthStore();
  const info = petInfo[pet];

  const handleClick = async () => {
    if (isDisabled) return;
    
    try {
      await setSelectedPet(pet);
      onSelect();
    } catch (error) {
      console.error('Error selecting pet:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`p-4 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 w-full
        ${selectedPet === pet ? 'bg-white/20' : 'hover:bg-white/10'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <img 
        src={info.image} 
        alt={info.name}
        className="w-24 h-24 object-contain"
      />
      <span className="text-white font-medium">
        {info.name}
      </span>
    </button>
  );
};

export default PetOption;
