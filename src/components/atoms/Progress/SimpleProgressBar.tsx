import React from 'react';

interface SimpleProgressBarProps {
  /**
   * Porcentagem de progresso (0-100)
   */
  progress: number;
}

/**
 * Componente atômico que representa uma barra de progresso simples
 */
export const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-white/30 rounded-full h-2">
    <div 
      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(progress, 100)}%` }}
    />
  </div>
);

export default SimpleProgressBar;
