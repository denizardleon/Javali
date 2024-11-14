import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useWaterStore } from '../store/useWaterStore';
import { useAuthStore } from '../store/useAuthStore';

export const WaterTracker: React.FC = () => {
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState(200);
  const { user } = useAuthStore();
  const { addWater } = useWaterStore();

  const handleAddWater = async () => {
    if (!user?.id || adding) return;
    
    setAdding(true);
    try {
      await addWater(amount, user.id);
    } catch (err) {
      console.error('Failed to add water:', err);
    } finally {
      setAdding(false);
    }
  };

  const adjustAmount = (delta: number) => {
    const newAmount = amount + delta;
    if (newAmount >= 50 && newAmount <= 1000) {
      setAmount(newAmount);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-2 max-w-[200px]">
        <button
          onClick={() => adjustAmount(-50)}
          className="bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-bold text-white w-16 text-center">
          {amount}ml
        </span>
        <button
          onClick={() => adjustAmount(50)}
          className="bg-white/30 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={handleAddWater}
        disabled={adding}
        className="bg-white/30 hover:bg-white/40 text-white py-2 px-6 rounded-full flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 text-sm"
      >
        <Plus size={16} />
        <span>Beber água</span>
      </button>
    </div>
  );
};