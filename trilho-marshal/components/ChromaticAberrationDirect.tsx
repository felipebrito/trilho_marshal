'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ChromaticAberrationDirectProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChromaticAberrationDirect: React.FC<ChromaticAberrationDirectProps> = ({
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
      console.log('🌈 ChromaticAberrationDirect: Desabilitado');
      return;
    }

    console.log('🌈 ChromaticAberrationDirect: Iniciando animação');
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016 * animationSpeed);
    }, 16);

    return () => {
      console.log('🌈 ChromaticAberrationDirect: Parando animação');
      clearInterval(interval);
    };
  }, [enabled, animationSpeed]);

  // Calcular offset baseado no tempo
  const offset = Math.sin(time * 2) * intensity * 50;
  const blur = Math.abs(Math.sin(time * 1.5)) * intensity * 10;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  console.log('🌈 ChromaticAberrationDirect: Renderizando com offset:', offset, 'blur:', blur);

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      {/* Imagem original com filtro de aberração cromática */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          filter: `
            drop-shadow(${offset}px ${offset * 0.5}px 0px rgba(255, 0, 0, ${intensity * 0.8}))
            drop-shadow(${-offset}px ${-offset * 0.5}px 0px rgba(0, 0, 255, ${intensity * 0.8}))
            drop-shadow(0px 0px ${blur}px rgba(0, 255, 0, ${intensity * 0.6}))
          `,
          zIndex: 1
        }}
      >
        {children}
      </div>
      
      {/* Overlay com cores separadas */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(90deg, 
              rgba(255, 0, 0, ${intensity * 0.3}) 0%, 
              transparent 20%, 
              transparent 80%, 
              rgba(0, 0, 255, ${intensity * 0.3}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
      
      {/* Overlay vertical */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(0deg, 
              rgba(0, 255, 0, ${intensity * 0.2}) 0%, 
              transparent 50%, 
              rgba(0, 255, 0, ${intensity * 0.2}) 100%
            )
          `,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
    </div>
  );
};

export default ChromaticAberrationDirect;
