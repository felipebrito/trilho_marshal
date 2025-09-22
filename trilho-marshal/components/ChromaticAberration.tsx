'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ChromaticAberrationProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  intensity = 0.5,
  enabled = true,
  animationSpeed = 1.0,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 0.016 * animationSpeed);
    }, 16);

    return () => clearInterval(interval);
  }, [enabled, animationSpeed]);

  // Calcular offset baseado no tempo - baseado no shader original
  const offset = Math.sin(time * 2) * intensity * 15;
  const blur = Math.abs(Math.sin(time * 1.5)) * intensity * 3;
  const zoom = 1 + Math.sin(time * 0.8) * intensity * 0.05;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const layerStyle = (hue: number, xOffset: number, yOffset: number, blurAmount: number): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: `blur(${blurAmount}px) sepia(1) saturate(3) hue-rotate(${hue}deg)`,
    transform: `translate(${xOffset}px, ${yOffset}px) scale(${zoom})`,
    mixBlendMode: 'screen',
    opacity: Math.max(0.1, intensity * 0.8),
    pointerEvents: 'none',
    zIndex: 1
  });

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      {/* Canal Vermelho */}
      <div style={layerStyle(0, offset, offset * 0.5, blur)}>
        {children}
      </div>
      
      {/* Canal Verde */}
      <div style={layerStyle(120, 0, 0, blur * 0.7)}>
        {children}
      </div>
      
      {/* Canal Azul */}
      <div style={layerStyle(240, -offset, -offset * 0.5, blur * 0.5)}>
        {children}
      </div>
    </div>
  );
};

export default ChromaticAberration;
