'use client';

import React from 'react';
import BulletAnimation from './BulletAnimation';

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

interface BulletModalProps {
  isOpen: boolean;
  selectedBullet: Bullet | null;
  onClose: () => void;
  loadImagesFromFolder: (folderName: string) => void;
  isBlurEnabled: boolean;
}

export default function BulletModal({
  isOpen,
  selectedBullet,
  onClose,
  loadImagesFromFolder,
  isBlurEnabled
}: BulletModalProps) {
  if (!isOpen || !selectedBullet) return null;

  return (
    <div 
      id="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Overlay com blur */}
      <div 
        className={`absolute inset-0 bg-black/50 ${isBlurEnabled ? 'backdrop-blur-sm' : ''}`}
        onClick={onClose}
      ></div>
      
      {/* Conteúdo do Modal */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] w-full mx-4">
        <div 
          className="bg-white rounded-lg shadow-2xl overflow-hidden cursor-pointer"
          onClick={onClose}
        >
          <BulletAnimation 
            key={`${selectedBullet.id}-${isOpen}`} 
            bullet={selectedBullet} 
            loadImagesFromFolder={loadImagesFromFolder} 
          />
        </div>
      </div>
    </div>
  );
}
