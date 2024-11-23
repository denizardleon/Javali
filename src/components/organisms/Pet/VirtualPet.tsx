import React, { useEffect } from 'react';
import { Pet } from '../../atoms/Pet/Pet';
import { useWaterStore } from '../../../store/useWaterStore';
import { useAuthStore } from '../../../store/useAuthStore';

interface VirtualPetProps {
  /**
   * Tamanho do pet
   */
  size?: 'small' | 'normal' | 'large';
}

/**
 * Componente que exibe o pet virtual
 */
export const VirtualPet: React.FC<VirtualPetProps> = ({ 
  size = 'normal' 
}) => {
  const { selectedPet, loadHistory } = useWaterStore();
  const { user } = useAuthStore();

  // Carregar histórico ao montar o componente
  useEffect(() => {
    if (user) {
      console.log('VirtualPet - Carregando histórico...');
      loadHistory();
    }
  }, [user, loadHistory]);

  console.log('VirtualPet - Pet selecionado:', selectedPet);

  return (
    <div className="relative">
      <Pet type={selectedPet} size={size} />
    </div>
  );
};

export default VirtualPet;
