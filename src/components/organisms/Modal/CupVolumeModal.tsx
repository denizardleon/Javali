import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { useWaterStore } from '../../../store/useWaterStore';
import { ModalHeader } from '../../molecules/Modal/ModalHeader';
import { ModalBody } from '../../molecules/Modal/ModalBody';

interface CupVolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CupVolumeModal: React.FC<CupVolumeModalProps> = ({ isOpen, onClose }) => {
  const { setCupVolume, cupVolume, loadHistory } = useWaterStore();
  const [volume, setVolume] = useState(cupVolume);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await setCupVolume(volume);
      await loadHistory(); // Recarrega os dados após salvar
      onClose();
    } catch (error) {
      console.error('Error setting cup volume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Volume do Copo" onClose={onClose} />
      <ModalBody>
        <p className="modal-text mb-4">
          Defina a quantidade de água adicionada a cada clique
        </p>
        
        {/* Imput para definir o volume do copo */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <input
            type="number"
            min="50"
            max="1000"
            step="50"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="modal-input"
          />
          <span className="modal-text">
            ml
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
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

export default CupVolumeModal;
