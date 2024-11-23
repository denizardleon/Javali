import React from 'react';
import { Input, InputProps } from './Input';

export interface DateInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Componente de input para datas no formato dd/mm/aaaa
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    
    if (input.length > 8) {
      input = input.slice(0, 8);
    }
    
    // Adiciona as barras
    if (input.length >= 4) {
      input = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4)}`;
    } else if (input.length >= 2) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }
    
    onChange(input);
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      maxLength={10}
      {...props}
    />
  );
};

export default DateInput;
