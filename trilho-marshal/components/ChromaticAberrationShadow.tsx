'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ChromaticAberrationShadowProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChromaticAberrationShadow: React.FC<ChromaticAberrationShadowProps> = ({
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
      console.log('🌈 ChromaticAberrationShadow: Desabilitado');
      return;
    }

    console.log('🌈 ChromaticAberrationShadow: Iniciando animação');
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016 * animationSpeed);
    }, 16);

    return () => {
      console.log('🌈 ChromaticAberrationShadow: Parando animação');
      clearInterval(interval);
    };
  }, [enabled, animationSpeed]);

  // Calcular offset baseado no tempo
  const offset = Math.sin(time * 2) * intensity * 30;
  const blur = Math.abs(Math.sin(time * 1.5)) * intensity * 8;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'visible',
    ...style
  };

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  console.log('🌈 ChromaticAberrationShadow: Renderizando com offset:', offset, 'blur:', blur);

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          filter: `
            drop-shadow(${offset}px ${offset * 0.3}px ${blur}px rgba(255, 0, 0, ${intensity}))
            drop-shadow(${-offset}px ${-offset * 0.3}px ${blur}px rgba(0, 0, 255, ${intensity}))
            drop-shadow(0px 0px ${blur * 0.5}px rgba(0, 255, 0, ${intensity * 0.7}))
          `,
          zIndex: 1
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ChromaticAberrationShadow;
