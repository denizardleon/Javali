import React from 'react';

interface SettingsTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SettingsTitle: React.FC<SettingsTitleProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <h2 style={{ fontFamily: 'Arial' }} className={`font-bold text-sm text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

export default SettingsTitle;
