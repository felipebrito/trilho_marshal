import { useRef, useEffect, useState, ReactNode } from 'react';

interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 1000,
  easing = 'ease-out',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return;
    
    setHasStarted(true);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, hasStarted]);

  const blurValue = blur ? (isVisible ? 'blur(0px)' : 'blur(20px)') : 'none';
  const scaleValue = blur ? (isVisible ? 'scale(1)' : 'scale(1.05)') : 'scale(1)';

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        filter: blurValue,
        transform: scaleValue,
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeContent;