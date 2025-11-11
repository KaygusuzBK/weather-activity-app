'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedIconProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  pulse?: boolean;
  rotate?: boolean;
  bounce?: boolean;
  scale?: boolean;
}

/**
 * Animasyonlu icon wrapper komponenti
 * Framer Motion ile çeşitli animasyon efektleri sağlar
 */
export default function AnimatedIcon({
  children,
  className = '',
  style,
  hover = true,
  pulse = false,
  rotate = false,
  bounce = false,
  scale = false,
}: AnimatedIconProps) {
  const variants: any = {
    initial: { scale: 1 },
    hover: hover
      ? {
          scale: 1.1,
          transition: { duration: 0.2, ease: 'easeOut' as const },
        }
      : {},
  };

  if (pulse) {
    variants.animate = {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    };
  }

  if (rotate) {
    variants.animate = {
      ...variants.animate,
      rotate: [0, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear' as const,
      },
    };
  }

  if (bounce) {
    variants.animate = {
      ...variants.animate,
      y: [0, -8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    };
  }

  if (scale) {
    variants.animate = {
      ...variants.animate,
      scale: [1, 1.15, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    };
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="initial"
      whileHover="hover"
      animate={pulse || rotate || bounce || scale ? 'animate' : 'initial'}
    >
      {children}
    </motion.div>
  );
}

