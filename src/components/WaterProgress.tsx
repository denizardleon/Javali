import React from 'react'
import { useWaterStore } from '../store/useWaterStore'

export const WaterProgress: React.FC = () => {
  const { waterIntake, dailyGoal } = useWaterStore()
  const progress = Math.min((waterIntake / dailyGoal) * 100, 100)
  const actualProgress = (waterIntake / dailyGoal) * 100

  return (
    <div className="w-40 h-48 mx-auto mt-8">
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 120" className="w-full h-full">
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
            </linearGradient>
            <linearGradient id="waterFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(100, 200, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(50, 150, 255, 0.9)" />
            </linearGradient>
            <filter id="waterBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <mask id="dropMask">
              <path
                d="M50,10 
                   C50,10 90,65 90,95 
                   C90,110 72,115 50,115 
                   C28,115 10,110 10,95 
                   C10,65 50,10 50,10 Z"
                fill="white"
              />
            </mask>
          </defs>
          
          {/* Drop outline */}
          <path
            d="M50,10 
               C50,10 90,65 90,95 
               C90,110 72,115 50,115 
               C28,115 10,110 10,95 
               C10,65 50,10 50,10 Z"
            fill="url(#waterGradient)"
          />
          
          {/* Water fill */}
          <g mask="url(#dropMask)">
            <rect
              x="0"
              y="0"
              width="100"
              height="120"
              fill="url(#waterFillGradient)"
              transform={`translate(0, ${120 - (progress * 1.05)})`}
            />
            {/* Wavy top surface effect */}
            <path
              d={`M0,${120 - (progress * 1.05)} 
                  C20,${118 - (progress * 1.05)} 40,${122 - (progress * 1.05)} 60,${118 - (progress * 1.05)}
                  C80,${114 - (progress * 1.05)} 100,${118 - (progress * 1.05)} 120,${120 - (progress * 1.05)}`}
              fill="rgba(255, 255, 255, 0.3)"
              filter="url(#waterBlur)"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values={`M0,${120 - (progress * 1.05)} 
                        C20,${118 - (progress * 1.05)} 40,${122 - (progress * 1.05)} 60,${118 - (progress * 1.05)}
                        C80,${114 - (progress * 1.05)} 100,${118 - (progress * 1.05)} 120,${120 - (progress * 1.05)};
                        
                        M0,${120 - (progress * 1.05)} 
                        C20,${122 - (progress * 1.05)} 40,${118 - (progress * 1.05)} 60,${122 - (progress * 1.05)}
                        C80,${118 - (progress * 1.05)} 100,${122 - (progress * 1.05)} 120,${120 - (progress * 1.05)};
                        
                        M0,${120 - (progress * 1.05)} 
                        C20,${118 - (progress * 1.05)} 40,${122 - (progress * 1.05)} 60,${118 - (progress * 1.05)}
                        C80,${114 - (progress * 1.05)} 100,${118 - (progress * 1.05)} 120,${120 - (progress * 1.05)}`}
              />
            </path>
          </g>
          
          {/* Progress text */}
          <foreignObject x="0" y="40" width="100" height="80">
            <div className="h-full flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white">
                {Math.round(actualProgress)}%
              </span>
              <span className="text-sm text-white">
                {(waterIntake / 1000).toFixed(2)}/{(dailyGoal / 1000).toFixed(1)}L
              </span>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  )
}