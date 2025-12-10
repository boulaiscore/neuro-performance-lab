import { motion } from "framer-motion";
import { useMemo } from "react";

interface DriftFieldProps {
  particleCount?: number;
  className?: string;
}

export function DriftField({ particleCount = 30, className = "" }: DriftFieldProps) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));
  }, [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="particleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill="url(#particleGrad)"
            opacity={0.08}
            animate={{
              cx: [`${particle.x}%`, `${(particle.x + 15) % 100}%`, `${particle.x}%`],
              cy: [`${particle.y}%`, `${(particle.y + 10) % 100}%`, `${particle.y}%`],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
        
        {/* Subtle connecting lines */}
        {particles.slice(0, 8).map((particle, i) => {
          const nextParticle = particles[(i + 1) % 8];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${particle.x}%`}
              y1={`${particle.y}%`}
              x2={`${nextParticle.x}%`}
              y2={`${nextParticle.y}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity={0.04}
              animate={{
                opacity: [0.02, 0.06, 0.02],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
