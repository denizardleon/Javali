import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SimpleProgressBar } from '../../atoms/Progress/SimpleProgressBar';

interface HistoryItemProps {
  /**
   * Data do registro
   */
  date: string;
  
  /**
   * Total de água consumida no dia
   */
  total: number;
  
  /**
   * Meta diária de consumo
   */
  dailyGoal: number;
}

/**
 * Componente molecular que representa um item do histórico de consumo
 */
export const HistoryItem: React.FC<HistoryItemProps> = ({
  date,
  total,
  dailyGoal
}) => {
  const progress = (total / dailyGoal) * 100;
  const metGoal = total >= dailyGoal;

  return (
    <div className="bg-white/10 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white">
          {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
        </span>
        <span className="text-white font-medium">
          {total}ml
          {metGoal && ' ✅'}
        </span>
      </div>
      <SimpleProgressBar progress={progress} />
    </div>
  );
};

export default HistoryItem;
