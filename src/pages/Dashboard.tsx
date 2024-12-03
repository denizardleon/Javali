import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGear } from 'react-icons/fa6';
import { VirtualPet } from '../components/organisms/Pet/VirtualPet';
import { PetStatus } from '../components/molecules/Pet/PetStatus';
import { WaterDisplay } from '../components/molecules/Water/WaterDisplay'; 
import { useAuthStore } from '../store/useAuthStore';
import { useWaterStore } from '../store/useWaterStore';
import bgDash from '../assets/bg-dash.jpg';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loadHistory} = useWaterStore();

  // Carrega o histórico de consumo de água quando o usuário está autenticado
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await loadHistory();
        } catch (error) {
          console.error('Erro ao carregar histórico de consumo:', error);
        }
      }
    };

    loadData();
  }, [user, loadHistory]);

  // Redireciona para login se não houver usuário autenticado
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Área principal do dashboard com imagem de fundo */}
      <div 
        className="h-[calc(100vh-200px)] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgDash})` }}
      >
        {/* Botão de acesso rápido às configurações do perfil */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-5 left-5 text-white p-2 rounded-full hover:bg-white/10 z-10"
        >
          <FaGear size={42} />
        </button>
        
        {/* Container principal com elementos do dashboard */}
        <div className="flex flex-col h-full justify-between py-10">
          {/* Componente que mostra o progresso diário de consumo de água */}
          <WaterDisplay />

          {/* Área central com o pet virtual interativo */}
          <div className="flex-1 flex items-center justify-center mt-5">
            <VirtualPet size="large" />
          </div>
        </div>
      </div>

      {/* Barra inferior com status do pet */}
      <div className="h-[200px] bg-gradient-primary">
        {/* Status do pet */}
        <div className="flex justify-center">
          <PetStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;