'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ChromaticAberrationCSSProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChromaticAberrationCSS: React.FC<ChromaticAberrationCSSProps> = ({
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
      console.log('🌈 ChromaticAberrationCSS: Desabilitado');
      return;
    }

    console.log('🌈 ChromaticAberrationCSS: Iniciando animação');
    const interval = setInterval(() => {
      setTime(prev => prev + 0.016 * animationSpeed);
    }, 16);

    return () => {
      console.log('🌈 ChromaticAberrationCSS: Parando animação');
      clearInterval(interval);
    };
  }, [enabled, animationSpeed]);

  // Calcular offset baseado no tempo
  const offset = Math.sin(time * 2) * intensity * 40;
  const blur = Math.abs(Math.sin(time * 1.5)) * intensity * 12;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'visible',
    ...style
  };

  if (!enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  console.log('🌈 ChromaticAberrationCSS: Renderizando com offset:', offset, 'blur:', blur);

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <style jsx>{`
        .chromatic-container {
          position: relative;
          overflow: visible;
        }
        
        .chromatic-image {
          filter: 
            drop-shadow(${offset}px ${offset * 0.5}px ${blur}px rgba(255, 0, 0, ${intensity}))
            drop-shadow(${-offset}px ${-offset * 0.5}px ${blur}px rgba(0, 0, 255, ${intensity}))
            drop-shadow(0px 0px ${blur * 0.7}px rgba(0, 255, 0, ${intensity * 0.8}));
          transition: filter 0.1s ease-out;
        }
      `}</style>
      
      <div className="chromatic-container">
        <div className="chromatic-image">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChromaticAberrationCSS;