import React, { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { ModalHeader } from '../../molecules/Modal/ModalHeader';
import { ModalBody } from '../../molecules/Modal/ModalBody';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { useWaterStore } from '../../../store/useWaterStore';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente organismo para configuração da meta diária de água
 */
export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({ isOpen, onClose }) => {
  const { setDailyGoal, dailyGoal, weight, getRecommendedIntake, loadHistory } = useWaterStore();
  const [goal, setGoal] = useState(dailyGoal);
  const [isLoading, setIsLoading] = useState(false);
  
  // Atualiza o goal quando dailyGoal mudar
  useEffect(() => {
    setGoal(dailyGoal);
  }, [dailyGoal]);
  
  const recommendedIntake = getRecommendedIntake();

  const handleSave = async () => {
    if (!goal || goal < 500 || goal > 5000) {
      return;
    }

    try {
      setIsLoading(true);
      await setDailyGoal(goal);
      await loadHistory(); // Recarrega os dados após salvar
      onClose();
    } catch (error) {
      console.error('Erro ao definir meta diária:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza o modal para configuração da meta diária de água
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Meta Diária" onClose={onClose} />
      <ModalBody>
        <div className="space-y-4">
          <div>
            <p className="modal-text">
              Defina sua meta diária de consumo de água
            </p>
          </div>
          
          {/* Exibe recomendação baseada no peso, se disponível */}
          {weight && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Com base no seu peso, a quantidade recomendada é de {recommendedIntake}ml por dia (35ml por kg)
              </p>
            </div>
          )}
        
          {/* Input para inserção da meta */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <Input
              type="number"
              min="500"
              max="5000"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </ModalBody>
      {/* Botões de ação */}
      <div className="flex justify-end gap-2 p-4">
        <Button onClick={onClose} variant="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </Modal>
  );
};
