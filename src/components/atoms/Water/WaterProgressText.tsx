import React from 'react';
import { twMerge } from 'tailwind-merge';

interface WaterProgressTextProps {
  /**
   * Quantidade atual de água ingerida em ml
   */
  current: number;
  /**
   * Meta diária de água em ml
   */
  goal: number;
  /**
   * Classes adicionais para customização
   */
  className?: string;
}

/**
 * Componente atômico que mostra o progresso de água em texto
 */
export const WaterProgressText: React.FC<WaterProgressTextProps> = ({
  current,
  goal,
  className
}) => {
  const percentage = Math.round((current / goal) * 100);
  const currentLiters = (current / 1000).toFixed(1);
  const goalLiters = (goal / 1000).toFixed(1);
  
  return (
    <div className={twMerge('text-center absolute top-[100px] left-1/2 -translate-x-1/2 z-10 font-inder', className)}>
      {/* Porcentagem */}
      <div className="text-2xl text-white drop-shadow-lg mb-0.5">
        {percentage}%
      </div>
      
      {/* Valores */}
      <div className="flex items-center justify-center gap-2 text-white drop-shadow-lg">
        <span className="text-lg">{currentLiters}L</span>
        <span className="text-sm">/</span>
        <span className="text-sm">{goalLiters}L</span>
      </div>
    </div>
  );
};

export default WaterProgressText;
