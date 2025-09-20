'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useUDPControl } from '@/hooks/useUDPControl';
import FadeContent from './FadeContent';

// Registrar o plugin Draggable
gsap.registerPlugin(Draggable);

interface CalibrationData {
  scale: number;
  offsetX: number;
  offsetY: number;
  position: number;
  gridSize: number;
  showGrid: boolean;
  imageWidth: number;
  imageHeight: number;
}

interface Frame {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TargetZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  images: string[];
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  radius: number;
  folder: string;
  label: string;
  size: number; // Multiplicador de tamanho (1.0 = normal, 2.0 = 200% maior)
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
    imageWidth: 20000,
    imageHeight: 4000,
  });

  // Configurações de animação
  const animationConfig = {
    modalEntry: {
      duration: 0.3,        // Entrada do modal (mais rápido)
      ease: "power2.out"
    },
    imageFade: {
      duration: 0.4,        // Fade das imagens (mais rápido)
      ease: "power2.out"
    },
    imageDelay: 0.2,        // Delay entre imagens (mais rápido)
    stepDelay: 0.3          // Delay para indicadores (mais rápido)
  };
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

  // Frames antigos mantidos para compatibilidade
  const [frames, setFrames] = useState<Frame[]>([
    { id: 'A', x: 1700, y: 5000, width: 600, height: 400 },
    { id: 'B', x: 4000, y: 3400, width: 200, height: 150 },
    { id: 'C', x: 7000, y: 3100, width: 200, height: 150 },
    { id: 'D', x: 10000, y: 3500, width: 200, height: 150 },
    { id: 'E', x: 13000, y: 3300, width: 200, height: 150 },
    { id: 'F', x: 16000, y: 3600, width: 200, height: 150 },
  ]);

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
  const [isBackgroundLocked, setIsBackgroundLocked] = useState(false);
  const [isUDPActive, setIsUDPActive] = useState(false);
  const [selectedBulletForControl, setSelectedBulletForControl] = useState<Bullet | null>(null);

  // Função para carregar imagens de uma pasta específica
  const loadImagesFromFolder = (folder: string): string[] => {
    // Imagens obrigatórias
    const requiredImages = ['00_bg.png', '01_ano.png', '02_texto.png'];
    // Imagem opcional
    const optionalImages = ['03_imagem.png'];
    
    const allImages = [...requiredImages, ...optionalImages];
    return allImages.map(file => `/imagens/${folder}/${file}`);
  };

  // Função para ativar controle por teclas dos bullets
  const enableBulletKeyboardControl = () => {
    console.log('🎯 Ativando controle por teclas dos bullets...');
    
    // Adicionar classe para indicar que está em modo de controle
    bullets.forEach((bullet, index) => {
      const element = document.getElementById(`bullet-${bullet.id}`);
      if (element) {
        element.classList.add('keyboard-controlled');
      }
    });
    
    console.log('✅ Controle por teclas dos bullets ativado');
  };

  // Função para desativar controle por teclas dos bullets
  const disableBulletKeyboardControl = () => {
    console.log('🚫 Desativando controle por teclas dos bullets...');
    
    // Remover classe de controle
    bullets.forEach((bullet, index) => {
      const element = document.getElementById(`bullet-${bullet.id}`);
      if (element) {
        element.classList.remove('keyboard-controlled');
      }
    });
    
    console.log('✅ Controle por teclas dos bullets desativado');
  };

  // Função para salvar posições dos bullets
  const saveBulletPositions = () => {
    localStorage.setItem('trilho-marshal-bullets', JSON.stringify(bullets));
    console.log('💾 Posições dos bullets salvas:', bullets);
  };

  // Função para salvar todas as configurações (calibração + bullets)
  const saveAllConfigurations = () => {
    const config = {
      calibration, 
      frames, 
      bullets,
      isBackgroundLocked,
      isUDPActive,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('trilho-marshal-config', JSON.stringify(config));
    console.log('💾 Configurações salvas manualmente:', config);
    console.log('📐 Dimensões da imagem sendo salvas:', {
      imageWidth: calibration.imageWidth,
      imageHeight: calibration.imageHeight
    });
    alert('✅ Configurações salvas com sucesso!');
  };

  // Função para limpar todas as configurações
  const clearAllConfigurations = () => {
    if (confirm('⚠️ Tem certeza que deseja limpar todas as configurações salvas?')) {
      localStorage.removeItem('trilho-marshal-config');
      localStorage.removeItem('trilho-marshal-bullets');
      const idealPosition = getIdealPosition();
      setCalibration(idealPosition);
      console.log('🗑️ Todas as configurações foram limpas');
      alert('🗑️ Configurações limpas! Aplicação resetada para posição ideal.');
    }
  };

  // Função para carregar posições dos bullets
  const loadBulletPositions = () => {
    const saved = localStorage.getItem('trilho-marshal-bullets');
    if (saved) {
      try {
        const parsedBullets = JSON.parse(saved);
        // Garantir que as novas propriedades existam
        const bulletsWithDefaults = parsedBullets.map((bullet: any) => ({
          ...bullet,
          size: bullet.size || 2.0,
          color: bullet.color || '#22c55e'
        }));
        setBullets(bulletsWithDefaults);
        console.log('Posições dos bullets carregadas:', bulletsWithDefaults);
      } catch (error) {
        console.error('Erro ao carregar posições dos bullets:', error);
      }
    }
  };

  // Carregar posições dos bullets ao inicializar - REMOVIDO: agora carregado em loadAllConfigurations()
  // useEffect(() => {
  //   loadBulletPositions();
  // }, []);

  const [selectedZone, setSelectedZone] = useState<TargetZone | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estado do controle UDP - REMOVIDO: usando isUDPActive agora

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
    const railRightX = Math.max(0, calibration.imageWidth - 1080);
    const cameraX = railLeftX + (railRightX - railLeftX) * (calibration.position / 100);
    // Garantir que a câmera não ultrapasse o limite para evitar fundo escuro
    return Math.min(cameraX, railRightX * 0.768); // Limitar a 76.8% do railRightX
  }, [calibration.position, calibration.imageWidth]);

  // Calcular o range máximo baseado na escala atual
  const getMaxPosition = useCallback(() => {
    if (calibration.imageWidth === 0) {
      console.log('getMaxPosition: calibration.imageWidth é 0, retornando 100');
      return 100;
    }
    const railWidth = Math.max(0, calibration.imageWidth - 1080);
    // Ajustar o range máximo baseado na escala para manter a imagem no viewport
    const scaleFactor = calibration.scale;
    const maxPos = Math.ceil((railWidth / 1080) * 100 * scaleFactor);
    // Limitar para evitar que a imagem saia do viewport
    const result = Math.min(76.8, maxPos);
    console.log('getMaxPosition:', { 
      imageWidth: calibration.imageWidth, 
      railWidth, 
      scaleFactor, 
      maxPos, 
      result 
    });
    // Forçar um valor mínimo para teste
    return Math.max(50, result);
  }, [calibration.imageWidth, calibration.scale]);

  // Estado para suavização UDP (removido - usando atualização direta)

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
    
    console.log('UDP: Conversão:', {
      valorOriginal: position,
      percentage: percentage,
      maxPos: maxPos,
      newPosition: newPosition,
      posicaoAtual: calibration.position
    });
    
    // Atualizar posição diretamente (sem suavização para máxima responsividade)
    setCalibration(prev => ({
      ...prev,
      position: newPosition
    }));
  }, [getMaxPosition, mode, calibration.position]);

  // Animação UDP removida - usando atualização direta para máxima responsividade

  // Hook UDP Control - só funciona em modo operação
  const { isConnected } = useUDPControl({
    onPositionChange: handleUDPPositionChange,
    enabled: isUDPActive && mode === 'operation'
  });

  // Debug do estado UDP
  useEffect(() => {
    const enabled = isUDPActive && mode === 'operation';
    console.log('UDP Debug:', {
      isUDPActive,
      mode,
      enabled,
      isConnected,
      timestamp: new Date().toISOString()
    });
  }, [isUDPActive, mode, isConnected]);

  // Debug específico para mudanças no enabled
  useEffect(() => {
    const enabled = isUDPActive && mode === 'operation';
    console.log('🔍 UDP Enabled mudou:', enabled, 'isUDPActive:', isUDPActive, 'mode:', mode);
  }, [isUDPActive, mode]);

  // Atualizar estado de conexão UDP - REMOVIDO: usando isUDPActive agora


  // Aplicar transformações (exatamente como no HTML original)
  const updateTransform = useCallback(() => {
    if (!worldRef.current) return;

    const cameraX = getCameraX();
    const translateX = (-cameraX + calibration.offsetX) * calibration.scale;
    const translateY = calibration.offsetY * calibration.scale;

    // Garantir que a imagem não saia do viewport
    const maxTranslateX = 0; // Não pode ir para a direita além do viewport
    const minTranslateX = -(calibration.imageWidth * calibration.scale - 1080); // Não pode ir para a esquerda além do viewport
    
    const clampedTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, translateX));

    worldRef.current.style.transform = `translate(${clampedTranslateX}px, ${translateY}px) scale(${calibration.scale})`;
  }, [calibration, getCameraX]);

  // Atualizar visibilidade dos frames e target zones
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
  }, [frames, targetZones, calibration.offsetY, getCameraX]);

  // Carregar imagem
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const newDimensions = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
    // Atualizar dimensões na calibração se ainda não foram definidas
    if (calibration.imageWidth === 20000 && calibration.imageHeight === 4000) {
      setCalibration(prev => ({
        ...prev,
        imageWidth: newDimensions.width,
        imageHeight: newDimensions.height
      }));
    }
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

  // Removido salvamento automático para evitar conflitos
  // Use o botão "Salvar Posições" para salvar manualmente

  // Posição ideal padrão
  const getIdealPosition = () => ({
    scale: 0.44,
    offsetX: -36,
    offsetY: -1504,
    position: 2.1,
    gridSize: 100,
    showGrid: false,
    imageWidth: 20000,
    imageHeight: 4000,
  });

  // Controlar controle por teclas dos bullets baseado no travamento
  useEffect(() => {
    if (isBackgroundLocked) {
      enableBulletKeyboardControl();
    } else {
      disableBulletKeyboardControl();
      setSelectedBulletForControl(null); // Limpar seleção ao destravar
    }
  }, [isBackgroundLocked]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      disableBulletKeyboardControl();
    };
  }, []);

  // Carregar configurações automaticamente
  useEffect(() => {
    console.log('🔄 Iniciando carregamento de configurações...');
    const saved = localStorage.getItem('trilho-marshal-config');
    
    if (saved) {
      try {
        const config = JSON.parse(saved);
        console.log('📁 Configurações encontradas no localStorage:', config);
        
        // Carregar calibração
        if (config.calibration) {
          // Garantir que as dimensões da imagem existam (compatibilidade com versões antigas)
          const calibrationWithDefaults = {
            ...config.calibration,
            imageWidth: config.calibration.imageWidth || 20000,
            imageHeight: config.calibration.imageHeight || 4000
          };
          setCalibration(prev => ({ ...prev, ...calibrationWithDefaults }));
          console.log('✅ Calibração carregada:', calibrationWithDefaults);
          console.log('📐 Dimensões da imagem carregadas:', {
            imageWidth: calibrationWithDefaults.imageWidth,
            imageHeight: calibrationWithDefaults.imageHeight
          });
        }
        
        // Carregar frames
        if (config.frames) {
          setFrames(config.frames);
          console.log('✅ Frames carregados:', config.frames);
        }
        
        // Carregar bullets
        if (config.bullets) {
          const bulletsWithDefaults = config.bullets.map((bullet: any) => ({
            ...bullet,
            size: bullet.size || 2.0,
            color: bullet.color || '#22c55e'
          }));
          setBullets(bulletsWithDefaults);
          console.log('✅ Bullets carregados:', bulletsWithDefaults);
        }
        
        // Carregar estado de travamento
        if (config.isBackgroundLocked !== undefined) {
          setIsBackgroundLocked(config.isBackgroundLocked);
          console.log('✅ Estado de travamento carregado:', config.isBackgroundLocked);
        }
        
        // Carregar estado UDP
        if (config.isUDPActive !== undefined) {
          setIsUDPActive(config.isUDPActive);
          console.log('✅ Estado UDP carregado:', config.isUDPActive);
        }
        
        console.log('🎉 Todas as configurações carregadas com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
        // Se não conseguir carregar, usa a posição ideal
        const idealPosition = getIdealPosition();
        setCalibration(idealPosition);
        console.log('🔄 Usando posição ideal após erro de carregamento');
      }
    } else {
      // Se não há configurações salvas, usa a posição ideal
      const idealPosition = getIdealPosition();
      setCalibration(idealPosition);
      console.log('🆕 Usando posição ideal padrão (primeira vez)');
    }
  }, []);

  // Handlers
  const handleCalibrationChange = (newCalibration: Partial<CalibrationData>) => {
    console.log('🔧 Mudança de calibração:', newCalibration);
    if (newCalibration.imageWidth || newCalibration.imageHeight) {
      console.log('📐 Dimensões sendo alteradas:', {
        imageWidth: newCalibration.imageWidth,
        imageHeight: newCalibration.imageHeight
      });
    }
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

  const handleTargetZoneClick = (zone: TargetZone) => {
    setSelectedZone(zone);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  // Função para clicar em um bullet
  const handleBulletClick = (bullet: Bullet) => {
    // Se o background estiver travado, selecionar bullet para controle por teclas
    if (isBackgroundLocked) {
      const timestamp = new Date().toISOString();
      console.log(`🎯 BULLET SELECIONADO [${timestamp}]:`, {
        bulletId: bullet.id,
        bulletLabel: bullet.label,
        posicaoAtual: { x: bullet.x, y: bullet.y },
        size: bullet.size,
        color: bullet.color,
        isBackgroundLocked: isBackgroundLocked
      });
      setSelectedBulletForControl(bullet);
      return;
    }
    
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
              { 
                opacity: 1, 
                scale: 1, 
                duration: 0.3, 
                ease: "power2.out" 
              }
            );

            // Sequência de steps para indicadores
            const stepTimeline = gsap.timeline({ delay: 0.3 });
            stepTimeline.call(() => setCurrentStep(1), [], 0.2);
            stepTimeline.call(() => setCurrentStep(2), [], 0.4);
            stepTimeline.call(() => setCurrentStep(3), [], 0.6);

          }, []);

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
                  alt="Ano 1990"
                  className="w-full h-full object-contain"
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
                />
              </div>

              {/* Indicadores de progresso */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
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

              {/* Botão de teste para debug */}
              <button
                onClick={() => {
                  console.log('🧪 TESTE: Forçando re-render');
                  setCurrentStep(0);
                  setTimeout(() => setCurrentStep(1), 100);
                  setTimeout(() => setCurrentStep(2), 200);
                  setTimeout(() => setCurrentStep(3), 300);
                }}
                className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded text-xs z-10"
              >
                TESTE
              </button>
            </div>
          );
        };

        // Componente de animação sequencial para Bullets
        const BulletAnimation = ({ bullet }: { bullet: Bullet }) => {
          const [currentStep, setCurrentStep] = useState(0);
          const [imagesLoaded, setImagesLoaded] = useState(false);
          const animationRef = useRef<HTMLDivElement>(null);

          const images = loadImagesFromFolder(bullet.folder);
          console.log('🎬 BulletAnimation: Carregando imagens para', bullet.folder, ':', images);

          useEffect(() => {
            if (!animationRef.current) return;

            console.log('🎬 BulletAnimation: Iniciando animação para', bullet.id);

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

          }, [bullet.id]);

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

              {/* Debug info */}
              <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs z-50">
                <div>Step: {currentStep}</div>
                <div>Images: {images.length}</div>
                <div>Folder: {bullet.folder}</div>
              </div>
            </div>
          );
        };

  // Componente do carrossel modal
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
      // Se o background estiver travado, não processar toques
      if (isBackgroundLocked) {
        console.log('🔒 Background travado - toques desabilitados');
        return;
      }

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
      // Se o background estiver travado, não processar movimentos
      if (isBackgroundLocked) {
        console.log('🔒 Background travado - movimentos desabilitados');
        return;
      }

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
  }, [mode, calibration.scale, calibration.position, isBackgroundLocked]);

      // Teclado
      useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === 'c') {
            setMode(prev => prev === 'calibration' ? 'operation' : 'calibration');
          }
          
          if (e.key.toLowerCase() === 'r') {
            // Reset para posição ideal
            const resetCalibration = getIdealPosition();
            setCalibration(resetCalibration);
            console.log('🔄 Reset para posição ideal:', resetCalibration);
          }
          
          if (e.key.toLowerCase() === 't') {
            // Toggle trava/destrava background
            setIsBackgroundLocked(prev => {
              const newState = !prev;
              console.log(`🔒 Background ${newState ? 'travado' : 'destravado'}`);
              return newState;
            });
          }
          
          if (e.key.toLowerCase() === 'u') {
            // Toggle UDP ativo/inativo
            setIsUDPActive(prev => {
              const newState = !prev;
              console.log(`📡 UDP ${newState ? 'ativado' : 'desativado'} (anterior: ${prev})`);
              return newState;
            });
          }
          
          if (e.key.toLowerCase() === 's') {
            // Salvar todas as configurações
            saveAllConfigurations();
          }

        // Se estiver travado e tiver bullet selecionado, controlar bullet
        if (isBackgroundLocked && selectedBulletForControl) {
          const step = e.shiftKey ? 500 : 100; // Shift = movimento muito maior
          let newX = selectedBulletForControl.x;
          let newY = selectedBulletForControl.y;
          
          // Debug detalhado da tecla pressionada
          const timestamp = new Date().toISOString();
          console.log(`🔍 DEBUG TECLA [${timestamp}]:`, {
            key: e.key,
            shiftKey: e.shiftKey,
            step: step,
            bulletId: selectedBulletForControl.id,
            posicaoAtual: { x: newX, y: newY },
            bulletLabel: selectedBulletForControl.label
          });
          
          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              newY = newY - step; // Removido Math.max(0, ...) para permitir movimento livre
              console.log(`⬆️ ARROW UP: ${selectedBulletForControl.y} → ${newY} (step: ${step})`);
              break;
            case 'ArrowDown':
              e.preventDefault();
              newY = newY + step;
              console.log(`⬇️ ARROW DOWN: ${selectedBulletForControl.y} → ${newY} (step: ${step})`);
              break;
            case 'ArrowLeft':
              e.preventDefault();
              newX = newX - step; // Removido Math.max(0, ...) para permitir movimento livre
              console.log(`⬅️ ARROW LEFT: ${selectedBulletForControl.x} → ${newX} (step: ${step})`);
              break;
            case 'ArrowRight':
              e.preventDefault();
              newX = newX + step;
              console.log(`➡️ ARROW RIGHT: ${selectedBulletForControl.x} → ${newX} (step: ${step})`);
              break;
            case 'PageUp':
              e.preventDefault();
              newY = newY - (step * 5); // Movimento muito maior - sem limitação
              console.log(`📄 PAGE UP: ${selectedBulletForControl.y} → ${newY} (step: ${step * 5})`);
              break;
            case 'PageDown':
              e.preventDefault();
              newY = newY + (step * 5);
              console.log(`📄 PAGE DOWN: ${selectedBulletForControl.y} → ${newY} (step: ${step * 5})`);
              break;
            case 'Home':
              e.preventDefault();
              newX = newX - (step * 5); // Sem limitação
              console.log(`🏠 HOME: ${selectedBulletForControl.x} → ${newX} (step: ${step * 5})`);
              break;
            case 'End':
              e.preventDefault();
              newX = newX + (step * 5);
              console.log(`🏁 END: ${selectedBulletForControl.x} → ${newX} (step: ${step * 5})`);
              break;
            case 'Escape':
              e.preventDefault();
              setSelectedBulletForControl(null);
              console.log('🎯 Controle do bullet cancelado');
              return;
            default:
              return; // Não processar outras teclas
          }
          
          // Debug antes da atualização
          console.log(`🔄 ANTES DA ATUALIZAÇÃO:`, {
            bulletId: selectedBulletForControl.id,
            posicaoAnterior: { x: selectedBulletForControl.x, y: selectedBulletForControl.y },
            novaPosicao: { x: newX, y: newY },
            diferenca: { x: newX - selectedBulletForControl.x, y: newY - selectedBulletForControl.y }
          });
          
          // Atualizar posição do bullet selecionado
          setBullets(prev => {
            const updatedBullets = prev.map(bullet => 
              bullet.id === selectedBulletForControl.id 
                ? { ...bullet, x: newX, y: newY }
                : bullet
            );
            
            // Debug após a atualização
            const updatedBullet = updatedBullets.find(b => b.id === selectedBulletForControl.id);
            console.log(`✅ APÓS ATUALIZAÇÃO:`, {
              bulletId: selectedBulletForControl.id,
              posicaoFinal: { x: updatedBullet?.x, y: updatedBullet?.y },
              timestamp: new Date().toISOString()
            });
            
            return updatedBullets;
          });
          
          // CRÍTICO: Atualizar o selectedBulletForControl com a nova posição
          setSelectedBulletForControl(prev => prev ? { ...prev, x: newX, y: newY } : null);
          
          console.log(`🎯 Bullet ${selectedBulletForControl.id} movido para:`, { x: newX, y: newY });
          return;
        }

      // Controle de navegação horizontal com teclas O e P (só se não estiver travado)
      if ((e.key.toLowerCase() === 'o' || e.key.toLowerCase() === 'p') && !isBackgroundLocked) {
        e.preventDefault();
        const step = 2; // Sensibilidade ajustada para fluidez
        const maxPos = getMaxPosition();
        const direction = e.key.toLowerCase() === 'o' ? -1 : 1; // O = esquerda, P = direita
        const newPosition = Math.max(0, Math.min(maxPos, calibration.position + (step * direction)));
        
        setCalibration(prev => ({ ...prev, position: newPosition }));
        console.log('TECLADO:', { key: e.key, step, maxPos, oldPos: calibration.position, newPosition });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calibration.position, getMaxPosition, isBackgroundLocked, selectedBulletForControl]);


  // Evento wheel global - mais confiável
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      // Só processar se o evento for no elemento TV ou seus filhos
      const target = e.target as HTMLElement;
      const tv = document.getElementById('tv');
      
      if (!tv || !tv.contains(target)) {
        return; // Ignorar eventos fora da TV
      }
      
      // Se o background estiver travado, não processar gestos
      if (isBackgroundLocked) {
        console.log('🔒 Background travado - gestos desabilitados');
        return;
      }
      
      e.preventDefault();
      
      console.log('🎯 WHEEL EVENT:', { 
        deltaY: e.deltaY, 
        ctrlKey: e.ctrlKey, 
        mode,
        currentPosition: calibration.position,
        maxPos: getMaxPosition(),
        isBackgroundLocked
      });
      
      // SEMPRE aplicar movimento horizontal com sensibilidade suavizada
      const sensitivity = 0.3; // Sensibilidade mais baixa para fluidez
      const maxPos = getMaxPosition();
      const oldPosition = calibration.position;
      const newPosition = Math.max(0, Math.min(maxPos, oldPosition + e.deltaY * sensitivity));
      
      setCalibration(prev => ({ ...prev, position: newPosition }));
      
      console.log('🚀 WHEEL APLICADO:', { 
        deltaY: e.deltaY, 
        sensitivity,
        oldPosition, 
        newPosition, 
        maxPos,
        mudou: oldPosition !== newPosition
      });
    };
    
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [calibration.position, mode, getMaxPosition, isBackgroundLocked]);

  return (
    <>
      <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* TV Container */}
      <div id="tv" className="relative w-full h-full border-4 border-gray-600 rounded-xl overflow-hidden bg-gray-900">
        
        {/* World Container */}
        <div 
          ref={worldRef}
          id="world"
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: `${Math.max(1080, calibration.imageWidth)}px`,
            height: `${Math.max(1920, calibration.imageHeight)}px`,
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
            style={{ 
              imageRendering: 'auto',
              width: `${calibration.imageWidth}px`,
              height: `${calibration.imageHeight}px`
            }}
          />
          
          {/* Frames */}
          {/* <div id="frames" className="absolute inset-0 pointer-events-auto">
            {frames.map(frame => (
              <div
                key={frame.id}
                id={`frame-${frame.id}`}
                className="absolute border-2 border-white/70 bg-black/35 text-white text-xs font-mono p-0 rounded-lg opacity-60 transition-all duration-150 pointer-events-auto cursor-pointer overflow-hidden"
                style={{
                  left: `${frame.x}px`,
                  top: `${frame.y}px`,
                  width: `${frame.width}px`,
                  height: `${frame.height}px`,
                  zIndex: 10,
                }}
                onClick={() => handleFrameClick(frame.id)}
              >
                <FrameSlider frameId={frame.id} />
              </div>
            ))}
          </div> */}

          {/* Target Zones - Círculos Pulsantes */}
          {/* <div id="target-zones" className="absolute inset-0 pointer-events-auto">
            {targetZones.map(zone => (
              <div
                key={zone.id}
                id={`target-${zone.id}`}
                className="absolute opacity-60 transition-all duration-300 pointer-events-auto cursor-pointer target-zone"
                style={{
                  left: `${zone.x - zone.radius}px`,
                  top: `${zone.y - zone.radius}px`,
                  width: `${zone.radius * 2}px`,
                  height: `${zone.radius * 2}px`,
                  zIndex: 15,
                }}
                onClick={() => handleTargetZoneClick(zone)}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse border-2 border-white/50 shadow-lg flex items-center justify-center">
                  <div className="text-white text-xs font-bold">T{zone.id.slice(1)}</div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Bullets - Pontos Pulsantes */}
          <div id="bullets" className="absolute inset-0 pointer-events-auto">
            {bullets.map(bullet => {
              const actualRadius = bullet.radius * bullet.size;
              return (
                <div
                  key={bullet.id}
                  id={`bullet-${bullet.id}`}
                  className={`absolute opacity-70 transition-all duration-300 pointer-events-auto target-zone ${
                    isBackgroundLocked ? 'cursor-pointer' : 'cursor-pointer'
                  } ${
                    selectedBulletForControl?.id === bullet.id ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''
                  }`}
                  style={{
                    left: `${bullet.x}px`,
                    top: `${bullet.y}px`,
                    width: `${actualRadius * 2}px`,
                    height: `${actualRadius * 2}px`,
                    zIndex: 20,
                    transform: `translate(-50%, -50%)`, // Centralizar o bullet na posição
                    position: 'absolute', // Garantir posicionamento absoluto
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
                        fontSize: `${120 / bullet.size}px`,
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
          {calibration.imageWidth}×{calibration.imageHeight} • escala {Math.round(calibration.scale * 100)}% • pos {calibration.position.toFixed(1)}% • off {calibration.offsetX} / {calibration.offsetY}
        </div>

        {/* Operation Mode HUD */}
        {mode === 'operation' && (
          <div className="absolute top-4 right-4 px-3 py-2 bg-black/60 border border-gray-600 rounded-full text-white text-sm backdrop-blur-sm z-10">
            • pos {calibration.position.toFixed(1)}% — • tecla <b>C</b> para Controles — • <b>← →</b> para navegar
            {isUDPActive && (
              <span className="ml-2">
                — • UDP {isConnected ? '🟢' : '🔴'}
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

          {/* Dimensões da Imagem */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-3">📐 Dimensões da Imagem</h3>
            
            {/* Largura da Imagem */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-white mb-2">
                Largura: {calibration.imageWidth}px
              </label>
              <input
                type="range"
                min="5000"
                max="50000"
                step="100"
                value={calibration.imageWidth}
                onChange={(e) => handleCalibrationChange({ imageWidth: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 Ajuste a largura total da imagem de fundo
              </p>
            </div>

            {/* Altura da Imagem */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-white mb-2">
                Altura: {calibration.imageHeight}px
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="50"
                value={calibration.imageHeight}
                onChange={(e) => handleCalibrationChange({ imageHeight: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 Ajuste a altura total da imagem de fundo
              </p>
            </div>

            {/* Botões de Reset */}
            <div className="flex gap-2">
              <button
                onClick={() => handleCalibrationChange({ imageWidth: 20000, imageHeight: 4000 })}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Reset Padrão
              </button>
              <button
                onClick={() => handleCalibrationChange({ imageWidth: 30000, imageHeight: 6000 })}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Grande
              </button>
              <button
                onClick={() => handleCalibrationChange({ imageWidth: 15000, imageHeight: 3000 })}
                className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
              >
                Pequena
              </button>
            </div>
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

          {/* Configurações de Animação */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-3">🎬 Configurações de Animação</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  Velocidade do Fade: {animationConfig.imageFade.duration}s
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={animationConfig.imageFade.duration}
                  onChange={(e) => {
                    // Atualizar configuração de animação
                    animationConfig.imageFade.duration = parseFloat(e.target.value);
                    console.log('Velocidade do fade atualizada:', animationConfig.imageFade.duration);
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  Delay entre Imagens: {animationConfig.imageDelay}s
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={animationConfig.imageDelay}
                  onChange={(e) => {
                    animationConfig.imageDelay = parseFloat(e.target.value);
                    console.log('Delay entre imagens atualizado:', animationConfig.imageDelay);
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  Velocidade de Entrada: {animationConfig.modalEntry.duration}s
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={animationConfig.modalEntry.duration}
                  onChange={(e) => {
                    animationConfig.modalEntry.duration = parseFloat(e.target.value);
                    console.log('Velocidade de entrada atualizada:', animationConfig.modalEntry.duration);
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    animationConfig.imageFade.duration = 0.2;
                    animationConfig.imageDelay = 0.1;
                    animationConfig.modalEntry.duration = 0.2;
                    console.log('Configurações de animação resetadas para velocidade máxima');
                  }}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                >
                  Velocidade Máxima
                </button>
                <button
                  onClick={() => {
                    animationConfig.imageFade.duration = 0.8;
                    animationConfig.imageDelay = 0.5;
                    animationConfig.modalEntry.duration = 0.5;
                    console.log('Configurações de animação resetadas para velocidade normal');
                  }}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                >
                  Velocidade Normal
                </button>
              </div>
            </div>
          </div>


          {/* Controle UDP */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                📡 Controle UDP
              </label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isUDPActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-400">
                  {isUDPActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsUDPActive(!isUDPActive);
                  console.log('📡 UDP ativado:', !isUDPActive);
                }}
                className={`px-3 py-1 text-xs rounded ${
                  isUDPActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isUDPActive ? '📡 Desativar UDP' : '📡 Ativar UDP'}
              </button>
              <span className="text-xs text-gray-400 flex items-center">
                {isUDPActive ? 'Escutando porta 8888' : 'UDP desabilitado'}
              </span>
            </div>
          </div>

          {/* Controle de Travamento do Background */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                🔒 Travamento do Background
              </label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isBackgroundLocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-xs text-gray-400">
                  {isBackgroundLocked ? 'Travado' : 'Livre'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsBackgroundLocked(!isBackgroundLocked);
                  console.log('🔒 Background travado:', !isBackgroundLocked);
                }}
                className={`px-3 py-1 text-xs rounded ${
                  isBackgroundLocked 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isBackgroundLocked ? '🔒 Destravar' : '🔓 Travar'}
              </button>
              <span className="text-xs text-gray-400 self-center">
                {isBackgroundLocked ? 'Gestos desabilitados' : 'Gestos habilitados'}
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-400">
              💡 Trave o background após configurar a posição ideal
            </div>
            {isBackgroundLocked && (
              <div className="mt-2 text-xs text-yellow-400">
                🎯 Clique em um bullet e use as teclas para mover
                <div className="mt-1 text-xs text-gray-300">
                  Setas: 100px | Shift+Setas: 500px | Page Up/Down: 2500px | Home/End: 2500px
                </div>
                {selectedBulletForControl && (
                  <div className="mt-1 text-green-400">
                    ✅ Controlando: {selectedBulletForControl.label} (ESC para cancelar)
                  </div>
                )}
              </div>
            )}
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
              onClick={saveAllConfigurations}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Salvar Posições
            </button>
            <button
              onClick={() => {
                const idealPosition = getIdealPosition();
                setCalibration(idealPosition);
                console.log('🔄 Reset para posição ideal via botão');
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
            >
              Reset Ideal (R)
            </button>
            <button
              onClick={clearAllConfigurations}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Limpar Tudo
            </button>
            
            {/* Controles dos Bullets */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-2">🎯 Bullets (12 pontos pulsantes)</h3>
              <div className="flex gap-2 flex-wrap">
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
              <div className="space-y-3 mt-3">
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

              {/* Configuração Individual de Bullets */}
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-3">⚙️ Configuração Individual</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {bullets.map(bullet => (
                    <div key={bullet.id} className="bg-gray-600 p-2 rounded text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white" style={{ color: bullet.color }}>
                          {bullet.label} ({bullet.id})
                        </span>
                        <div 
                          className="w-3 h-3 rounded-full border border-white/30" 
                          style={{ backgroundColor: bullet.color }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-gray-300 mb-1">X:</label>
                          <input
                            type="number"
                            value={bullet.x}
                            onChange={(e) => {
                              const newX = parseInt(e.target.value) || 0;
                              setBullets(prev => prev.map(b => 
                                b.id === bullet.id ? { ...b, x: newX } : b
                              ));
                            }}
                            className="w-full px-1 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-1">Y:</label>
                          <input
                            type="number"
                            value={bullet.y}
                            onChange={(e) => {
                              const newY = parseInt(e.target.value) || 0;
                              setBullets(prev => prev.map(b => 
                                b.id === bullet.id ? { ...b, y: newY } : b
                              ));
                            }}
                            className="w-full px-1 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-1">Escala:</label>
                          <input
                            type="range"
                            min="0.5"
                            max="5.0"
                            step="0.1"
                            value={bullet.size}
                            onChange={(e) => {
                              const newSize = parseFloat(e.target.value);
                              setBullets(prev => prev.map(b => 
                                b.id === bullet.id ? { ...b, size: newSize } : b
                              ));
                            }}
                            className="w-full"
                          />
                          <span className="text-gray-400">{bullet.size.toFixed(1)}x</span>
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-1">Cor:</label>
                          <input
                            type="color"
                            value={bullet.color}
                            onChange={(e) => {
                              setBullets(prev => prev.map(b => 
                                b.id === bullet.id ? { ...b, color: e.target.value } : b
                              ));
                            }}
                            className="w-full h-6 rounded border border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Clique nos bullets para abrir carrossel com imagens da pasta correspondente
              </p>
            </div>
          </div>
          
          {/* Dicas de teclado */}
          <div className="mt-4 text-xs text-gray-400">
            <p>💡 <strong>Teclas:</strong> C = Alternar modos | R = Reset | O/P = Navegar | T = Travar | U = UDP | S = Salvar</p>
            <p>💡 <strong>Navegação:</strong> O/P = Movimento horizontal | Scroll trackpad = navegação horizontal</p>
            <p>💡 <strong>UDP:</strong> Envie valores 0-1 para porta 8888 (só em modo operação)</p>
            <p>💡 <strong>Persistência:</strong> Clique em "Salvar Posições" para salvar | "Limpar Tudo" para resetar</p>
          </div>
        </div>
      )}

        {/* Modal do Carrossel / Frame A Animation */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay com blur */}
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-lg"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedBullet(null);
              }}
            ></div>
            
            {/* Conteúdo do modal */}
            <div className="relative w-[80vw] h-[80vh] bg-transparent rounded-lg overflow-hidden z-10">
              {/* Botão de fechar */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBullet(null);
                }}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-50"
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
              
              {/* Conteúdo */}
              <div className="w-full h-full">
                {selectedBullet ? (
                  <>
                    {console.log('Renderizando BulletAnimation para bullet:', selectedBullet.id)}
                    <BulletAnimation bullet={selectedBullet} />
                  </>
                ) : selectedZone ? (
                  <>
                    {console.log('Renderizando ImageCarousel para zone:', selectedZone.id)}
                    <ImageCarousel />
                  </>
                ) : (
                  <>
                    {console.log('Renderizando FrameAAnimation')}
                    <FrameAAnimation />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}