import React from 'react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProgressBar } from '../../atoms/Progress/ProgressBar';

interface HistoryEntry {
  amount: number;
  created_at: string;
}

interface HistoryDetailItemProps {
  /**
   * Data do registro
   */
  date: string;
  
  /**
   * Total de água consumida no dia
   */
  total: number;
  
  /**
   * Meta diária
   */
  dailyGoal: number;
  
  /**
   * Lista de registros do dia
   */
  entries: HistoryEntry[];
}

/**
 * Componente molecular que exibe os detalhes de um dia no histórico
 */
export const HistoryDetailItem: React.FC<HistoryDetailItemProps> = ({
  date,
  total,
  dailyGoal,
  entries
}) => {
  const progress = (total / dailyGoal) * 100;
  const metGoal = total >= dailyGoal;
  const isCurrentDay = isToday(new Date(date));

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-medium">
            {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
          </span>
          {isCurrentDay && (
            <span className="ml-2 text-sm text-blue-500">(Hoje)</span>
          )}
        </div>
        <div className="text-right">
          <span className="font-medium">{total}ml</span>
          <span className="ml-2">
            {metGoal ? '✅' : '❌'}
          </span>
        </div>
      </div>

      <ProgressBar 
        progress={progress}
        className={metGoal ? 'bg-green-500' : 'bg-blue-500'}
      />

      <div className="text-sm text-gray-500 mt-2">
        Meta: {dailyGoal}ml • Progresso: {Math.round(progress)}%
      </div>

      <div className="mt-2 space-y-1">
        {entries.map((entry, idx) => (
          <div key={idx} className="text-sm text-gray-600">
            {format(new Date(entry.created_at), 'HH:mm')} - {entry.amount}ml
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryDetailItem;
