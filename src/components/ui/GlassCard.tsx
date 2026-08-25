'use client';

import React from 'react';

type GlassTier = 'primary' | 'secondary' | 'floating';

interface GlassCardProps {
  children: React.ReactNode;
  tier?: GlassTier;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

const tierStyles: Record<GlassTier, React.CSSProperties> = {
  primary: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  floating: {
    background: 'rgba(12,14,22,0.85)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.3)',
  },
};

export function GlassCard({
  children,
  tier = 'primary',
  className = '',
  onClick,
  hoverable = false,
  style,
}: GlassCardProps) {
  const isInteractive = !!onClick || hoverable;

  return (
    <div
      className={`glass-card glass-card--${tier} ${isInteractive ? 'glass-card--hoverable' : ''} ${className}`}
      style={{ ...tierStyles[tier], borderRadius: 16, ...style }}
      onClick={onClick}
    >
      {children}
      <style jsx>{`
        .glass-card {
          position: relative;
          overflow: hidden;
          transition: transform 220ms cubic-bezier(0.4,0,0.2,1),
                      box-shadow 220ms cubic-bezier(0.4,0,0.2,1),
                      border-color 220ms cubic-bezier(0.4,0,0.2,1);
        }
        .glass-card--hoverable {
          cursor: pointer;
        }
        .glass-card--hoverable:hover {
          transform: translateY(-3px);
          border-color: rgba(139,92,246,0.3) !important;
        }
        .glass-card--hoverable:hover.glass-card--primary {
          box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(124,58,237,0.15) !important;
        }
        .glass-card--hoverable:hover.glass-card--secondary {
          box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(124,58,237,0.1) !important;
        }
        .glass-card--hoverable:active {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
