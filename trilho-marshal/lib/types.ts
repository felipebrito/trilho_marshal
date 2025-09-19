export interface CalibrationData {
  scale: number;
  offsetX: number;
  offsetY: number;
  position: number;
  gridSize: number;
  showGrid: boolean;
}

export interface FrameContent {
  title: string;
  images: string[];
  description?: string;
}

export interface Frame {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: FrameContent;
}

export interface AppState {
  mode: 'calibration' | 'operation';
  calibration: CalibrationData;
  frames: Frame[];
  currentFrame?: string;
  isModalOpen: boolean;
}

export interface TouchGesture {
  type: 'pan' | 'pinch' | 'swipe';
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  scale?: number;
  centerX?: number;
  centerY?: number;
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}
