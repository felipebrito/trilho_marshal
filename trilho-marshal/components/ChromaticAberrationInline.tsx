'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ChromaticAberrationInlineProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChromaticAberrationInline: React.FC<ChromaticAberrationInlineProps> = ({
  children,
  intensity = 0.6,
  enabled = true,
  animationSpeed = 1.0,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!enabled) {
      console.log('🌈 ChromaticAberrationInline: Desabilitado');
      return;
    }

    console.log('🌈 ChromaticAberrationInline: Iniciando animação');
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016 * animationSpeed);
    }, 16);

    return () => {
      console.log('🌈 ChromaticAberrationInline: Parando animação');
      clearInterval(interval);
    };
  }, [enabled, animationSpeed]);

  // Calcular offset baseado no tempo
  const offset = Math.sin(time * 2) * intensity * 30;
  const blur = Math.abs(Math.sin(time * 1.5)) * intensity * 6;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      {/* Canal Vermelho */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: `blur(${blur}px) sepia(1) saturate(6) hue-rotate(0deg)`,
          transform: `translate(${offset}px, ${offset * 0.5}px)`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.9,
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {children}
      </div>
      
      {/* Canal Verde */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: `blur(${blur * 0.7}px) sepia(1) saturate(6) hue-rotate(120deg)`,
          transform: `translate(0px, 0px)`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.9,
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {children}
      </div>
      
      {/* Canal Azul */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: `blur(${blur * 0.5}px) sepia(1) saturate(6) hue-rotate(240deg)`,
          transform: `translate(${-offset}px, ${-offset * 0.5}px)`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.9,
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ChromaticAberrationInline;
