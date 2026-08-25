'use client';

import React from 'react';

interface AIInsightCardProps {
  label?: string; // "Axon Suggests"
  title: string;  // Main insight
  detail?: string; // Supporting explanation
  actionText?: string;
  onAction?: () => void;
}

export function AIInsightCard({
  label = 'Axon Suggests',
  title,
  detail,
  actionText,
  onAction,
}: AIInsightCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-bg-oat)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '220px',
      }}
    >
      <div style={{ flex: 1, maxWidth: '60%', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 16,
          }}
        >
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: 24, 
            height: 24, 
            background: 'rgba(217, 122, 98, 0.15)', // Light terracotta tint 
            borderRadius: '50%',
            color: 'var(--color-action-terracotta)',
            fontSize: '14px'
          }}>
            ✦
          </span>
          {label}
        </div>

        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            margin: '0 0 12px 0',
            fontFamily: 'var(--font-serif)', // Elegant serif
          }}
        >
          {title}
        </h3>

        {detail && (
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
              margin: '0 0 24px 0',
              maxWidth: '90%',
            }}
          >
            {detail}
          </p>
        )}

        {actionText && onAction && (
          <button
            onClick={onAction}
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-action-terracotta)',
              color: '#FFFFFF',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 150ms ease',
              border: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Decorative SVG Illustration (Plant) */}
      <div style={{ position: 'absolute', right: 20, bottom: -10, width: 220, height: 180, pointerEvents: 'none', zIndex: 1 }}>
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground Mound */}
          <path d="M 20 140 C 60 120, 140 120, 180 140 C 190 145, 180 160, 100 160 C 20 160, 10 145, 20 140 Z" fill="#E4DAC8" />
          <path d="M 40 145 C 80 130, 120 130, 160 145 C 170 150, 150 160, 100 160 C 50 160, 30 150, 40 145 Z" fill="#D3C5B0" opacity="0.5" />
          
          {/* Stem */}
          <path d="M 100 140 Q 110 90, 105 50" stroke="#71836F" strokeWidth="4" strokeLinecap="round" />
          
          {/* Leaves */}
          <path d="M 107 100 C 120 90, 135 95, 145 85 C 135 105, 115 105, 107 100 Z" fill="#A8B8A5" />
          <path d="M 107 100 C 120 90, 135 95, 145 85 C 135 105, 115 105, 107 100 Z" stroke="#71836F" strokeWidth="1.5" />
          
          <path d="M 103 70 C 125 50, 145 60, 155 45 C 140 75, 115 75, 103 70 Z" fill="#71836F" />
          
          <path d="M 101 110 C 85 95, 65 100, 55 90 C 70 115, 90 115, 101 110 Z" fill="#A8B8A5" />
          <path d="M 101 110 C 85 95, 65 100, 55 90 C 70 115, 90 115, 101 110 Z" stroke="#71836F" strokeWidth="1.5" />
          
          <path d="M 104 55 C 80 40, 60 45, 45 35 C 65 60, 90 60, 104 55 Z" fill="#71836F" />
          
          {/* Top small leaf */}
          <path d="M 105 50 C 115 35, 110 25, 105 20 C 100 25, 95 35, 105 50 Z" fill="#A8B8A5" />
          
          {/* Terracotta floating dot */}
          <circle cx="145" cy="30" r="6" fill="#F1B6A5" />
        </svg>
      </div>
    </div>
  );
}
