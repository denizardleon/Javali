import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface WaterAddedAnimationProps {
  amount: number;
  onComplete: () => void;
}

export const WaterAddedAnimation: React.FC<WaterAddedAnimationProps> = ({
  amount,
  onComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={twMerge(
        'absolute bottom-25 left-10 text-white font-inder text-3xl',
        'pointer-events-none z-50'
      )}
      style={{
        animation: isAnimating ? 'bounce-fade 1s forwards' : 'none'
      }}
    >
      +{amount}ml
    </div>
  );
};

export default WaterAddedAnimation;
