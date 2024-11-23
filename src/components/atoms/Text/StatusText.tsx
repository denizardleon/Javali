import React from 'react';
import { twMerge } from 'tailwind-merge';

interface StatusTextProps {
  children: React.ReactNode;
  /**
   * Se o texto deve usar a cor roxa do tema
   */
  highlighted?: boolean;
  /**
   * Classes adicionais para customização
   */
  className?: string;
}

/**
 * Componente atômico para texto de status com estilo consistente
 */
export const StatusText: React.FC<StatusTextProps> = ({
  children,
  highlighted = false,
  className
}) => {
  return (
    <span className={twMerge(
      'font-medium text-base leading-tight',
      highlighted ? 'text-violet-600' : 'text-gray-900',
      className
    )}>
      {children}
    </span>
  );
};

export default StatusText;
