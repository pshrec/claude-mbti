import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function Card({ children, className = '', animate = true }: CardProps) {
  const cardStyles = 'bg-white rounded-2xl p-8 border border-neutral-100';

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={`${cardStyles} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${cardStyles} ${className}`}>
      {children}
    </div>
  );
}
