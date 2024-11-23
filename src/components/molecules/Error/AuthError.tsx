import React from 'react';

interface AuthErrorProps {
  /**
   * Mensagem de erro para exibir
   */
  message: string;
}

/**
 * Componente molecular para exibir erros de autenticação
 */
export const AuthError: React.FC<AuthErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default AuthError;
