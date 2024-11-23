import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useWaterStore } from '../../../store/useWaterStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { WaterAddedAnimation } from '../Animation/WaterAddedAnimation';
import dropMask from '../../../assets/drop-mask.png';
import waterTexture from '../../../assets/water-texture.png';

interface WaterProgressCustomProps {
  /**
   * Porcentagem de preenchimento (0-100)
   */
  percentage: number;
  
  /**
   * Classes adicionais para customização
   */
  className?: string;
  
  /**
   * Largura da gota
   */
  width?: number;
  
  /**
   * Altura da gota
   */
  height?: number;
}

/**
 * Componente atômico que renderiza uma gota d'água com animação de preenchimento
 */
export const WaterProgressCustom: React.FC<WaterProgressCustomProps> = ({
  percentage,
  className,
  width = 150,
  height = 200
}) => {
  const [fillHeight, setFillHeight] = useState(0);
  const { cupVolume, addWater } = useWaterStore();
  const { user } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastAddedAmount, setLastAddedAmount] = useState(0);

  // Efeito para animação do preenchimento
  useEffect(() => {
    const targetHeight = (percentage / 100) * height;
    
    let animationFrameId: number;
    let startTime: number | null = null;
    const animationDuration = 1000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      setFillHeight(targetHeight * easedProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [percentage, height]);

  const handleAddWater = async () => {
    if (!user) return;

    try {
      await addWater(cupVolume || 250);
      // Usar o cupVolume diretamente para a animação
      setLastAddedAmount(cupVolume || 250);
      setShowAnimation(true);
    } catch (error) {
      console.error('Error adding water:', error);
      setError('Erro ao adicionar água');
    }
  };

  return (
    <div className="relative">
      {showAnimation && lastAddedAmount > 0 && (
        <WaterAddedAnimation
          amount={lastAddedAmount}
          onComplete={() => {
            setShowAnimation(false);
            setLastAddedAmount(0);
          }}
        />
      )}
      {error && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-sm">
          {error}
        </div>
      )}
      <button 
        onClick={handleAddWater}
        disabled={!user}
        className={twMerge(
          'relative cursor-pointer transform hover:scale-105 transition-transform',
          className,
          !user ? 'opacity-50 cursor-not-allowed' : ''
        )}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          border: 'none',
          background: 'none',
          padding: 0
        }}
      >
        <div className="relative w-full h-full">
          {/* Máscara da gota */}
          <img 
            src={dropMask}
            alt="Drop Mask"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Container da água com máscara */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
              maskImage: `url(${dropMask})`,
              WebkitMaskImage: `url(${dropMask})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          >
            {/* Água */}
            <div 
              className="absolute left-0 w-full h-full"
              style={{
                transform: `translateY(${100 - percentage}%)`,
                transition: 'transform 1s ease-out'
              }}
            >
              <img 
                src={waterTexture}
                alt="Water Texture"
                className="w-full h-full object-cover"
                style={{
                  transform: 'scale(1.4)',
                  transformOrigin: 'center',
                  imageRendering: 'pixelated'
                }}
              />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default WaterProgressCustom;
