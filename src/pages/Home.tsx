import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button/Button';
import { Copo, Logo } from '../components/atoms/Images/Images';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-b from-[#01b4c5] to-[#D9D9D9]">
      <div className="mb-6 text-center">
      <Logo />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={() => navigate('/login')}
            variant="rounded"
            fullWidth
          >
            FAZER LOGIN
          </Button>

          <Button
            onClick={() => navigate('/register')}
            variant="rounded"
            fullWidth
          >
            CRIAR CONTA
          </Button>
        </div>
        
        <Copo />
      </div>
    </div>
  );
};

export default Home;
