import React from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { WaterProgressCustom } from '../../atoms/Water/WaterProgressCustom';
import { WaterProgressText } from '../../atoms/Water/WaterProgressText';

/**
 * Molecula que exibe o progresso de água + animação
 */
export const WaterDisplay: React.FC = () => {
  const { waterIntake, dailyGoal, getDailyProgress, isLoading, error } = useWaterStore();
  const percentage = getDailyProgress();

  // Se não tiver meta diária definida, mostra 0
  const displayGoal = dailyGoal || 0;
  const displayIntake = waterIntake || 0;

  if (error) {
    console.error('Erro ao carregar dados:', error);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Texto de Progresso */}
        <WaterProgressText
          current={displayIntake}
          goal={displayGoal}
        />
        
        {/* Gota Interativa */}
        <WaterProgressCustom
          percentage={percentage}
          width={150}
          height={200}
        />
      </div>
    </div>
  );
};

export default WaterDisplay;
