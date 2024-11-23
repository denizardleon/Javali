import React from 'react';

interface TitleProps {
  /**
   * Conteúdo do título
   */
  children: React.ReactNode;
  
  /**
   * Classes CSS adicionais para customização
   */
  className?: string;
  
  /**
   * Nível do título (1-6)
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Componente atômico para títulos
 */
export const Title: React.FC<TitleProps> = ({ 
  children, 
  className = '',
  level = 2 
}) => {
  const baseClasses = 'font-bold text-white';
  const sizeClasses = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
    4: 'text-base',
    5: 'text-sm',
    6: 'text-xs'
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Component className={`${baseClasses} ${sizeClasses[level]} ${className}`}>
      {children}
    </Component>
  );
};

export default Title;
