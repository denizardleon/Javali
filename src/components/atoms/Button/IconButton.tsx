import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  /**
   * Ícone do Lucide a ser renderizado
   */
  icon: LucideIcon;
  
  /**
   * Handler de clique
   */
  onClick: () => void;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Tamanho do ícone
   */
  size?: number;
}

/**
 * Componente atômico para botões com ícone
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  className = '',
  size = 24
}) => (
  <button 
    onClick={onClick} 
    className={`text-gray-500 hover:text-gray-700 ${className}`}
  >
    <Icon size={size} />
  </button>
);

export default IconButton;
