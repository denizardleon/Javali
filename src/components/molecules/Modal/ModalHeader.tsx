import React from 'react';
import { X } from 'lucide-react';
import { IconButton } from '../../atoms/Button/IconButton';
import { Title } from '../../atoms/Typography/Title';

interface ModalHeaderProps {
  /**
   * Título do modal
   */
  title: string;
  
  /**
   * Handler para fechar o modal
   */
  onClose: () => void;
}

/**
 * Componente molecular para o cabeçalho de modais
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose
}) => (
  <div className="flex justify-between items-center p-4 border-b">
    <Title level={2} className="text-lg text-gray-900">
      {title}
    </Title>
    <IconButton icon={X} onClick={onClose} />
  </div>
);

export default ModalHeader;
