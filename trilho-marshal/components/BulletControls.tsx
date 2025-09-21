'use client';

import React from 'react';

interface Bullet {
  id: string;
  x: number;
  y: number;
  radius: number;
  folder: string;
  label: string;
  size: number;
  color: string;
}

interface BulletControlsProps {
  bullets: Bullet[];
  setBullets: React.Dispatch<React.SetStateAction<Bullet[]>>;
  pulseSpeed: number;
  setPulseSpeed: React.Dispatch<React.SetStateAction<number>>;
  isBlurEnabled: boolean;
  setIsBlurEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onBulletClick: (bullet: Bullet) => void;
}

export default function BulletControls({
  bullets,
  setBullets,
  pulseSpeed,
  setPulseSpeed,
  isBlurEnabled,
  setIsBlurEnabled,
  onBulletClick
}: BulletControlsProps) {
  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-sm font-semibold text-white mb-3">🎯 Bullets</h3>
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => {
            const newBullets = bullets.map(bullet => ({
              ...bullet,
              x: Math.random() * 15000 + 1000,
              y: Math.random() * 2000 + 2000
            }));
            setBullets(newBullets);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
        >
          Posições Aleatórias
        </button>
      </div>
      
      {/* Controles de tamanho e cor */}
      <div className="space-y-4">
        {/* Tamanho Global */}
        <div>
          <label className="text-sm text-gray-300 block mb-2">Tamanho Global</label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newBullets = bullets.map(bullet => ({ ...bullet, size: 1.0 }));
                setBullets(newBullets);
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              Normal (1x)
            </button>
            <button
              onClick={() => {
                const newBullets = bullets.map(bullet => ({ ...bullet, size: 2.0 }));
                setBullets(newBullets);
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              Grande (2x)
            </button>
            <button
              onClick={() => {
                const newBullets = bullets.map(bullet => ({ ...bullet, size: 3.0 }));
                setBullets(newBullets);
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              Grande (3x)
            </button>
          </div>
        </div>

        {/* Cores Aleatórias */}
        <div>
          <label className="text-sm text-gray-300 block mb-2">Cores Aleatórias</label>
          <button
            onClick={() => {
              const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#fbbf24'];
              const newBullets = bullets.map(bullet => ({
                ...bullet,
                color: colors[Math.floor(Math.random() * colors.length)]
              }));
              setBullets(newBullets);
            }}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded text-sm"
          >
            Cores Aleatórias
          </button>
        </div>

        {/* Controle de Velocidade de Pulsação */}
        <div>
          <label className="text-sm text-gray-300 block mb-2">
            Velocidade de Pulsação: {pulseSpeed}s
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPulseSpeed(0.5)}
              className={`px-3 py-2 rounded text-sm ${pulseSpeed === 0.5 ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
            >
              Rápido (0.5s)
            </button>
            <button
              onClick={() => setPulseSpeed(1.0)}
              className={`px-3 py-2 rounded text-sm ${pulseSpeed === 1.0 ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
            >
              Normal (1.0s)
            </button>
            <button
              onClick={() => setPulseSpeed(1.5)}
              className={`px-3 py-2 rounded text-sm ${pulseSpeed === 1.5 ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
            >
              Lento (1.5s)
            </button>
            <button
              onClick={() => setPulseSpeed(2.0)}
              className={`px-3 py-2 rounded text-sm ${pulseSpeed === 2.0 ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
            >
              Muito Lento (2.0s)
            </button>
          </div>
        </div>

        {/* Controle de Blur */}
        <div>
          <label className="text-sm text-gray-300 block mb-2">
            Efeito Blur: {isBlurEnabled ? 'Ativado' : 'Desativado'} (Tecla B)
          </label>
          <button
            onClick={() => setIsBlurEnabled(!isBlurEnabled)}
            className={`px-4 py-2 rounded text-sm ${isBlurEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            {isBlurEnabled ? 'Desativar Blur' : 'Ativar Blur'}
          </button>
        </div>
      </div>

      {/* Configuração Individual de Bullets */}
      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-white mb-4">⚙️ Configuração Individual</h4>
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {bullets.map(bullet => (
            <div key={bullet.id} className="bg-gray-600 p-3 rounded text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white text-sm" style={{ color: bullet.color }}>
                  {bullet.label} ({bullet.id})
                </span>
                <div 
                  className="w-3 h-3 rounded-full border border-white/30" 
                  style={{ backgroundColor: bullet.color }}
                ></div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1 text-xs">X:</label>
                  <input
                    type="number"
                    value={bullet.x}
                    onChange={(e) => {
                      const newX = parseInt(e.target.value) || 0;
                      setBullets(prev => prev.map(b => 
                        b.id === bullet.id ? { ...b, x: newX } : b
                      ));
                    }}
                    className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-xs">Y:</label>
                  <input
                    type="number"
                    value={bullet.y}
                    onChange={(e) => {
                      const newY = parseInt(e.target.value) || 0;
                      setBullets(prev => prev.map(b => 
                        b.id === bullet.id ? { ...b, y: newY } : b
                      ));
                    }}
                    className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-xs">Escala:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={bullet.size}
                    onChange={(e) => {
                      const newSize = parseFloat(e.target.value);
                      setBullets(prev => prev.map(b => 
                        b.id === bullet.id ? { ...b, size: newSize } : b
                      ));
                    }}
                    className="w-full mb-1"
                  />
                  <span className="text-gray-400 text-xs">{bullet.size.toFixed(1)}x</span>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-xs">Cor:</label>
                  <input
                    type="color"
                    value={bullet.color}
                    onChange={(e) => {
                      setBullets(prev => prev.map(b => 
                        b.id === bullet.id ? { ...b, color: e.target.value } : b
                      ));
                    }}
                    className="w-full h-6 rounded border border-gray-600"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Clique nos bullets para abrir carrossel com imagens da pasta correspondente
        </p>
      </div>
    </div>
  );
}
