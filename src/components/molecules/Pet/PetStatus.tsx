import React from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { RoundedContainer } from '../../atoms/Container/RoundedContainer';
import { StatusText } from '../../atoms/Text/StatusText';

type PetMood = 'happy' | 'normal' | 'sad';

interface PetStatusInfo {
  mood: PetMood;
  statusText: string;
  streakText: string;
  streakValue: number | null;
}

const getMoodEmoji = (mood: PetMood) => {
  switch (mood) {
    case 'happy': return '😊';
    case 'normal': return '😐';
    case 'sad': return '☹';
  }
};

/**
 * molecula que mostra o status do pet
 */
export const PetStatus: React.FC = () => {
  const { getDailyProgress, getStreak } = useWaterStore();
  
  const getStatusInfo = (): PetStatusInfo => {
    const progress = getDailyProgress();
    const streak = getStreak();
    
    if (streak === 0) {
      return {
        mood: 'normal',
        statusText: 'PRONTO\nPRA\nCOMEÇAR',
        streakText: 'Bem-vindo ao\nJavali!',
        streakValue: null
      };
    }
    
    if (progress < 0.5) {
      return {
        mood: 'sad',
        statusText: 'DESIDRA-\nTADA',
        streakText: 'Dias sem\natingir a meta',
        streakValue: streak
      };
    }
    
    if (streak > 0) {
      return {
        mood: 'happy',
        statusText: 'HIDRA-\nTADA',
        streakText: 'Dias seguindo\na meta',
        streakValue: streak
      };
    }
    
    return {
      mood: 'normal',
      statusText: 'QUASE\nLÁ',
      streakText: 'Continue\nbebendo água',
      streakValue: null
    };
  };

  const statusInfo = getStatusInfo();
  const emoji = getMoodEmoji(statusInfo.mood);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cyan-500 p-4 pt-6 pb-0 flex justify-center">
      <div className="flex flex-col items-center space-y-4 w-80">
        {/* cabecalho  de status*/}
        <RoundedContainer
          roundedClasses="rounded-full"
          paddingClasses="px-8 py-2"
          className="mb-2"
        >
          <div className="text-center"> {/* forçando essa bicheira a centralizar*/}
          <StatusText>
            STATUS DO PET
          </StatusText>
          </div>
        </RoundedContainer>
        
        <div className="flex items-start gap-6 w-full justify-between">
          {/* Status do Pet */}
          <RoundedContainer
            roundedClasses="rounded-t-[3rem] rounded-b-none"
            paddingClasses="pt-4 px-6 pb-5"
            widthClasses="w-36"
          >
            <div className="flex flex-col items-center">
              <div className="text-4xl text-violet-600 mb-10">{emoji}</div>
              {statusInfo.statusText.split('\n').map((line, index) => (
                <StatusText 
                  key={index}
                  highlighted
                >
                  {line}
                </StatusText>
              ))}
            </div>
          </RoundedContainer>

          {/* Contador de Dias */}
          <RoundedContainer
            roundedClasses="rounded-xl"
            paddingClasses="p-4"
            widthClasses="w-36"
          >
            <div className="flex flex-col items-center">
              {statusInfo.streakText.split('\n').map((line, index) => (
                <StatusText 
                  key={index}
                  className="text-center"
                >
                  {line}
                </StatusText>
              ))}
              {statusInfo.streakValue !== null && (
                <StatusText 
                  highlighted
                  className="text-3xl mt-2 font-bold"
                >
                  {statusInfo.streakValue}
                </StatusText>
              )}
            </div>
          </RoundedContainer>
        </div>
      </div>
    </div>
  );
};

export default PetStatus;
