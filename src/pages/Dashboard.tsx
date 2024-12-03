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
  const { loadHistory, isLoading, error } = useWaterStore();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await loadHistory();
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      }
    };

    loadData();
  }, [user, loadHistory]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Conteúdo Principal com Fundo */}
      <div 
        className="h-[calc(100vh-200px)] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgDash})` }}
      >
        {/* Botão de Configurações */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-5 left-5 text-white p-2 rounded-full hover:bg-white/10 z-10"
        >
          <FaGear size={42} />
        </button>
        
        {/* Conteúdo */}
        <div className="flex flex-col h-full justify-between py-10">
          {/* Progresso de Água */}
          <WaterDisplay />

          {/* Pet Virtual */}
          <div className="flex-1 flex items-center justify-center mt-5">
            <VirtualPet size="large" />
          </div>
        </div>
      </div>

      {/* Container Inferior */}
      <div className="h-[200px] bg-gradient-primary">
        {/* Status do Pet */}
        <div className="flex justify-center">
          <PetStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;