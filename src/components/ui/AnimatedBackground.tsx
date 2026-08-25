'use client';

import React, { useEffect, useRef } from 'react';

// ============================================================
// AnimatedBackground — slow-moving blurred gradient blobs
// GPU-friendly: only uses transform + opacity
// Must never distract from foreground content
// ============================================================

interface AnimatedBackgroundProps {
  variant?: 'default' | 'auth' | 'landing';
  className?: string;
}

export function AnimatedBackground({
  variant = 'default',
  className = '',
}: AnimatedBackgroundProps) {
  const blobs =
    variant === 'auth'
      ? [
          { color: '#7C3AED', x: '15%', y: '20%', size: 400, duration: 18, delay: 0 },
          { color: '#2563EB', x: '70%', y: '60%', size: 350, duration: 22, delay: 3 },
          { color: '#06B6D4', x: '50%', y: '80%', size: 300, duration: 16, delay: 6 },
        ]
      : variant === 'landing'
      ? [
          { color: '#7C3AED', x: '10%', y: '15%', size: 600, duration: 20, delay: 0 },
          { color: '#2563EB', x: '80%', y: '20%', size: 500, duration: 25, delay: 4 },
          { color: '#06B6D4', x: '60%', y: '70%', size: 450, duration: 18, delay: 8 },
          { color: '#059669', x: '20%', y: '75%', size: 380, duration: 23, delay: 2 },
        ]
      : [
          { color: '#7C3AED', x: '-5%', y: '10%', size: 500, duration: 22, delay: 0 },
          { color: '#2563EB', x: '85%', y: '5%', size: 400, duration: 28, delay: 5 },
          { color: '#059669', x: '70%', y: '80%', size: 350, duration: 20, delay: 10 },
        ];

  return (
    <div
      className={`animated-background ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: blob.color,
            opacity: 0.06,
            filter: `blur(${blob.size * 0.45}px)`,
            animation: `blob-drift${i % 2 === 1 ? '-2' : ''} ${blob.duration}s ease-in-out infinite`,
            animationDelay: `${blob.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
