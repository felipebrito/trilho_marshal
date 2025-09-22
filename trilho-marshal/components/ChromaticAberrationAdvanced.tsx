'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ChromaticAberrationAdvancedProps {
  children: React.ReactNode;
  intensity?: number;
  enabled?: boolean;
  animationSpeed?: number;
  distortionStrength?: number;
  offsetStrength?: number;
  zoomIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChromaticAberrationAdvanced: React.FC<ChromaticAberrationAdvancedProps> = ({
  children,
  intensity = 0.5,
  enabled = true,
  animationSpeed = 1.0,
  distortionStrength = 0.3,
  offsetStrength = 0.1,
  zoomIntensity = 0.2,
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

  // Função baseada no shader original
  const someBezierThing = useCallback((t: number) => {
    const a = 1.0;
    const b = 1.0;
    const c = 1.0;
    const d = 2.0;
    
    const T = 1.0 - t;
    return a*T*T*T + 3.*b*T*T*t + 3.*c*T*t*t + d*t*t*t - 1.;
  }, []);

  const computeDistortion = useCallback((t: number) => {
    const PI = Math.PI;
    const tmod = t % (PI / 2);
    
    // Baseado no shader original
    const x = 0.9 * (Math.cos(4.0 * tmod) - 1.0);
    const k = 1.0 * x * distortionStrength;
    const kcube = 0.5 * x * distortionStrength;
    const offset = 0.1 * x * offsetStrength;
    
    return { k, kcube, offset };
  }, [distortionStrength, offsetStrength]);

  const computeZoom = useCallback((t: number) => {
    const PI = Math.PI;
    const tmod = t % (PI / 2);
    
    // Função theta do shader adaptada
    const w = 1.8;
    const theta = tmod <= PI/6.0 ? -Math.sin(6.0 * tmod) * tmod :
                  tmod <= PI/3.0 ? Math.pow(6.0/PI, w) * Math.pow(tmod - PI/6.0, w) :
                  -Math.pow(6.0/PI, 2.0) * Math.pow(tmod - PI/2.0, 2.0);
    
    return Math.pow(2.0, theta * zoomIntensity);
  }, [zoomIntensity]);

  const { k, kcube, offset } = computeDistortion(time);
  const zoom = computeZoom(time);

  // Aplicar CSS custom properties para animação suave
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--chromatic-offset', `${offset * 20}px`);
      containerRef.current.style.setProperty('--chromatic-blur', `${Math.abs(offset) * 3}px`);
      containerRef.current.style.setProperty('--chromatic-zoom', `${zoom}`);
      containerRef.current.style.setProperty('--chromatic-intensity', `${intensity}`);
    }
  }, [offset, zoom, intensity]);

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
      <style jsx>{`
        .chromatic-container {
          position: relative;
          overflow: hidden;
        }
        
        .chromatic-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scale(var(--chromatic-zoom, 1));
          transition: transform 0.1s ease-out;
        }
        
        .chromatic-red {
          filter: blur(var(--chromatic-blur, 0px)) sepia(1) saturate(2) hue-rotate(0deg);
          transform: translate(var(--chromatic-offset, 0px), calc(var(--chromatic-offset, 0px) * 0.5)) scale(var(--chromatic-zoom, 1));
          mix-blend-mode: screen;
          opacity: calc(var(--chromatic-intensity, 0.5) * 0.7);
        }
        
        .chromatic-green {
          filter: blur(calc(var(--chromatic-blur, 0px) * 0.7)) sepia(1) saturate(2) hue-rotate(120deg);
          transform: scale(var(--chromatic-zoom, 1));
          mix-blend-mode: screen;
          opacity: calc(var(--chromatic-intensity, 0.5) * 0.7);
        }
        
        .chromatic-blue {
          filter: blur(calc(var(--chromatic-blur, 0px) * 0.5)) sepia(1) saturate(2) hue-rotate(240deg);
          transform: translate(calc(var(--chromatic-offset, 0px) * -1), calc(var(--chromatic-offset, 0px) * -0.5)) scale(var(--chromatic-zoom, 1));
          mix-blend-mode: screen;
          opacity: calc(var(--chromatic-intensity, 0.5) * 0.7);
        }
      `}</style>
      
      {/* Canal Vermelho */}
      <div className="chromatic-layer chromatic-red">
        {children}
      </div>
      
      {/* Canal Verde */}
      <div className="chromatic-layer chromatic-green">
        {children}
      </div>
      
      {/* Canal Azul */}
      <div className="chromatic-layer chromatic-blue">
        {children}
      </div>
    </div>
  );
};

export default ChromaticAberrationAdvanced;
