import React, { useState } from 'react';
import { useWaterStore } from '../../../store/useWaterStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Button } from '../../atoms/Button/Button';
import { Title } from '../../atoms/Typography/Title';
import { ChevronLeft } from 'lucide-react';
import { IconButton } from '../../atoms/Button/IconButton';
import { History } from '../History/History';
import { PetSelectionModal } from '../Modal/PetSelectionModal';
import { DailyGoalModal } from '../Modal/DailyGoalModal';
import { CupVolumeModal } from '../Modal/CupVolumeModal';

interface SettingsProps {
  onBack: () => void;
}

type SettingsView = 'main' | 'history';

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { signOut } = useAuthStore();
  const [view, setView] = useState<SettingsView>('main');
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false);
  const [showCupVolumeModal, setShowCupVolumeModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const renderContent = () => {
    if (view === 'history') {
      return <History onBack={() => setView('main')} />;
    }

    return (
      <div className="p-4 space-y-4">
        <Button
          onClick={() => setShowPetModal(true)}
          variant="outline"
          fullWidth
        >
          Selecionar Pet
        </Button>
        <Button
          onClick={() => setShowDailyGoalModal(true)}
          variant="outline"
          fullWidth
        >
          Meta Diária
        </Button>
        <Button
          onClick={() => setShowCupVolumeModal(true)}
          variant="outline"
          fullWidth
        >
          Volume do Copo
        </Button>
        <Button
          onClick={() => setView('history')}
          variant="outline"
          fullWidth
        >
          Histórico
        </Button>
        <Button onClick={handleSignOut} variant="outline" fullWidth>
          Sair
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {view === 'main' && (
        <div className="flex items-center p-4 gap-2">
          <IconButton
            icon={ChevronLeft}
            onClick={onBack}
            size={24}
          />
          <Title className="text-xl font-bold">
            Configurações
          </Title>
        </div>
      )}

      {renderContent()}

      {/* Modais */}
      <PetSelectionModal
        isOpen={showPetModal}
        onClose={() => setShowPetModal(false)}
      />
      <DailyGoalModal
        isOpen={showDailyGoalModal}
        onClose={() => setShowDailyGoalModal(false)}
      />
      <CupVolumeModal
        isOpen={showCupVolumeModal}
        onClose={() => setShowCupVolumeModal(false)}
      />
    </div>
  );
};

export default Settings;
