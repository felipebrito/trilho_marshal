'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useUDPControl } from '@/hooks/useUDPControl';

interface CalibrationData {
  scale: number;
  offsetX: number;
  offsetY: number;
  position: number;
  gridSize: number;
  showGrid: boolean;
}

// Interfaces removidas - usando apenas bullets agora

interface Bullet {
  id: string;
  x: number;
  y: number;
  radius: number;
  folder: string;
  label: string;
  size: number; // Multiplicador de tamanho (1.0 = normal, 5.0 = 500% maior)
  color: string; // Cor do bullet
}

export function TVViewer() {
  const [mode, setMode] = useState<'calibration' | 'operation'>('calibration');
  const [calibration, setCalibration] = useState<CalibrationData>({
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
    position: 0,
    gridSize: 100,
    showGrid: false,
  });
  const [imageDimensions, setImageDimensions] = useState({ width: 20000, height: 4000 });
  // Bullets pulsantes - pontos redondos clicáveis
  const [bullets, setBullets] = useState<Bullet[]>([
    { id: 'B1', x: 2000, y: 3000, radius: 30, folder: '1966', label: '1966', size: 2.0, color: '#22c55e' },
    { id: 'B2', x: 3000, y: 3200, radius: 30, folder: '1989', label: '1989', size: 2.0, color: '#3b82f6' },
    { id: 'B3', x: 4000, y: 3100, radius: 30, folder: '1990', label: '1990', size: 2.0, color: '#8b5cf6' },
    { id: 'B4', x: 5000, y: 3300, radius: 30, folder: '2004', label: '2004', size: 2.0, color: '#f59e0b' },
    { id: 'B5', x: 6000, y: 3150, radius: 30, folder: '2005', label: '2005', size: 2.0, color: '#ef4444' },
    { id: 'B6', x: 7000, y: 3250, radius: 30, folder: '2015', label: '2015', size: 2.0, color: '#06b6d4' },
    { id: 'B7', x: 8000, y: 3100, radius: 30, folder: '2016', label: '2016', size: 2.0, color: '#84cc16' },
    { id: 'B8', x: 9000, y: 3200, radius: 30, folder: '2017', label: '2017', size: 2.0, color: '#f97316' },
    { id: 'B9', x: 10000, y: 3150, radius: 30, folder: '2019', label: '2019', size: 2.0, color: '#ec4899' },
    { id: 'B10', x: 11000, y: 3250, radius: 30, folder: '2024', label: '2024', size: 2.0, color: '#6366f1' },
    { id: 'B11', x: 12000, y: 3100, radius: 30, folder: '2025', label: '2025', size: 2.0, color: '#14b8a6' },
    { id: 'B12', x: 13000, y: 3200, radius: 30, folder: 'FUTURO', label: 'FUTURO', size: 2.0, color: '#fbbf24' },
  ]);

  // Frames removidos - usando apenas bullets agora

  // Target zones posicionados ao lado direito de cada frame
  const [targetZones, setTargetZones] = useState<TargetZone[]>([
    { 
      id: 'T1', 
      x: 1700 + 600 + 50, // Frame A x + width + offset
      y: 5000 + 200, // Frame A y + height/2 (centro vertical)
      radius: 60,
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2', 
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
      ]
    },
    { 
      id: 'T2', 
      x: 4000 + 200 + 50, // Frame B x + width + offset
      y: 3400 + 75, // Frame B y + height/2
      radius: 60,
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2', 
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
      ]
    },
    { 
      id: 'T3', 
      x: 7000 + 200 + 50, // Frame C x + width + offset
      y: 3100 + 75, // Frame C y + height/2
      radius: 60,
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2', 
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
      ]
    },
    { 
      id: 'T4', 
      x: 10000 + 200 + 50, // Frame D x + width + offset
      y: 3500 + 75, // Frame D y + height/2
      radius: 60,
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2', 
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
      ]
    },
    { 
      id: 'T5', 
      x: 13000 + 200 + 50, // Frame E x + width + offset
      y: 3300 + 75, // Frame E y + height/2
      radius: 60,
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2', 
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
      ]
    },
    { 
      id: 'T6', 
      x: 16000 + 200 + 50, // Frame F x + width + offset
      y: 3600 + 75, // Frame F y + height/2
      radius: 60,
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2', 
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
      ]
    }
  ]);

  // Estado do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBullet, setSelectedBullet] = useState<Bullet | null>(null);

  // Função para carregar imagens de uma pasta específica
  const loadImagesFromFolder = (folder: string): string[] => {
    const imageFiles = ['00_bg.png', '01_ano.png', '02_texto.png', '03_imagem.png'];
    return imageFiles.map(file => `/imagens/${folder}/${file}`);
  };

  // Função para salvar configurações dos bullets
  const saveBulletPositions = () => {
    localStorage.setItem('trilho-marshal-bullets', JSON.stringify(bullets));
    console.log('Configurações dos bullets salvas:', bullets);
  };

  // Função para carregar configurações dos bullets
  const loadBulletPositions = () => {
    const saved = localStorage.getItem('trilho-marshal-bullets');
    if (saved) {
      try {
        const parsedBullets = JSON.parse(saved);
        // Garantir que as novas propriedades existam
        const bulletsWithDefaults = parsedBullets.map((bullet: any) => ({
          ...bullet,
          size: bullet.size || 5.0,
          color: bullet.color || '#22c55e'
        }));
        setBullets(bulletsWithDefaults);
        console.log('Configurações dos bullets carregadas:', bulletsWithDefaults);
      } catch (error) {
        console.error('Erro ao carregar configurações dos bullets:', error);
      }
    }
  };

  // Carregar posições dos bullets ao inicializar
  useEffect(() => {
    loadBulletPositions();
  }, []);

  // Variáveis comentadas - usando apenas bullets agora
  // const [selectedZone, setSelectedZone] = useState<TargetZone | null>(null);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estado do controle UDP
  const [udpEnabled, setUdpEnabled] = useState(false);
  const [udpConnected, setUdpConnected] = useState(false);

  // Dados dos slides para cada frame (como no HTML original)
  const SLIDE_DATA = {
    A: [
      { year: '1966', title: 'Criação do FGTS', desc: 'Nasce um dos direitos trabalhistas que mais beneficia o trabalhador brasileiro.' },
      { year: '1970', title: 'Expansão Nacional', desc: 'FGTS se torna obrigatório para todos os trabalhadores com carteira assinada.' },
      { year: '1988', title: 'Constituição', desc: 'FGTS é garantido pela Constituição Federal como direito fundamental.' },
      { year: '1990', title: 'Modernização', desc: 'Sistema informatizado facilita o acesso e controle dos recursos.' },
      { year: '2024', title: 'Era Digital', desc: 'App FGTS permite consultas e saques de forma totalmente digital.' }
    ],
    B: [
      { year: '1967', title: 'Primeiros Recursos', desc: 'Arrecadação inicial de R$ 50 milhões para financiamento habitacional.' },
      { year: '1980', title: 'Boom Imobiliário', desc: 'FGTS financia mais de 500 mil unidades habitacionais no país.' },
      { year: '1995', title: 'Saneamento', desc: 'Recursos passam a financiar também obras de saneamento básico.' },
      { year: '2010', title: 'Minha Casa', desc: 'FGTS é pilar fundamental do programa Minha Casa Minha Vida.' },
      { year: '2024', title: 'Sustentabilidade', desc: 'Foco em habitação sustentável e eficiência energética.' }
    ],
    C: [
      { year: '1966', title: 'Marco Histórico', desc: 'Lei 5.107 cria o FGTS durante o governo militar.' },
      { year: '1985', title: 'Redemocratização', desc: 'FGTS mantido e fortalecido na Nova República.' },
      { year: '2001', title: 'Lei Complementar', desc: 'LC 110 moderniza as regras e amplia possibilidades de saque.' },
      { year: '2017', title: 'Saque-Aniversário', desc: 'Nova modalidade permite saque anual de parte do saldo.' },
      { year: '2023', title: 'Pix FGTS', desc: 'Integração com Pix facilita transferências e pagamentos.' }
    ],
    D: [
      { year: '1970', title: 'Política Habitacional', desc: 'FGTS se torna base da política nacional de habitação.' },
      { year: '1986', title: 'Plano Cruzado', desc: 'FGTS ajuda na estabilização econômica do país.' },
      { year: '1999', title: 'Real Forte', desc: 'Recursos do FGTS apoiam programas sociais e infraestrutura.' },
      { year: '2008', title: 'Crise Global', desc: 'FGTS atua como amortecedor social durante a crise financeira.' },
      { year: '2024', title: 'Futuro Verde', desc: 'Investimentos em projetos de energia renovável e sustentabilidade.' }
    ],
    E: [
      { year: '1980', title: 'Primeira Década', desc: 'FGTS consolida-se como principal fonte de financiamento habitacional.' },
      { year: '1990', title: 'Era Collor', desc: 'FGTS resiste às mudanças econômicas e políticas do período.' },
      { year: '2000', title: 'Novo Milênio', desc: 'Modernização do sistema com tecnologia digital.' },
      { year: '2010', title: 'Crescimento', desc: 'FGTS atinge patamar histórico de recursos disponíveis.' },
      { year: '2020', title: 'Pandemia', desc: 'FGTS como instrumento de proteção social durante a crise.' }
    ],
    F: [
      { year: '1975', title: 'Expansão Urbana', desc: 'FGTS financia grandes projetos de urbanização.' },
      { year: '1985', title: 'Nova República', desc: 'FGTS fortalecido na redemocratização do país.' },
      { year: '1995', title: 'Plano Real', desc: 'FGTS contribui para estabilização da moeda.' },
      { year: '2005', title: 'Boom Imobiliário', desc: 'FGTS impulsiona crescimento do setor imobiliário.' },
      { year: '2015', title: 'Crise Política', desc: 'FGTS mantém estabilidade em meio à instabilidade.' }
    ]
  };

  const worldRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calcular posição da câmera (exatamente como no HTML original)
  const getCameraX = useCallback(() => {
    const railLeftX = 0;
    const railRightX = Math.max(0, imageDimensions.width - 1080);
    const cameraX = railLeftX + (railRightX - railLeftX) * (calibration.position / 100);
    // Garantir que a câmera não ultrapasse o limite para evitar fundo escuro
    return Math.min(cameraX, railRightX * 0.768); // Limitar a 76.8% do railRightX
  }, [calibration.position, imageDimensions.width]);

  // Calcular o range máximo baseado na escala atual
  const getMaxPosition = useCallback(() => {
    if (imageDimensions.width === 0) return 100;
    const railWidth = Math.max(0, imageDimensions.width - 1080);
    // Ajustar o range máximo baseado na escala para manter a imagem no viewport
    const scaleFactor = calibration.scale;
    const maxPos = Math.ceil((railWidth / 1080) * 100 * scaleFactor);
    // Limitar para evitar que a imagem saia do viewport
    return Math.min(76.8, maxPos);
  }, [imageDimensions.width, calibration.scale]);

  // Callback para mudança de posição via UDP
  const handleUDPPositionChange = useCallback((position: number) => {
    console.log('UDP: Recebido valor:', position, 'Modo atual:', mode);
    
    if (mode !== 'operation') {
      console.log('UDP: Ignorado - não está em modo operação');
      return;
    }
    
    // Converter de 0-1 para 0-100%
    const percentage = position * 100;
    const maxPos = getMaxPosition();
    const newPosition = Math.max(0, Math.min(maxPos, percentage));
    setCalibration(prev => ({ ...prev, position: newPosition }));
    console.log('UDP: Posição atualizada para', newPosition + '%');
  }, [getMaxPosition, mode]);

  // Hook UDP Control - só funciona em modo operação
  const { isConnected } = useUDPControl({
    onPositionChange: handleUDPPositionChange,
    enabled: udpEnabled && mode === 'operation'
  });

  // Atualizar estado de conexão UDP
  useEffect(() => {
    setUdpConnected(isConnected);
  }, [isConnected]);


  // Aplicar transformações (exatamente como no HTML original)
  const updateTransform = useCallback(() => {
    if (!worldRef.current) return;

    const cameraX = getCameraX();
    const translateX = (-cameraX + calibration.offsetX) * calibration.scale;
    const translateY = calibration.offsetY * calibration.scale;

    // Garantir que a imagem não saia do viewport
    const maxTranslateX = 0; // Não pode ir para a direita além do viewport
    const minTranslateX = -(imageDimensions.width * calibration.scale - 1080); // Não pode ir para a esquerda além do viewport
    
    const clampedTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, translateX));

    worldRef.current.style.transform = `translate(${clampedTranslateX}px, ${translateY}px) scale(${calibration.scale})`;
  }, [calibration, getCameraX, imageDimensions]);

  // Função comentada - usando apenas bullets agora
  /*
  const updateFramesVisibility = useCallback(() => {
    const cameraX = getCameraX();
    const cameraRight = cameraX + 1080; // largura do viewport

    frames.forEach(frame => {
      const frameElement = document.getElementById(`frame-${frame.id}`);
      if (frameElement) {
        const isVisible = frame.x + frame.width > cameraX && 
                         frame.x < cameraRight && 
                         frame.y + frame.height > -calibration.offsetY && 
                         frame.y < (-calibration.offsetY + 1920);
        
        
        frameElement.classList.toggle('active', isVisible);
      }
    });

    // Atualizar visibilidade dos target zones
    targetZones.forEach(zone => {
      const zoneElement = document.getElementById(`target-${zone.id}`);
      if (zoneElement) {
        const isVisible = zone.x + zone.radius > cameraX && 
                         zone.x - zone.radius < cameraRight && 
                         zone.y + zone.radius > -calibration.offsetY && 
                         zone.y - zone.radius < (-calibration.offsetY + 1920);
        
        zoneElement.classList.toggle('active', isVisible);
      }
    });
  }, [calibration.offsetY, getCameraX]);
  */

  // Carregar imagem
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const newDimensions = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
    setImageDimensions(newDimensions);
    console.log('Imagem carregada:', newDimensions);
    
    // Calcular range máximo
    const railWidth = Math.max(0, img.naturalWidth - 1080);
    const maxPos = Math.ceil((railWidth / 1080) * 100);
    console.log('Range calculado:', { 
      imageWidth: img.naturalWidth, 
      railWidth, 
      maxPos, 
      finalMax: Math.max(500, maxPos)
    });
  };

  // Atualizar quando necessário
  useEffect(() => {
    updateTransform();
    updateFramesVisibility();
  }, [calibration, mode, frames]);

  // Salvar configurações
  useEffect(() => {
    const config = { calibration, frames };
    localStorage.setItem('trilho-marshal-config', JSON.stringify(config));
  }, [calibration, frames]);

  // Carregar configurações automaticamente
  useEffect(() => {
    const saved = localStorage.getItem('trilho-marshal-config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setCalibration(prev => ({ ...prev, ...config.calibration }));
        if (config.frames) setFrames(config.frames);
        console.log('Configurações carregadas:', config);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        // Se não conseguir carregar, usa a posição ideal
        setCalibration({
          scale: 0.44,
          offsetX: -36,
          offsetY: -1504,
          position: 2.1,
          gridSize: 100,
          showGrid: false,
        });
      }
    } else {
      // Se não há configurações salvas, usa a posição ideal
      setCalibration({
        scale: 0.44,
        offsetX: -36,
        offsetY: -1504,
        position: 2.1,
        gridSize: 100,
        showGrid: false,
      });
      console.log('Usando posição ideal padrão');
    }
  }, []);

  // Handlers
  const handleCalibrationChange = (newCalibration: Partial<CalibrationData>) => {
    setCalibration(prev => ({ ...prev, ...newCalibration }));
  };

  const handleModeChange = (newMode: 'calibration' | 'operation') => {
    setMode(newMode);
  };

  const handleFrameClick = (frameId: string) => {
    console.log('Frame clicked:', frameId);
    if (frameId === 'A') {
      console.log('Abrindo animação especial do Frame A');
      setSelectedZone(null);
      setCurrentImageIndex(0);
      setIsModalOpen(true);
    }
  };

  // Função comentada - usando apenas bullets agora
  /*
  const handleTargetZoneClick = (zone: TargetZone) => {
    setSelectedZone(zone);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };
  */

  // Função para clicar em um bullet
  const handleBulletClick = (bullet: Bullet) => {
    console.log('Bullet clicado:', bullet);
    setSelectedBullet(bullet);
    setIsModalOpen(true);
  };

  // Função para atualizar posição de um bullet (para modo de calibração)
  const updateBulletPosition = (bulletId: string, x: number, y: number) => {
    setBullets(prev => prev.map(bullet => 
      bullet.id === bulletId ? { ...bullet, x, y } : bullet
    ));
  };

  // Função para atualizar tamanho de um bullet
  const updateBulletSize = (bulletId: string, size: number) => {
    setBullets(prev => prev.map(bullet => 
      bullet.id === bulletId ? { ...bullet, size } : bullet
    ));
  };

  // Função para atualizar cor de um bullet
  const updateBulletColor = (bulletId: string, color: string) => {
    setBullets(prev => prev.map(bullet => 
      bullet.id === bulletId ? { ...bullet, color } : bullet
    ));
  };

  // Funções comentadas - usando apenas bullets agora
  /*
  const nextImage = () => {
    if (selectedZone) {
      setCurrentImageIndex(prev => (prev + 1) % selectedZone.images.length);
    }
  };

  const prevImage = () => {
    if (selectedZone) {
      setCurrentImageIndex(prev => prev === 0 ? selectedZone.images.length - 1 : prev - 1);
    }
  };
  */

  // Componente para o slider dentro de cada frame
  const FrameSlider = ({ frameId }: { frameId: string }) => {
    const slides = SLIDE_DATA[frameId as keyof typeof SLIDE_DATA] || [];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [slides.length]);

    return (
      <div className="slider-container w-full h-full relative overflow-hidden rounded-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-500 flex flex-col justify-start items-start text-left p-5 ${
              index === currentSlide ? 'active opacity-100' : ''
            }`}
          >
            <div 
              className="slide-bg absolute top-0 left-0 w-full h-full opacity-0 transform scale-110 transition-all duration-600 z-10"
              style={{ backgroundImage: "url('https://picsum.photos/400/300?random=" + (index + 1) + "')", backgroundSize: '100% 100%' }}
            />
            <div className="slide-year relative z-30 text-3xl font-bold text-green-700 mb-2 opacity-0 transform translate-y-5 transition-all duration-600 delay-500">
              {slide.year}
            </div>
            <div className="slide-title relative z-30 text-sm font-semibold text-green-700 mb-2 opacity-0 transform translate-y-5 transition-all duration-600 delay-1000">
              {slide.title}
            </div>
            <div className="slide-desc relative z-30 text-xs text-gray-700 leading-tight opacity-0 transform translate-y-5 transition-all duration-600 delay-1000">
              {slide.desc}
            </div>
          </div>
        ))}
        
        {/* Indicadores */}
        <div className="slide-indicators absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-40">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white/90' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Componente especial para Frame A - Animação sequencial
  const FrameAAnimation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const animationRef = useRef<HTMLDivElement>(null);

    const images = [
      '/00_bg.png',   // Fundo
      '/01_ano.png',  // Ano (1990)
      '/02_texto.png' // Texto
    ];

    useEffect(() => {
      if (!animationRef.current) return;

      // Animação de entrada do modal
      gsap.fromTo(animationRef.current, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );

      // Sequência de animação das imagens
      const timeline = gsap.timeline({ delay: 0.5 });

      // Primeira imagem (fundo) - aparece imediatamente
      timeline.to(`.frame-a-bg`, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });

      // Segunda imagem (ano) - aparece após 1 segundo
      timeline.to(`.frame-a-ano`, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");

      // Terceira imagem (texto) - aparece após 2 segundos
      timeline.to(`.frame-a-texto`, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");

      // Atualizar step para indicadores
      timeline.call(() => setCurrentStep(1), [], 1);
      timeline.call(() => setCurrentStep(2), [], 2);
      timeline.call(() => setCurrentStep(3), [], 3);

    }, []);

    return (
      <div ref={animationRef} className="relative w-full h-full flex items-center justify-center bg-black">
        {/* Imagem de fundo */}
        <img
          src={images[0]}
          alt="Background"
          className="frame-a-bg absolute inset-0 w-full h-full object-contain opacity-0"
        />
        
        {/* Imagem do ano */}
        <img
          src={images[1]}
          alt="Ano 1990"
          className="frame-a-ano absolute inset-0 w-full h-full object-contain opacity-0"
        />
        
        {/* Imagem do texto */}
        <img
          src={images[2]}
          alt="Texto descritivo"
          className="frame-a-texto absolute inset-0 w-full h-full object-contain opacity-0"
        />

        {/* Indicadores de progresso */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index < currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Botão de fechar */}
        <button
          onClick={() => {
            setIsModalOpen(false);
            setSelectedBullet(null);
          }}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
        >
          <X size={20} />
        </button>
      </div>
    );
  };

  // Componente de animação sequencial para Bullets
  const BulletAnimation = ({ bullet }: { bullet: Bullet }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const animationRef = useRef<HTMLDivElement>(null);

    const images = loadImagesFromFolder(bullet.folder);

    useEffect(() => {
      if (!animationRef.current) return;

      // Animação de entrada do modal
      gsap.fromTo(animationRef.current, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );

      // Sequência de animação das imagens
      const timeline = gsap.timeline({ delay: 0.5 });

      // Primeira imagem (fundo) - aparece imediatamente
      timeline.to(`.bullet-${bullet.id}-bg`, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });

      // Segunda imagem (ano) - aparece após 1.5s
      timeline.to(`.bullet-${bullet.id}-ano`, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, 1.5);

      // Terceira imagem (texto) - aparece após 3s
      timeline.to(`.bullet-${bullet.id}-texto`, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, 3);

      // Quarta imagem (se existir) - aparece após 4.5s
      if (images[3]) {
        timeline.to(`.bullet-${bullet.id}-imagem`, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        }, 4.5);
      }

      // Atualizar step para indicadores
      timeline.call(() => setCurrentStep(1), [], 1);
      timeline.call(() => setCurrentStep(2), [], 2);
      timeline.call(() => setCurrentStep(3), [], 3);
      if (images[3]) {
        timeline.call(() => setCurrentStep(4), [], 4);
      }

    }, [bullet.id, images.length]);

    return (
      <div ref={animationRef} className="relative w-full h-full flex items-center justify-center bg-black">
        {/* Imagem de fundo */}
        <img
          src={images[0]}
          alt="Background"
          className={`bullet-${bullet.id}-bg absolute inset-0 w-full h-full object-contain opacity-0`}
        />
        
        {/* Imagem do ano */}
        {images[1] && (
          <img
            src={images[1]}
            alt="Ano"
            className={`bullet-${bullet.id}-ano absolute inset-0 w-full h-full object-contain opacity-0`}
          />
        )}
        
        {/* Imagem do texto */}
        {images[2] && (
          <img
            src={images[2]}
            alt="Texto descritivo"
            className={`bullet-${bullet.id}-texto absolute inset-0 w-full h-full object-contain opacity-0`}
          />
        )}

        {/* Imagem adicional (se existir) */}
        {images[3] && (
          <img
            src={images[3]}
            alt="Imagem adicional"
            className={`bullet-${bullet.id}-imagem absolute inset-0 w-full h-full object-contain opacity-0`}
          />
        )}

        {/* Indicadores de progresso */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Título do bullet */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <h2 className="text-white text-2xl font-bold bg-black/50 px-4 py-2 rounded-lg">
            {bullet.label}
          </h2>
        </div>
      </div>
    );
  };

  // Componente do carrossel modal
  // Componente comentado - usando apenas bullets agora
  /*
  const ImageCarousel = () => {
    if (!selectedZone) return null;

    useEffect(() => {
      if (carouselRef.current) {
        gsap.fromTo(carouselRef.current, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }, [selectedZone]);

    return (
      <div ref={carouselRef} className="relative w-full h-full flex items-center justify-center">
        <img
          src={selectedZone.images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          style={{
            opacity: 0,
            transform: 'scale(0.9)'
          }}
          onLoad={(e) => {
            gsap.to(e.target, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power2.out"
            });
          }}
        />
        
        {/* Botões de navegação */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronRight size={24} />
        </button>
        
        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {selectedZone.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };
  */

  // Touch events - baseado no HTML original
  useEffect(() => {
    const tv = document.getElementById('tv');
    if (!tv) return;

    let lastTouch: { x: number; y: number } | null = null;
    let pinch: { d0: number; s0: number; cx: number; cy: number } | null = null;

    const getTouchPoint = (t: Touch) => {
      const rect = tv.getBoundingClientRect();
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    const getDistance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (mode === 'operation') {
        if (e.touches.length === 1) {
          lastTouch = getTouchPoint(e.touches[0]);
        }
        return;
      }

      if (e.touches.length === 1) {
        lastTouch = getTouchPoint(e.touches[0]);
      } else if (e.touches.length === 2) {
        console.log('TouchStart: 2 dedos detectados');
        const p1 = getTouchPoint(e.touches[0]);
        const p2 = getTouchPoint(e.touches[1]);
        const d0 = getDistance(p1, p2);
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;
        pinch = { d0, s0: calibration.scale, cx, cy };
        console.log('Pinch iniciado:', { d0, s0: calibration.scale, cx, cy });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      // console.log('TouchMove:', { touches: e.touches.length, hasPinch: !!pinch });

      // Pinch tem prioridade sobre pan
      if (e.touches.length === 2 && pinch) {
        const p1 = getTouchPoint(e.touches[0]);
        const p2 = getTouchPoint(e.touches[1]);
        const d1 = getDistance(p1, p2);
        let newScale = pinch.s0 * (d1 / pinch.d0);
        newScale = Math.min(4.0, Math.max(0.05, newScale));
        
        console.log('Pinch:', { d0: pinch.d0, d1, s0: pinch.s0, newScale });
        
        const s = calibration.scale;
        const s2 = newScale;
        const cx = pinch.cx;
        const cy = pinch.cy;
        
        setCalibration(prev => ({
          ...prev,
          scale: newScale,
          offsetX: prev.offsetX + Math.round(cx * (1/s2 - 1/s)),
          offsetY: prev.offsetY + Math.round(cy * (1/s2 - 1/s)),
        }));
        return;
      }

      if (mode === 'operation') {
        if (e.touches.length === 1 && lastTouch) {
          const p = getTouchPoint(e.touches[0]);
          const dx = p.x - lastTouch.x;
          const step = dx / 10; // Sensibilidade reduzida para controle mais fino
          const maxPos = getMaxPosition();
          const newPosition = Math.max(0, Math.min(maxPos, calibration.position + step));
          setCalibration(prev => ({ ...prev, position: newPosition }));
          lastTouch = p;
        }
        return;
      }

      if (e.touches.length === 1 && lastTouch) {
        const p = getTouchPoint(e.touches[0]);
        const dx = p.x - lastTouch.x;
        const dy = p.y - lastTouch.y;
        
        // console.log('Touch pan:', { dx, dy, scale: calibration.scale });
        
        setCalibration(prev => ({
          ...prev,
          offsetX: prev.offsetX + Math.round(dx / prev.scale),
          offsetY: prev.offsetY + Math.round(dy / prev.scale),
        }));
        lastTouch = p;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        lastTouch = null;
        pinch = null;
      }
      if (e.touches.length === 1) {
        pinch = null;
        lastTouch = getTouchPoint(e.touches[0]);
      }
    };

    tv.addEventListener('touchstart', handleTouchStart, { passive: false });
    tv.addEventListener('touchmove', handleTouchMove, { passive: false });
    tv.addEventListener('touchend', handleTouchEnd);

    return () => {
      tv.removeEventListener('touchstart', handleTouchStart);
      tv.removeEventListener('touchmove', handleTouchMove);
      tv.removeEventListener('touchend', handleTouchEnd);
    };
  }, [mode, calibration.scale, calibration.position]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') {
        setMode(prev => prev === 'calibration' ? 'operation' : 'calibration');
      }
      
      if (e.key.toLowerCase() === 'r') {
        // Reset para posição ideal
        const resetCalibration = {
          scale: 0.44,
          offsetX: -36,
          offsetY: -1504,
          position: 2.1,
          gridSize: 100,
          showGrid: false,
        };
        setCalibration(resetCalibration);
        console.log('Reset para posição ideal:', resetCalibration);
      }

      // Controle de navegação horizontal com setas
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const step = 2; // Sensibilidade do movimento
        const maxPos = getMaxPosition();
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const newPosition = Math.max(0, Math.min(maxPos, calibration.position + (step * direction)));
        
        setCalibration(prev => ({ ...prev, position: newPosition }));
        console.log('Navegação por teclado:', { key: e.key, newPosition, maxPos });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calibration.position, getMaxPosition]);

  // Wheel scroll e pinch do trackpad - baseado no HTML original
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    // Pinch do trackpad (Mac) - Ctrl+scroll ou deltaX+deltaY simultâneos
    if (e.ctrlKey || (Math.abs(e.deltaX) > 0 && Math.abs(e.deltaY) > 0)) {
      if (mode === 'operation') {
        // No modo operação: pinch move horizontalmente
        const sensitivity = 0.02; // Sensibilidade reduzida para controle mais fino
        const maxPos = getMaxPosition();
        const newPosition = Math.max(0, Math.min(maxPos, calibration.position + e.deltaY * sensitivity));
        setCalibration(prev => ({ ...prev, position: newPosition }));
        console.log('Trackpad Pinch (Operação):', { deltaY: e.deltaY, newPosition });
        return;
      } else {
        // No modo calibração: pinch faz zoom
        const pinchFactor = Math.abs(e.deltaY) / 200; // Sensibilidade do pinch
        const scaleChange = e.deltaY > 0 ? 1 + pinchFactor : 1 - pinchFactor;
        const newScale = Math.min(4.0, Math.max(0.05, calibration.scale * scaleChange));
        
        console.log('Trackpad Pinch (Calibração):', { deltaY: e.deltaY, ctrlKey: e.ctrlKey, scaleChange, newScale });
        
        setCalibration(prev => ({ ...prev, scale: newScale }));
        return;
      }
    }
    
    // Scroll horizontal normal
    const sensitivity = 0.02; // Sensibilidade reduzida para controle mais fino
    const maxPos = getMaxPosition();
    const newPosition = Math.max(0, Math.min(maxPos, calibration.position + e.deltaY * sensitivity));
    setCalibration(prev => ({ ...prev, position: newPosition }));
  }, [calibration.position, calibration.scale, mode, getMaxPosition]);

  useEffect(() => {
    const tv = document.getElementById('tv');
    if (tv) {
      tv.addEventListener('wheel', handleWheel, { passive: false });
      return () => tv.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* TV Container */}
      <div id="tv" className="relative w-full h-full border-4 border-gray-600 rounded-xl overflow-hidden bg-gray-900">
        
        {/* World Container */}
        <div 
          ref={worldRef}
          id="world"
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: `${Math.max(1080, imageDimensions.width)}px`,
            height: `${Math.max(1920, imageDimensions.height)}px`,
          }}
        >
          {/* Background Image */}
          <img
            ref={imgRef}
            id="img"
            src="/bg300x200-comtv.jpg"
            alt="Background"
            className="absolute top-0 left-0 w-auto h-auto max-w-none max-h-none"
            onLoad={handleImageLoad}
            style={{ imageRendering: 'auto' }}
          />
          
          {/* Frames removidos - usando apenas bullets agora */}

          {/* Target zones removidos - usando apenas bullets agora */}

        {/* Bullets - Pontos Pulsantes */}
        <div id="bullets" className="absolute inset-0 pointer-events-auto">
          {bullets.map(bullet => {
            const actualRadius = bullet.radius * bullet.size;
            return (
              <div
                key={bullet.id}
                id={`bullet-${bullet.id}`}
                className="absolute opacity-70 transition-all duration-300 pointer-events-auto cursor-pointer target-zone"
                style={{
                  left: `${bullet.x - actualRadius}px`,
                  top: `${bullet.y - actualRadius}px`,
                  width: `${actualRadius * 2}px`,
                  height: `${actualRadius * 2}px`,
                  zIndex: 20,
                }}
                onClick={() => handleBulletClick(bullet)}
              >
                <div 
                  className="w-full h-full rounded-full animate-pulse border-2 border-white/70 shadow-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${bullet.color}, ${bullet.color}dd)`,
                    transform: `scale(${bullet.size})`,
                    transformOrigin: 'center',
                  }}
                >
                  <div 
                    className="text-white font-bold"
                    style={{
                      fontSize: `${18 / bullet.size}px`,
                      transform: `scale(${1 / bullet.size})`,
                    }}
                  >
                    {bullet.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Grid */}
        {calibration.showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
              `,
              backgroundSize: `${calibration.gridSize}px ${calibration.gridSize}px`,
            }}
          />
        )}

        {/* Info Display */}
        <div className="absolute left-4 top-4 px-3 py-2 bg-black/60 border border-gray-600 rounded-full text-white text-sm backdrop-blur-sm z-10">
          {imageDimensions.width}×{imageDimensions.height} • escala {Math.round(calibration.scale * 100)}% • pos {calibration.position.toFixed(1)}% • off {calibration.offsetX} / {calibration.offsetY}
        </div>

        {/* Operation Mode HUD */}
        {mode === 'operation' && (
          <div className="absolute top-4 right-4 px-3 py-2 bg-black/60 border border-gray-600 rounded-full text-white text-sm backdrop-blur-sm z-10">
            • pos {calibration.position.toFixed(1)}% — • tecla <b>C</b> para Controles — • <b>← →</b> para navegar
            {udpEnabled && (
              <span className="ml-2">
                — • UDP {udpConnected ? '🟢' : '🔴'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Calibration Panel */}
      {mode === 'calibration' && (
        <div className="absolute top-20 left-4 w-80 bg-black/80 border border-gray-600 rounded-lg p-4 backdrop-blur-sm z-20">
          <h3 className="text-white text-lg font-bold mb-4">Calibração</h3>
          
          {/* Escala */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Escala: {Math.round(calibration.scale * 100)}%
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="1"
              value={calibration.scale * 100}
              onChange={(e) => handleCalibrationChange({ scale: parseFloat(e.target.value) / 100 })}
              className="w-full"
            />
          </div>

          {/* Posição */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Posição: {Math.round(calibration.position)}% / {getMaxPosition()}%
            </label>
            <input
              type="range"
              min="0"
              max={getMaxPosition()}
              step="1"
              value={calibration.position}
              onChange={(e) => handleCalibrationChange({ position: parseFloat(e.target.value) })}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              💡 Use scroll horizontal no touchpad (0-{getMaxPosition()}%)
            </p>
          </div>

          {/* Offset X */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Offset X: {calibration.offsetX}px
            </label>
            <input
              type="range"
              min="-2000"
              max="2000"
              step="10"
              value={calibration.offsetX}
              onChange={(e) => handleCalibrationChange({ offsetX: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Offset Y */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              Offset Y: {calibration.offsetY}px
            </label>
            <input
              type="range"
              min="-2000"
              max="2000"
              step="10"
              value={calibration.offsetY}
              onChange={(e) => handleCalibrationChange({ offsetY: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Grid */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-white text-sm">
              <input
                type="checkbox"
                checked={calibration.showGrid}
                onChange={(e) => handleCalibrationChange({ showGrid: e.target.checked })}
                className="w-4 h-4"
              />
              Mostrar Grid
            </label>
          </div>

          {/* Controle UDP */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                Controle UDP (Porta 8888)
              </label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${udpConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-400">
                  {udpConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUdpEnabled(!udpEnabled)}
                className={`px-3 py-1 text-xs rounded ${
                  udpEnabled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {udpEnabled ? 'Desativar UDP' : 'Ativar UDP'}
              </button>
              <span className="text-xs text-gray-400 self-center">
                Só funciona em modo operação
              </span>
            </div>
            <div className="mt-2 text-xs text-yellow-400">
              ⚠️ UDP ativo apenas no modo operação (tecla C)
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('operation')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Modo Operação (C)
            </button>
            <button
              onClick={() => {
                localStorage.setItem('trilho-marshal-config', JSON.stringify({ calibration, frames }));
                alert('Preset salvo!');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Salvar
            </button>
            
        {/* Controles dos Bullets */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-2">🎯 Bullets (12 pontos pulsantes)</h3>
          
          {/* Controles de posição */}
          <div className="flex gap-2 flex-wrap mb-3">
            <button
              onClick={saveBulletPositions}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
            >
              Salvar Posições
            </button>
            <button
              onClick={loadBulletPositions}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
            >
              Carregar Posições
            </button>
            <button
              onClick={() => {
                const newBullets = bullets.map(bullet => ({
                  ...bullet,
                  x: Math.random() * 15000 + 1000,
                  y: Math.random() * 2000 + 2000
                }));
                setBullets(newBullets);
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
            >
              Posições Aleatórias
            </button>
          </div>

          {/* Controles de tamanho e cor */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 block mb-1">Tamanho Global</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newBullets = bullets.map(bullet => ({ ...bullet, size: 1.0 }));
                    setBullets(newBullets);
                  }}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                >
                  Normal (1x)
                </button>
                <button
                  onClick={() => {
                    const newBullets = bullets.map(bullet => ({ ...bullet, size: 2.0 }));
                    setBullets(newBullets);
                  }}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                >
                  Grande (2x)
                </button>
                <button
                  onClick={() => {
                    const newBullets = bullets.map(bullet => ({ ...bullet, size: 3.0 }));
                    setBullets(newBullets);
                  }}
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                >
                  Grande (3x)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">Cores Aleatórias</label>
              <button
                onClick={() => {
                  const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#fbbf24'];
                  const newBullets = bullets.map(bullet => ({
                    ...bullet,
                    color: colors[Math.floor(Math.random() * colors.length)]
                  }));
                  setBullets(newBullets);
                }}
                className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs"
              >
                Cores Aleatórias
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Clique nos bullets para abrir animação sequencial com imagens da pasta correspondente
          </p>
        </div>
          </div>
          
          {/* Dicas de teclado */}
          <div className="mt-4 text-xs text-gray-400">
            <p>💡 <strong>Teclas:</strong> C = Alternar modos | R = Reset para posição ideal</p>
            <p>💡 <strong>Navegação:</strong> ← → = Movimento horizontal | Pinch/2 dedos = navegação horizontal</p>
            <p>💡 <strong>UDP:</strong> Envie valores 0-1 para porta 8888 (só em modo operação)</p>
          </div>
        </div>
      )}

      {/* Modal do Carrossel / Frame A Animation */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[80vw] h-[80vh] max-w-none max-h-none p-0 bg-black/90 backdrop-blur-md border-0">
          <DialogHeader className="absolute top-4 right-4 z-50">
            <DialogTitle className="sr-only">
              {selectedZone ? `Carrossel de Imagens - Target Zone ${selectedZone.id}` : 'Animação Frame A - FGTS 1990'}
            </DialogTitle>
            <button
              onClick={() => {
            setIsModalOpen(false);
            setSelectedBullet(null);
          }}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>
          </DialogHeader>
          {selectedBullet ? (
            <>
              {console.log('Renderizando BulletAnimation para bullet:', selectedBullet.id)}
              <BulletAnimation bullet={selectedBullet} />
            </>
          ) : (
            <>
              {console.log('Renderizando FrameAAnimation')}
              <FrameAAnimation />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}