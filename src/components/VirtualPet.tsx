import React from 'react';
import { useWaterStore } from '../store/useWaterStore';

const petImages = {
  capybara: "https://i.pinimg.com/736x/24/06/34/24063471761e561fe05d6ad243663905.jpg",
  cat: "https://i.pinimg.com/736x/1e/46/89/1e468962f17b4667cdc09cd160bbeabc.jpg",
  dog: "https://i.pinimg.com/736x/ab/87/04/ab87043f15a845cd1608e3085d710ce4.jpg"
};

export const VirtualPet: React.FC = () => {
  const { selectedPet } = useWaterStore();

  return (
    <div className="w-48 h-48 mx-auto flex items-center justify-center">
      <img 
        src={petImages[selectedPet]} 
        alt={selectedPet}
        className="w-full h-full object-contain"
      />
    </div>
  );
};