import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowHaloProps {
  children: ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}

export function GlowHalo({ 
  children, 
  color = "hsl(var(--primary))",
  intensity = 0.25,
  className = ""
}: GlowHaloProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated glow layer */}
      <motion.div
        className="absolute inset-0 rounded-inherit blur-xl -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        }}
        animate={{
          opacity: [intensity * 0.8, intensity * 1.4, intensity * 0.8],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {children}
    </div>
  );
}
