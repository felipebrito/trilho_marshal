'use client';

import React from 'react';
import { CalibrationData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, EyeOff } from 'lucide-react';

interface CalibrationPanelProps {
  calibration: CalibrationData;
  onCalibrationChange: (calibration: Partial<CalibrationData>) => void;
  onModeChange: (mode: 'calibration' | 'operation') => void;
}

export function CalibrationPanel({ 
  calibration, 
  onCalibrationChange, 
  onModeChange 
}: CalibrationPanelProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleSliderChange = (key: keyof CalibrationData, value: number) => {
    onCalibrationChange({ [key]: value });
  };

  const handleCheckboxChange = (key: keyof CalibrationData, checked: boolean) => {
    onCalibrationChange({ [key]: checked });
  };

  const handleSave = () => {
    // Configurações já são salvas automaticamente
    alert('Preset salvo!');
  };

  const handleClear = () => {
    localStorage.removeItem('trilho-marshal-config');
    window.location.reload();
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar tela cheia:', error);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-black/60 border border-gray-600 text-white hover:bg-black/80"
        size="sm"
      >
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
        {isVisible ? 'Ocultar' : 'Controles'}
      </Button>

      {/* Main Panel */}
      {isVisible && (
        <div className="fixed top-0 left-0 w-full max-w-md bg-black/90 border-r border-gray-600 p-6 z-40 h-full overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Calibração</h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Carregar imagem
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
              </div>

              {/* Scale Control - SIMPLIFICADO */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Escala: {Math.round(calibration.scale * 100)}%
                </label>
                <Slider
                  value={[calibration.scale * 100]}
                  onValueChange={([value]) => handleSliderChange('scale', value / 100)}
                  min={10}
                  max={300}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Position Control - SIMPLIFICADO */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Posição: {Math.round(calibration.position)}%
                </label>
                <Slider
                  value={[calibration.position]}
                  onValueChange={([value]) => handleSliderChange('position', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Use scroll horizontal no touchpad
                </p>
              </div>

              {/* Offset X - SIMPLIFICADO */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Offset X: {calibration.offsetX}px
                </label>
                <Slider
                  value={[calibration.offsetX]}
                  onValueChange={([value]) => handleSliderChange('offsetX', value)}
                  min={-2000}
                  max={2000}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Offset Y - SIMPLIFICADO */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Offset Y: {calibration.offsetY}px
                </label>
                <Slider
                  value={[calibration.offsetY]}
                  onValueChange={([value]) => handleSliderChange('offsetY', value)}
                  min={-2000}
                  max={2000}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Grid Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Tamanho do quadrado (px) — p/ 10 cm
                </label>
                <input
                  type="number"
                  min="10"
                  max="800"
                  value={calibration.gridSize}
                  onChange={(e) => handleSliderChange('gridSize', parseInt(e.target.value) || 100)}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showGrid"
                    checked={calibration.showGrid}
                    onCheckedChange={(checked) => handleCheckboxChange('showGrid', !!checked)}
                  />
                  <label htmlFor="showGrid" className="text-sm text-white">
                    Mostrar Grid
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                  >
                    Salvar preset
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                  >
                    Limpar preset
                  </Button>
                </div>

                <Button
                  onClick={() => onModeChange('operation')}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Modo Operação (C)
                </Button>

                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                >
                  Tela cheia
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
