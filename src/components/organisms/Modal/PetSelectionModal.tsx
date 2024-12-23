import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { useWaterStore } from '../../../store/useWaterStore';
import { ModalHeader } from '../../molecules/Modal/ModalHeader';
import { ModalBody } from '../../molecules/Modal/ModalBody';
import { Pet } from '../../atoms/Pet/Pet';

// Define as propriedades do componente
interface PetSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define os tipos de pets disponíveis
const AVAILABLE_PETS = ['capybara', 'cat'] as const;
type PetType = typeof AVAILABLE_PETS[number];

/**
 * Componente organismo para seleção do pet virtual
 */
export const PetSelectionModal: React.FC<PetSelectionModalProps> = ({ isOpen, onClose }) => {
  // Obtém os estados e funções do store
  const { selectedPet, setSelectedPet, error, loadHistory } = useWaterStore();
  // Estados locais para controle da seleção, carregamento e erros
  const [selected, setSelected] = useState<PetType>(selectedPet);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Função para salvar o pet selecionado
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      console.log('Salvando pet selecionado:', selected);
      await setSelectedPet(selected);
      await loadHistory(); // Recarrega os dados após salvar
      console.log('Pet salvo com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error setting pet:', error);
      setLocalError('Erro ao salvar o pet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Escolha seu Pet" onClose={onClose} />
      <ModalBody>
        <p className="modal-text mb-4">
          Selecione o pet que irá te acompanhar
        </p>
        
        {/* Exibe mensagens de erro, se houver */}
        {(localError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {localError || error}
          </div>
        )}
        
        {/* Grid de seleção de pets */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {AVAILABLE_PETS.map((pet) => (
            <button
              key={pet}
              onClick={() => setSelected(pet)}
              className={`
                p-4 rounded-lg transition-all
                ${selected === pet 
                  ? 'bg-turquoise-100 ring-2 ring-turquoise-500' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <Pet type={pet} size="small" />
              <p className="text-sm mt-2 capitalize">
                {pet === 'capybara' ? 'Capivara' : 'Gato'}
              </p>
            </button>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || selected === selectedPet}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default PetSelectionModal;
