import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
// Imports dos componentes
import { Button } from '../../atoms/Button/Button';
import { Title } from '../../atoms/Typography/Title';
import { IconButton } from '../../atoms/Button/IconButton';
import { PetSelectionModal } from '../Modal/PetSelectionModal';
import { DailyGoalModal } from '../Modal/DailyGoalModal';
import { CupVolumeModal } from '../Modal/CupVolumeModal';

// Imports de ícones
import { ChevronLeft } from 'lucide-react';

// Props do componente
interface SettingsProps {
  onBack: () => void;
}

/**
 * Componente de configurações que permite ao usuário:
 * - Selecionar um pet
 * - Definir meta diária de água
 * - Configurar volume do copo
 * - Fazer logout
 */
export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  // Estados para controle de visibilidade dos modais
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false);
  const [showCupVolumeModal, setShowCupVolumeModal] = useState(false);

  const { signOut } = useAuthStore();

  // Função para fazer logout do usuário
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Renderiza o conteúdo principal com os botões de configuração
  const renderContent = () => {
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
        <Button onClick={handleSignOut} variant="outline" fullWidth>
          Sair
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
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
