import React from 'react'

interface LoadingButtonProps {
  loading: boolean
  text: string
  loadingText?: string
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  text,
  loadingText = 'CARREGANDO...',
  className = '',
  type = 'button',
  onClick,
  disabled
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`glass-button w-full disabled:opacity-50 ${className}`}
    >
      {loading ? loadingText : text}
    </button>
  )
}