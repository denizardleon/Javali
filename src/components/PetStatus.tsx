import React from 'react';
import { useWaterStore } from '../store/useWaterStore';

interface StatusInfo {
  text: string;
  emoji: string;
  description: string;
}

export const PetStatus: React.FC = () => {
  const { getDailyProgress, history } = useWaterStore();
  const progress = getDailyProgress();
  
  const getHydrationStatus = (): StatusInfo => {
    // Verifica se é o primeiro dia
    const isFirstDay = history.length === 0;

    if (isFirstDay) {
      return {
        text: 'INICIANTE',
        emoji: '🌱',
        description: 'Primeiro dia no app!'
      };
    }

    // Status baseado na porcentagem de água ingerida
    if (progress >= 100) {
      return {
        text: 'HIDRATADO',
        emoji: '😊',
        description: 'Meta do dia atingida!'
      };
    }
    if (progress >= 75) {
      return {
        text: 'QUASE LÁ',
        emoji: '😌',
        description: 'Falta pouco!'
      };
    }
    if (progress >= 50) {
      return {
        text: 'PROGREDINDO',
        emoji: '🚰',
        description: 'Continue assim!'
      };
    }
    if (progress >= 25) {
      return {
        text: 'COM SEDE',
        emoji: '😕',
        description: 'Beba mais água!'
      };
    }
    return {
      text: 'DESIDRATADO',
      emoji: '😢',
      description: 'Precisa se hidratar!'
    };
  };

  const status = getHydrationStatus();

  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4 px-4">
      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{status.text}</span>
          <span className="text-xl">{status.emoji}</span>
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">{status.description}</span>
        </div>
      </div>
    </div>
  );
};