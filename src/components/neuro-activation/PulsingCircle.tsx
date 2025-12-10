import { motion } from "framer-motion";

interface PulsingCircleProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PulsingCircle({ 
  size = 200, 
  color = "hsl(var(--primary))",
  className = ""
}: PulsingCircleProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
        }}
      />
      
      {/* Main pulsing circle */}
      <motion.div
        className="absolute inset-[15%] rounded-full border-2"
        style={{
          borderColor: `${color}60`,
          background: `radial-gradient(circle at 30% 30%, ${color}15, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
        }}
      />
      
      {/* Inner core */}
      <motion.div
        className="absolute inset-[35%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}40, ${color}10)`,
          boxShadow: `0 0 40px ${color}30`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: [0.45, 0, 0.55, 1],
        }}
      />
      
      {/* Center dot */}
      <div
        className="absolute inset-[45%] rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 20px ${color}50`,
        }}
      />
    </div>
  );
}
