import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

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

interface BulletAnimationProps {
  bullet: Bullet;
  loadImagesFromFolder: (folder: string) => string[];
}

const BulletAnimation = React.memo(function BulletAnimation({ bullet, loadImagesFromFolder }: BulletAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const lastBulletId = useRef<string | null>(null);

  const images = React.useMemo(() => loadImagesFromFolder(bullet.folder), [bullet.folder]);
  
  // Só logar se for um bullet diferente
  if (lastBulletId.current !== bullet.id) {
    console.log('🎬 BulletAnimation: Carregando imagens para', bullet.folder, ':', images);
    lastBulletId.current = bullet.id;
  }

  useEffect(() => {
    if (!animationRef.current) return;
    
    // Resetar se for um bullet diferente
    if (lastBulletId.current !== bullet.id) {
      hasInitialized.current = false;
      setCurrentStep(0);
      lastBulletId.current = bullet.id;
    }
    
    if (hasInitialized.current) return;

    console.log('🎬 BulletAnimation: Iniciando animação para', bullet.id);
    hasInitialized.current = true;

    // Animação de entrada do modal
    gsap.fromTo(animationRef.current, 
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.3, 
        ease: "power2.out" 
      }
    );

    // Sequência de steps para indicadores
    const stepTimeline = gsap.timeline({ delay: 0.3 });
    stepTimeline.call(() => {
      console.log('🎬 Step 1 ativado');
      setCurrentStep(1);
    }, [], 0.2);
    stepTimeline.call(() => {
      console.log('🎬 Step 2 ativado');
      setCurrentStep(2);
    }, [], 0.4);
    stepTimeline.call(() => {
      console.log('🎬 Step 3 ativado');
      setCurrentStep(3);
    }, [], 0.6);
    
    if (images[3]) {
      stepTimeline.call(() => {
        console.log('🎬 Step 4 ativado (imagem adicional)');
        setCurrentStep(4);
      }, [], 0.8);
    }

  }, [bullet.id, bullet.folder, images]);

  return (
    <div ref={animationRef} className="relative w-full h-full flex items-center justify-center" style={{ backgroundColor: '#fff1ef' }}>
      {/* Efeito de blur ao redor da imagem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>
      </div>
      
      {/* Imagem de fundo - visível imediatamente */}
      <img
        src={images[0]}
        alt="Background"
        className="absolute inset-0 w-full h-full object-contain z-10"
        onLoad={() => console.log('✅ Imagem de fundo carregada:', images[0])}
        onError={(e) => {
          console.log('❌ Erro ao carregar imagem de fundo:', images[0]);
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Imagem do ano com animação CSS */}
      <div 
        className="absolute inset-0 w-full h-full z-20"
        style={{
          opacity: currentStep >= 1 ? 1 : 0,
          filter: currentStep >= 1 ? 'blur(0px)' : 'blur(20px)',
          transform: currentStep >= 1 ? 'scale(1)' : 'scale(1.05)',
          transition: 'opacity 0.4s ease-out, filter 0.4s ease-out, transform 0.4s ease-out'
        }}
      >
        <img
          src={images[1]}
          alt="Ano"
          className="w-full h-full object-contain"
          onLoad={() => console.log('✅ Imagem do ano carregada:', images[1])}
          onError={(e) => {
            console.log('❌ Erro ao carregar imagem do ano:', images[1]);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      {/* Imagem do texto com animação CSS */}
      <div 
        className="absolute inset-0 w-full h-full z-30"
        style={{
          opacity: currentStep >= 2 ? 1 : 0,
          filter: currentStep >= 2 ? 'blur(0px)' : 'blur(20px)',
          transform: currentStep >= 2 ? 'scale(1)' : 'scale(1.05)',
          transition: 'opacity 0.4s ease-out, filter 0.4s ease-out, transform 0.4s ease-out'
        }}
      >
        <img
          src={images[2]}
          alt="Texto descritivo"
          className="w-full h-full object-contain"
          onLoad={() => console.log('✅ Imagem do texto carregada:', images[2])}
          onError={(e) => {
            console.log('❌ Erro ao carregar imagem do texto:', images[2]);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Imagem adicional (se existir) com animação CSS */}
      {images[3] && (
        <div 
          className="absolute inset-0 w-full h-full z-40"
          style={{
            opacity: currentStep >= 3 ? 1 : 0,
            filter: currentStep >= 3 ? 'blur(0px)' : 'blur(20px)',
            transform: currentStep >= 3 ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.4s ease-out, filter 0.4s ease-out, transform 0.4s ease-out'
          }}
        >
          <img
            src={images[3]}
            alt="Imagem adicional"
            className="w-full h-full object-contain"
            onLoad={() => console.log('✅ Imagem adicional carregada:', images[3])}
            onError={(e) => {
              console.log('❌ Erro ao carregar imagem opcional:', images[3]);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Indicadores de progresso */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {images.slice(0, 3).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentStep ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
        {images[3] && (
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentStep >= 4 ? 'bg-white' : 'bg-white/30'
            }`}
          />
        )}
      </div>
    </div>
  );
});

export default BulletAnimation;
