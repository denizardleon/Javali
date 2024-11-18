import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useWaterStore } from '../store/useWaterStore';
import { Settings2 } from 'lucide-react';
import { VirtualPet } from '../components/VirtualPet';
import { WaterProgress } from '../components/WaterProgress';
import { Settings } from '../components/Settings';
import { WaterTracker } from '../components/WaterTracker';
import { PetStatus } from '../components/PetStatus';
import backgroundImage from 'src/img/background.png';

export const Dashboard: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const { loadHistory } = useWaterStore();

  useEffect(() => {
    const initializeDashboard = async () => {

      try {
        if (user?.id) {
          await loadHistory(user.id);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
        setError('Falha ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [user?.id, loadHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10 z-10"
      >
        <Settings2 size={24} />
      </button>

      <WaterProgress />
      
      <div className="flex-1 flex flex-col items-center justify-center mt-12">
        <VirtualPet />
        <div className="mt-8">
          <WaterTracker />
        </div>
      </div>

      <PetStatus />
    </div>
  );
};