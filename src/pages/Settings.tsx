import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useWaterStore } from '../store/useWaterStore';
import { useAuthStore } from '../store/useAuthStore';
import { SettingsTitle } from '../components/atoms/Typography/SettingsTitle';
import { 
  ChevronLeft, 
  ChevronRight,
  Globe2, 
  RefreshCcw, 
  HelpCircle, 
  Volume2,
  BellRing,
  Moon,
  Droplets,
  LogOut,
  Cat,
  Target
} from 'lucide-react';
import { IconButton } from '../components/atoms/Button/IconButton';
import { VirtualPet } from '../components/organisms/Pet/VirtualPet';
import { PetSelectionModal } from '../components/organisms/Modal/PetSelectionModal';
import { DailyGoalModal } from '../components/organisms/Modal/DailyGoalModal';
import { CupVolumeModal } from '../components/organisms/Modal/CupVolumeModal';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isStandalone?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onClick,
  isFirst,
  isLast,
  isStandalone
}) => {
  const roundedClasses = isStandalone ? 'rounded-lg' : isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : '';
  
  return (
    <button
      onClick={onClick}
      className={`w-[90%] mx-auto py-3 px-3 flex items-center justify-between bg-white shadow hover:shadow-md transition-shadow ${roundedClasses}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-turquoise-500">
          {icon}
        </div>
        <div className="text-left">
          <h3 style={{ fontFamily: 'Arial' }} className="font-bold text-sm text-gray-900">{title}</h3>
          <p style={{ fontFamily: 'Arial' }} className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isDailyGoalModalOpen, setIsDailyGoalModalOpen] = useState(false);
  const [isCupVolumeModalOpen, setIsCupVolumeModalOpen] = useState(false);
  const { clearError } = useWaterStore();
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Agrupamento dos itens de configuração
  const settingsGroups = [
    // Grupo 1: Seleção de Pet (sozinho)
    [{
      icon: <Cat className="w-8 h-" />,
      title: "Selecionar Pet",
      subtitle: "Escolha seu companheiro virtual",
      onClick: () => setIsPetModalOpen(true)
    }],
    // Grupo 2: Meta Diária e Volume do Copo
    [
      {
        icon: <Target className="w-6 h-6" />,
        title: "Meta Diária",
        subtitle: "Defina sua meta de água diária",
        onClick: () => setIsDailyGoalModalOpen(true)
      },
      {
        icon: <Droplets className="w-6 h-6" />,
        title: "Volume do Copo",
        subtitle: "Altere a quantidade de água por copo",
        onClick: () => setIsCupVolumeModalOpen(true)
      }
    ],
    // Grupo 3: Sons até Idioma
    [
      {
        icon: <Volume2 className="w-6 h-6" />,
        title: "Sons",
        subtitle: "Gerencie sons de notificação, música, etc",
        onClick: () => console.log("Sounds")
      },
      {
        icon: <BellRing className="w-6 h-6" />,
        title: "Lembretes de Água",
        subtitle: "Personalize e configure lembretes para beber água",
        onClick: () => console.log("Water reminders")
      },
      {
        icon: <Moon className="w-6 h-6" />,
        title: "Hora de Dormir",
        subtitle: "Defina um lembrete para o último gole de água",
        onClick: () => console.log("Bedtime")
      },
      {
        icon: <Globe2 className="w-6 h-6" />,
        title: "Idioma",
        subtitle: "Selecione o idioma do aplicativo",
        onClick: () => console.log("Language")
      },
      {
        icon: <LogOut className="w-6 h-6" />,
        title: "Deslogar",
        subtitle: "Sair e voltar ao menu inicial",
        onClick: handleSignOut
      }
    ]
  ];

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      {/* Header with back button */}
      <div className="absolute top-0 left-0 p-4">
        <IconButton 
          onClick={() => navigate('/dashboard')}
          icon={ChevronLeft}
          className="text-white"
        />
      </div>
  
      {/* Virtual Pet */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <VirtualPet size="large" />
      </div>
  
      {/* Settings Section */}
      <div className="bg-gray-300 flex-1 overflow-y-auto px-4 pt-5 pb-20">
        <div className="mb-2 w-[80%] mx-auto">
          <SettingsTitle className="text-left">Configurações</SettingsTitle>
        </div>
  
        <div className="space-y-4">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-[1px]">
              {group.map((item, itemIndex) => (
                <SettingsItem
                  key={itemIndex}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  onClick={item.onClick}
                  isFirst={itemIndex === 0}
                  isLast={itemIndex === group.length - 1}
                  isStandalone={group.length === 1}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
  
      {/* Modals */}
      <PetSelectionModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
      />
      <DailyGoalModal
        isOpen={isDailyGoalModalOpen}
        onClose={() => setIsDailyGoalModalOpen(false)}
      />
      <CupVolumeModal
        isOpen={isCupVolumeModalOpen}
        onClose={() => setIsCupVolumeModalOpen(false)}
      />
    </div>
  );
};
