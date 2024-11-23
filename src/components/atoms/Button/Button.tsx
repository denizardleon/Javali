import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante de estilo do botão
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'rounded';

  /**
   * Se o botão deve ocupar toda a largura disponível
   */
  fullWidth?: boolean;
}

/**
 * Componente base de botão que segue o design system da aplicação
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'px-4 py-2.5 font-bevan transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'rounded-lg bg-white text-[#00b4c5] hover:bg-gray-50 active:bg-gray-100',
    secondary: 'rounded-lg bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700',
    outline: 'rounded-lg bg-white text-[#00b4c5] border-2 border-[#00b4c5] hover:bg-gray-50 active:bg-gray-100',
    rounded: 'rounded-full bg-white text-[#0073e6] hover:bg-gray-50 active:bg-gray-100'
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
