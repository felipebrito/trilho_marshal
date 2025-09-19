'use client';

import React from 'react';
import { Frame } from '@/lib/types';

interface FrameManagerProps {
  frames: Frame[];
  onFrameClick: (frameId: string) => void;
}

export function FrameManager({ frames, onFrameClick }: FrameManagerProps) {
  return (
    <div id="frames" className="absolute inset-0 pointer-events-none z-10">
      {frames.map((frame) => (
        <div
          key={frame.id}
          id={`frame-${frame.id}`}
          className="absolute border-2 border-white/70 bg-black/35 text-white text-xs font-mono p-2 rounded-lg opacity-15 transition-all duration-150 pointer-events-auto cursor-pointer hover:opacity-100 hover:scale-105 hover:border-white hover:bg-black/15"
          style={{
            left: `${frame.x}px`,
            top: `${frame.y}px`,
            width: `${frame.width}px`,
            height: `${frame.height}px`,
          }}
          onClick={() => onFrameClick(frame.id)}
        >
          <div className="text-center">
            <div className="font-bold mb-1">Quadro {frame.id}</div>
            <div className="text-xs opacity-75">{frame.content.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
