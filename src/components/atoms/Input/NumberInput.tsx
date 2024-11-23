import React from 'react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  /**
   * Valor atual do input
   */
  value: number;
  
  /**
   * Handler para mudança de valor
   */
  onChange: (value: number) => void;
  
  /**
   * Valor mínimo permitido
   */
  min?: number;
  
  /**
   * Valor máximo permitido
   */
  max?: number;
  
  /**
   * Incremento/decremento do input
   */
  step?: number;
}

/**
 * Componente atômico para entrada de números
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  className = '',
  ...props
}) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    min={min}
    max={max}
    step={step}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default NumberInput;
