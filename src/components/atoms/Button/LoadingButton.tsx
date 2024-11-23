import React from 'react';
import Button, { ButtonProps } from './Button';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  /**
   * Estado de carregamento do botão
   */
  loading: boolean;
  
  /**
   * Texto exibido durante o carregamento
   */
  loadingText?: string;
  
  /**
   * Conteúdo do botão
   */
  children: React.ReactNode;
}

/**
 * Botão com estado de carregamento que estende o Button base
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  loadingText = 'CARREGANDO...',
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
