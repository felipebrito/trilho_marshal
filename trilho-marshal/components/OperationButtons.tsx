'use client';

import React from 'react';
import { Play, Save, Download, Upload, FileText, RotateCcw, Trash2 } from 'lucide-react';

interface OperationButtonsProps {
  onOperationMode: () => void;
  onSaveToServer: () => void;
  onLoadFromServer: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
  onResetIdeal: () => void;
  onClearAll: () => void;
  mode: string;
}

export default function OperationButtons({
  onOperationMode,
  onSaveToServer,
  onLoadFromServer,
  onExportJSON,
  onImportJSON,
  onResetIdeal,
  onClearAll,
  mode
}: OperationButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <button
        onClick={onOperationMode}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded text-xs ${
          mode === 'operation' 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-600 hover:bg-gray-700'
        } text-white`}
        title="Modo Operação (C)"
      >
        <Play size={14} />
        <span>Op</span>
      </button>
      
      <button
        onClick={onSaveToServer}
        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
        title="Salvar no Servidor (S)"
      >
        <Save size={14} />
        <span>Sal</span>
      </button>
      
      <button
        onClick={onLoadFromServer}
        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
        title="Carregar do Servidor"
      >
        <Download size={14} />
        <span>Car</span>
      </button>
      
      <button
        onClick={onExportJSON}
        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
        title="Exportar JSON"
      >
        <Upload size={14} />
        <span>Exp</span>
      </button>
      
      <button
        onClick={onImportJSON}
        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs"
        title="Importar JSON"
      >
        <FileText size={14} />
        <span>Imp</span>
      </button>
      
      <button
        onClick={onResetIdeal}
        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs"
        title="Reset Ideal (R)"
      >
        <RotateCcw size={14} />
        <span>Res</span>
      </button>
      
      <button
        onClick={onClearAll}
        className="flex flex-col items-center justify-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
        title="Limpar Tudo"
      >
        <Trash2 size={14} />
        <span>Lim</span>
      </button>
      
      <div className="w-full h-12"></div> {/* Espaço vazio para completar o grid */}
    </div>
  );
}
