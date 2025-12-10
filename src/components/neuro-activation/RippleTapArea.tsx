import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleTapAreaProps {
  children: ReactNode;
  onTap?: () => void;
  disabled?: boolean;
  className?: string;
  rippleColor?: string;
}

export function RippleTapArea({ 
  children, 
  onTap, 
  disabled = false,
  className = "",
  rippleColor = "hsl(var(--primary))"
}: RippleTapAreaProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onTap?.();
  }, [disabled, onTap]);

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      onClick={handleClick}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: `radial-gradient(circle, ${rippleColor}30, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ 
              width: 0, 
              height: 0, 
              opacity: 0.4 
            }}
            animate={{ 
              width: 300, 
              height: 300, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut" 
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
