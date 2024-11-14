import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useWaterStore } from '../store/useWaterStore'

export const History: React.FC = () => {
  const { history, dailyGoal } = useWaterStore()
  
  // Agrupar consumo por dia
  const dailyTotals = history.reduce((acc, entry) => {
    const current = acc.get(entry.date) || 0
    acc.set(entry.date, current + entry.amount)
    return acc
  }, new Map<string, number>())

  // Converter para array e ordenar por data
  const sortedDays = Array.from(dailyTotals.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Histórico</h2>
      <div className="space-y-3">
        {sortedDays.map(([date, total]) => {
          const progress = (total / dailyGoal) * 100
          const metGoal = total >= dailyGoal

          return (
            <div key={date} className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">
                  {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
                </span>
                <span className="text-white font-medium">
                  {total}ml
                  {metGoal && ' ✅'}
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}