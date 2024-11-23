import React from 'react';
import { twMerge } from 'tailwind-merge';

interface RoundedContainerProps {
  children: React.ReactNode;
  /**
   * Classes para arredondar os cantos. Ex: 'rounded-t-[3rem]', 'rounded-xl'
   */
  roundedClasses?: string;
  /**
   * Classes para padding. Ex: 'p-4', 'px-6 py-2'
   */
  paddingClasses?: string;
  /**
   * Classes para largura. Ex: 'w-36', 'w-full'
   */
  widthClasses?: string;
  /**
   * Classes adicionais para customização
   */
  className?: string;
}

/**
 * Componente atômico que renderiza um container com bordas arredondadas customizáveis
 */
export const RoundedContainer: React.FC<RoundedContainerProps> = ({
  children,
  roundedClasses = 'rounded-xl',
  paddingClasses = 'p-4',
  widthClasses = 'w-full',
  className
}) => {
  return (
    <div className={twMerge(
      'bg-white',
      roundedClasses,
      paddingClasses,
      widthClasses,
      className
    )}>
      {children}
    </div>
  );
};

export default RoundedContainer;
