import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { useWaterStore } from '../../../store/useWaterStore';
import { ModalHeader } from '../../molecules/Modal/ModalHeader';
import { ModalBody } from '../../molecules/Modal/ModalBody';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente organismo para configuração da meta diária de água
 */
export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({ isOpen, onClose }) => {
  const { setDailyGoal, dailyGoal } = useWaterStore();
  const [goal, setGoal] = useState(dailyGoal);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await setDailyGoal(goal);
      onClose();
    } catch (error) {
      console.error('Error setting daily goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Meta Diária" onClose={onClose} />
      <ModalBody>
        <p className="modal-text mb-4">
          Defina sua meta diária de consumo de água
        </p>
        
        <div className="flex flex-col items-center gap-4 mb-6">
          <input
            type="number"
            min="500"
            max="5000"
            step="100"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="modal-input"
          />
          <span className="modal-text">
            ml
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DailyGoalModal;
