import React from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { Title } from '../../atoms/Typography/Title';
import { HistoryItem } from '../../molecules/History/HistoryItem';
import { IconButton } from '../../atoms/Button/IconButton';
import { ChevronLeft } from 'lucide-react';

interface HistoryProps {
  onBack: () => void;
}

/**
 * Componente organismo que exibe o histórico completo de consumo de água
 */
export const History: React.FC<HistoryProps> = ({ onBack }) => {
  const { history, dailyGoal } = useWaterStore();
  
  // Agrupar consumo por dia
  const dailyTotals = history.reduce((acc, entry) => {
    const current = acc.get(entry.date) || 0;
    acc.set(entry.date, current + entry.amount);
    return acc;
  }, new Map<string, number>());

  // Converter para array e ordenar por data
  const sortedDays = Array.from(dailyTotals.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 gap-2">
        <IconButton
          icon={ChevronLeft}
          onClick={onBack}
          size={24}
        />
        <Title className="text-xl font-bold">
          Histórico
        </Title>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedDays.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum registro encontrado
          </p>
        ) : (
          <div className="space-y-4">
            {sortedDays.map(([date, total]) => (
              <HistoryItem
                key={date}
                date={date}
                amount={total}
                goal={dailyGoal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
