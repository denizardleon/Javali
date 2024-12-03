// Página inicial do aplicativo que apresenta as opções de login e registro
// Usa gradiente de azul para branco no fundo e elementos centralizados

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button/Button';
import { Copo, Logo } from '../components/atoms/Images/Images';

export const Home: React.FC = () => {
  // Hook do React Router para navegação entre páginas
  const navigate = useNavigate();

  return (
    // Container principal com altura mínima da tela e gradiente
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-b from-[#01b4c5] to-[#D9D9D9]">
      {/* Área do logo */}
      <div className="mb-6 text-center">
        <Logo />
      </div>

      {/* Área dos botões de ação */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md space-y-4">
          {/* Botão de login - redireciona para a página de login */}
          <Button
            onClick={() => navigate('/login')}
            variant="rounded"
            fullWidth
          >
            FAZER LOGIN
          </Button>

          {/* Botão de registro - redireciona para a página de criação de conta */}
          <Button
            onClick={() => navigate('/register')}
            variant="rounded"
            fullWidth
          >
            CRIAR CONTA
          </Button>
        </div>
        
        {/* Imagem decorativa do copo */}
        <Copo />
      </div>
    </div>
  );
};

export default Home;
