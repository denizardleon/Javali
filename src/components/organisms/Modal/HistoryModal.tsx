import React from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { ModalHeader } from '../../molecules/Modal/ModalHeader';
import { HistoryDetailItem } from '../../molecules/History/HistoryDetailItem';

interface HistoryModalProps {
  /**
   * Handler para fechar o modal
   */
  onClose: () => void;
}

/**
 * Componente organismo que exibe o histórico detalhado de consumo de água
 */
export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
  const { history, dailyGoal } = useWaterStore();

  // Agrupa consumo por dia
  const dailyTotals = history.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = {
        total: 0,
        entries: []
      };
    }
    acc[date].total += entry.amount;
    acc[date].entries.push({
      amount: entry.amount,
      created_at: entry.date
    });
    return acc;
  }, {} as Record<string, { total: number; entries: { amount: number; created_at: string }[] }>);

  // Converte para array e ordena por data
  const sortedDays = Object.entries(dailyTotals)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <ModalHeader title="Histórico de Hidratação" onClose={onClose} />

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {sortedDays.map(([date, data]) => (
              <HistoryDetailItem
                key={date}
                date={date}
                total={data.total}
                dailyGoal={dailyGoal}
                entries={data.entries}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
