import React from 'react'
import { X } from 'lucide-react'
import { useWaterStore } from '../store/useWaterStore'
import { format, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface HistoryModalProps {
  onClose: () => void
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
  const { history, dailyGoal } = useWaterStore()

  // Agrupa consumo por dia
  const dailyTotals = history.reduce((acc, entry) => {
    const date = entry.date
    if (!acc[date]) {
      acc[date] = {
        total: 0,
        entries: []
      }
    }
    acc[date].total += entry.amount
    acc[date].entries.push(entry)
    return acc
  }, {} as Record<string, { total: number, entries: typeof history }>)

  // Converte para array e ordena por data
  const sortedDays = Object.entries(dailyTotals)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Histórico de Hidratação</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {sortedDays.map(([date, data]) => {
              const progress = (data.total / dailyGoal) * 100
              const metGoal = data.total >= dailyGoal
              const isCurrentDay = isToday(new Date(date))

              return (
                <div key={date} className="bg-gray-50 rounded-lg p-4">
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
                      <span className="font-medium">{data.total}ml</span>
                      <span className="ml-2">
                        {metGoal ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metGoal ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    Meta: {dailyGoal}ml • Progresso: {Math.round(progress)}%
                  </div>

                  <div className="mt-2 space-y-1">
                    {data.entries.map((entry, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        {format(new Date(entry.created_at), 'HH:mm')} - {entry.amount}ml
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}