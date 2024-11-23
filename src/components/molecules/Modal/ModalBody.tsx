import React from 'react';

interface ModalBodyProps {
  /**
   * Conteúdo do corpo do modal
   */
  children: React.ReactNode;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente molecular para o corpo de modais
 */
export const ModalBody: React.FC<ModalBodyProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export default ModalBody;
