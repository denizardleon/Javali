import React from 'react';
import copoImg from '../../../assets/copo.png';
import logoImg from '../../../assets/logo.png';
import capyImg from '../../../assets/capy.png';

export const Copo: React.FC = () => {
  return (
    <div className="mt-8">
      <img 
        src={copoImg}
        alt="Copo" 
        className="w-72 h-96 mx-auto"
      />
    </div>
  );
};

export const Logo: React.FC = () => {
  return (
    <img 
      src={logoImg}
      alt="Logo" 
      className="w-24 h-32"
    />
  );
};

export const Capy: React.FC = () => {
  return (
    <div className="mt-8">
      <img 
        src={capyImg}
        alt="Capy" 
        className="w-50 h-80 mx-auto"
      />
    </div>
  );
};