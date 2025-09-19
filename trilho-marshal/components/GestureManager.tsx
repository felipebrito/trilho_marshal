'use client';

import React, { useRef, useCallback } from 'react';
import { CalibrationData } from '@/lib/types';

interface GestureManagerProps {
  mode: 'calibration' | 'operation';
  calibration: CalibrationData;
  onCalibrationChange: (calibration: Partial<CalibrationData>) => void;
  onModeChange?: (mode: 'calibration' | 'operation') => void;
}

export function GestureManager({ 
  mode, 
  calibration, 
  onCalibrationChange,
  onModeChange
}: GestureManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const pinchRef = useRef<{
    distance: number;
    scale: number;
    centerX: number;
    centerY: number;
  } | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const getTouchPoint = useCallback((touch: Touch) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.hypot(dx, dy);
  }, []);

  const getCenter = useCallback((touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }, []);

  // Throttling para melhor performance usando requestAnimationFrame
  const throttledUpdate = useCallback((updates: Partial<CalibrationData>) => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 8) { // ~120fps para máxima fluidez
      requestAnimationFrame(() => {
        onCalibrationChange(updates);
      });
      lastUpdateRef.current = now;
    }
  }, [onCalibrationChange]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (mode === 'operation') {
      // Modo operação: apenas navegação horizontal
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        lastTouchRef.current = getTouchPoint(touch);
      }
      return;
    }

    // Modo calibração: gestos completos
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastTouchRef.current = getTouchPoint(touch);
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = getDistance(touch1, touch2);
      const center = getCenter(touch1, touch2);
      
      pinchRef.current = {
        distance,
        scale: calibration.scale,
        centerX: center.x,
        centerY: center.y,
      };
    }
  }, [mode, calibration.scale, getTouchPoint, getDistance, getCenter]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();

    if (mode === 'operation') {
      // Modo operação: navegação horizontal
      if (e.touches.length === 1 && lastTouchRef.current) {
        const touch = e.touches[0];
        const currentPoint = getTouchPoint(touch);
        const deltaX = currentPoint.x - lastTouchRef.current.x;
        
        // Sensibilidade ajustada para navegação
        const sensitivity = 0.2;
        const newPosition = Math.max(0, Math.min(100, 
          calibration.position + (deltaX * sensitivity)
        ));
        
        onCalibrationChange({ position: newPosition });
        lastTouchRef.current = currentPoint;
      }
      return;
    }

    // Modo calibração: gestos completos
    if (e.touches.length === 1 && lastTouchRef.current) {
      // Pan gesture
      const touch = e.touches[0];
      const currentPoint = getTouchPoint(touch);
      const deltaX = currentPoint.x - lastTouchRef.current.x;
      const deltaY = currentPoint.y - lastTouchRef.current.y;
      
      // Sensibilidade aumentada e sem Math.round para fluidez
      const sensitivity = 1.5; // Aumentado de 1.0 para 1.5
      const newOffsetX = calibration.offsetX + (deltaX * sensitivity / calibration.scale);
      const newOffsetY = calibration.offsetY + (deltaY * sensitivity / calibration.scale);
      
      throttledUpdate({
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
      
      lastTouchRef.current = currentPoint;
    } else if (e.touches.length === 2 && pinchRef.current) {
      // Pinch gesture - simplificado para melhor fluidez
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = getDistance(touch1, touch2);
      
      const scaleRatio = distance / pinchRef.current.distance;
      let newScale = pinchRef.current.scale * scaleRatio;
      newScale = Math.max(0.05, Math.min(4.0, newScale));
      
      // Apenas atualizar escala, sem ajustar offset para simplicidade
      throttledUpdate({
        scale: newScale,
      });
    }
  }, [
    mode, 
    calibration, 
    throttledUpdate, 
    getTouchPoint, 
    getDistance, 
    getCenter
  ]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) {
      lastTouchRef.current = null;
      pinchRef.current = null;
    } else if (e.touches.length === 1) {
      pinchRef.current = null;
      const touch = e.touches[0];
      lastTouchRef.current = getTouchPoint(touch);
    }
  }, [getTouchPoint]);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Detectar scroll horizontal vs vertical
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
    
    // Se for scroll vertical, ignorar completamente
    if (isVertical) {
      return;
    }
    
    // Se for scroll horizontal ou deltaX não disponível, processar
    if (isHorizontal || e.deltaX !== 0) {
      e.preventDefault();
      
      // Navegação por scroll horizontal
      const sensitivity = 0.04;
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const newPosition = Math.max(0, Math.min(100, 
        calibration.position + (delta * sensitivity)
      ));
      
      onCalibrationChange({ position: newPosition });
    }
  }, [calibration.position, onCalibrationChange]);

  // Handler adicional para scroll com Shift (força horizontal)
  const handleWheelWithShift = useCallback((e: WheelEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      
      // Forçar scroll horizontal com Shift
      const sensitivity = 0.04;
      const newPosition = Math.max(0, Math.min(100, 
        calibration.position + (e.deltaY * sensitivity)
      ));
      
      onCalibrationChange({ position: newPosition });
    }
  }, [calibration.position, onCalibrationChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'c' && onModeChange) {
      onModeChange('calibration');
      return;
    }
    
    if (e.key.toLowerCase() === 'o' && onModeChange) {
      onModeChange('operation');
      return;
    }
    
    if (mode === 'calibration' && e.altKey) {
      const step = e.shiftKey ? 10 : 1;
      let newOffsetX = calibration.offsetX;
      let newOffsetY = calibration.offsetY;
      
      switch (e.key) {
        case 'ArrowLeft':
          newOffsetX -= step;
          break;
        case 'ArrowRight':
          newOffsetX += step;
          break;
        case 'ArrowUp':
          newOffsetY -= step;
          break;
        case 'ArrowDown':
          newOffsetY += step;
          break;
        default:
          return;
      }
      
      onCalibrationChange({
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    } else if (!e.altKey) {
      const step = e.shiftKey ? 5 : 1;
      let newPosition = calibration.position;
      
      switch (e.key) {
        case 'ArrowLeft':
          newPosition = Math.max(0, newPosition - step);
          break;
        case 'ArrowRight':
          newPosition = Math.min(100, newPosition + step);
          break;
        default:
          return;
      }
      
      onCalibrationChange({ position: newPosition });
    }
  }, [mode, calibration, onCalibrationChange, onModeChange]);

  // Attach event listeners
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('wheel', handleWheelWithShift, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('wheel', handleWheelWithShift);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, handleWheelWithShift, handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
}
