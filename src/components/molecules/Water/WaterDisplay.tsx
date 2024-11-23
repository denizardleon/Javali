import React from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { WaterProgressCustom } from '../../atoms/Water/WaterProgressCustom';
import { WaterProgressText } from '../../atoms/Water/WaterProgressText';

/**
 * Componente molecular que exibe o progresso de água com animação customizada
 */
export const WaterDisplay: React.FC = () => {
  const { waterIntake, dailyGoal, getDailyProgress } = useWaterStore();
  const percentage = getDailyProgress();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Texto de Progresso */}
        <WaterProgressText
          current={waterIntake}
          goal={dailyGoal}
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
