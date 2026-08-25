'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedScoreProps {
  value: number;      // 0–100
  suffix?: string;    // e.g. '%'
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'number' | 'radial';
  color?: string;     // override accent color
  duration?: number;  // ms
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: { font: '1.5rem', radial: 56 },
  md: { font: '2rem',   radial: 72 },
  lg: { font: '2.75rem', radial: 96 },
  xl: { font: '3.5rem', radial: 120 },
};

function scoreToColor(value: number): string {
  if (value >= 90) return '#10B981'; // emerald
  if (value >= 75) return '#06B6D4'; // cyan
  if (value >= 60) return '#8B5CF6'; // violet
  return '#94A3B8';                  // muted
}

export function AnimatedScore({
  value,
  suffix = '%',
  size = 'md',
  variant = 'number',
  color,
  duration = 800,
  className = '',
  label,
}: AnimatedScoreProps) {
  const [displayed, setDisplayed] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const accentColor = color ?? scoreToColor(value);

  // Intersection observer — animate on first viewport entry only
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Count-up
  useEffect(() => {
    if (!hasAnimated) return;
    const start = Date.now();
    const startVal = 0;
    const endVal = value;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(startVal + (endVal - startVal) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [hasAnimated, value, duration]);

  const { font, radial } = sizeMap[size];

  if (variant === 'radial') {
    const radius = (radial - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - (hasAnimated ? value : 0) / 100);

    return (
      <div ref={ref} className={`animated-score-radial ${className}`} style={{ width: radial, height: radial, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={radial} height={radial} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={radial / 2}
            cy={radial / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          {/* Fill */}
          <circle
            cx={radial / 2}
            cy={radial / 2}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.4,0,0.2,1)` }}
          />
        </svg>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: size === 'xl' ? '1.75rem' : size === 'lg' ? '1.4rem' : size === 'md' ? '1.1rem' : '0.85rem', fontWeight: 700, color: accentColor, lineHeight: 1 }}>
            {displayed}{suffix}
          </div>
          {label && (
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              {label}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ fontSize: font, fontWeight: 800, color: accentColor, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
      {displayed}{suffix}
      {label && <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</div>}
    </div>
  );
}
