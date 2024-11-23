import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label do input
   */
  label?: string;
}

/**
 * Componente base de input que segue o design system da aplicação
 */
export const Input: React.FC<InputProps> = ({
  label,
  className = '',
  type,
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-1.5 bg-white rounded-lg text-black';
  const dateStyles = type === 'date' ? '[&::-webkit-datetime-edit-text]:invisible [&::-webkit-datetime-edit-year-field]:text-black [&::-webkit-datetime-edit-month-field]:text-black [&::-webkit-datetime-edit-day-field]:text-black [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit-fields-wrapper]:text-black [&::-webkit-datetime-edit]:text-black [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-ampm-field]:hidden [&::-webkit-datetime-edit-fields-wrapper]:hidden [&:not(:focus)::-webkit-datetime-edit]:hidden' : '';

  return (
    <div className="w-[80%] mx-auto">
      {label && (
        <label htmlFor={props.id} className="block text-black font-inder text-left mb-1 text-sm">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`${baseStyles} ${dateStyles} ${className}`}
        {...props}
        placeholder={type === 'date' ? '' : props.placeholder}
      />
    </div>
  );
};

export default Input;
