import React from 'react';
import capyImg from '../../../assets/capy.png';
import catImg from '../../../assets/cat.png';

// Mapeamento dos tipos de pet para as imagens importadas
const petImages = {
  capybara: capyImg,
  cat: catImg
} as const;

interface PetProps {
  /**
   * Tipo do pet (capybara ou cat)
   */
  type: 'capybara' | 'cat';
  
  /**
   * Tamanho do pet
   */
  size?: 'small' | 'normal' | 'large';
}

/**
 * Componente atômico que renderiza a imagem do pet
 */
export const Pet: React.FC<PetProps> = ({ 
  type,
  size = 'normal'
}) => {
  const sizeClass = {
    small: 'w-24 h-24',
    normal: 'w-48 h-48',
    large: 'w-80 h-80'
  }[size];

  return (
    <div className={`${sizeClass}`}>
      <img
        src={petImages[type]}
        alt={`Pet ${type}`}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Pet;
