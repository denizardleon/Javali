import React from 'react';
import { useWaterStore } from '../store/useWaterStore';

const petImages = {
  capybara: "src/img/capy.png",
  cat: "src/img/cat.png",
  dog: "src/img/dog.png"
};

export const VirtualPet: React.FC = () => {
  const { selectedPet } = useWaterStore();

  return (
    <div className="w-96 h-96 mx-auto flex items-center justify-center">
      <img 
      src={petImages[selectedPet]} 
      alt={selectedPet}
      className="w-full h-full object-contain"
      />
    </div>
  );
};