'use client';

import React, { useState, useEffect } from 'react';
import { Frame } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ModalSystemProps {
  isOpen: boolean;
  onClose: () => void;
  frame?: Frame;
}

export function ModalSystem({ isOpen, onClose, frame }: ModalSystemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setDragDeltaX(deltaX);
  };

  // Handle drag end
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    if (Math.abs(dragDeltaX) > threshold) {
      if (dragDeltaX > 0) {
        // Swipe right - previous image
        goToPreviousImage();
      } else {
        // Swipe left - next image
        goToNextImage();
      }
    }
    
    setIsDragging(false);
    setDragDeltaX(0);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStartX(touch.clientX);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    setDragDeltaX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50;
    if (Math.abs(dragDeltaX) > threshold) {
      if (dragDeltaX > 0) {
        goToPreviousImage();
      } else {
        goToNextImage();
      }
    }
    
    setIsDragging(false);
    setDragDeltaX(0);
  };

  const goToNextImage = () => {
    if (!frame) return;
    setCurrentImageIndex((prev) => 
      prev < frame.content.images.length - 1 ? prev + 1 : 0
    );
  };

  const goToPreviousImage = () => {
    if (!frame) return;
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : frame.content.images.length - 1
    );
  };

  if (!frame) return null;

  const currentImage = frame.content.images[currentImageIndex];
  const hasMultipleImages = frame.content.images.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-gray-600">
        <DialogHeader className="p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">
              {frame.content.title}
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {frame.content.description && (
            <p className="text-gray-300 text-sm mt-2">
              {frame.content.description}
            </p>
          )}
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden">
          {/* Image Container */}
          <div
            className="relative w-full h-[60vh] overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transform: `translateX(${dragDeltaX * 0.1}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
              }}
            >
              <img
                src={currentImage}
                alt={`${frame.content.title} - Imagem ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  opacity: isDragging ? 0.8 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
            </div>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {frame.content.images.length}
            </div>
          )}

          {/* Dots Indicator */}
          {hasMultipleImages && frame.content.images.length <= 10 && (
            <div className="flex justify-center space-x-2 p-4">
              {frame.content.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-gray-500 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
