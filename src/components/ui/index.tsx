'use client';

import React from 'react';

// ── EmptyState ─────────────────────────────────────────────── 

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ icon = '🌌', title, description, action, size = 'md' }: EmptyStateProps) {
  const padding = size === 'lg' ? '80px 32px' : size === 'md' ? '56px 24px' : '32px 16px';
  const iconSize = size === 'lg' ? '3rem' : size === 'md' ? '2.5rem' : '2rem';
  const titleSize = size === 'lg' ? '1.25rem' : size === 'md' ? '1.0625rem' : '0.9375rem';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding,
      animation: 'fadeIn 300ms ease',
    }}>
      <div style={{ fontSize: iconSize, marginBottom: 16, opacity: 0.6 }}>{icon}</div>
      <div style={{ fontSize: titleSize, fontWeight: 600, color: '#CBD5E1', marginBottom: 8, maxWidth: 280 }}>
        {title}
      </div>
      {description && (
        <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: 20, maxWidth: 320, lineHeight: 1.6 }}>
          {description}
        </div>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: '#C4B5FD',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.25)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ── SkeletonCard ───────────────────────────────────────────── 

interface SkeletonCardProps {
  lines?: number;
  hasAvatar?: boolean;
  style?: React.CSSProperties;
}

export function SkeletonCard({ lines = 3, hasAvatar = false, style }: SkeletonCardProps) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        {hasAvatar && (
          <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 11, width: '40%' }} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 11, width: `${85 - i * 12}%`, marginBottom: 8 }}
        />
      ))}
    </div>
  );
}

// ── SectionHeader ──────────────────────────────────────────── 

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 20,
    }}>
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F1F5F9', margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: 2, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#8B5CF6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            transition: 'color 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#A78BFA')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8B5CF6')}
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────── 

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const btnStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'rgba(255,255,255,0.06)',
    color: '#E2E8F0',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  ghost: {
    background: 'transparent',
    color: '#94A3B8',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  danger: {
    background: 'rgba(220,38,38,0.15)',
    color: '#FCA5A5',
    border: '1px solid rgba(220,38,38,0.3)',
  },
};

const btnSizes: Record<string, React.CSSProperties> = {
  sm: { padding: '7px 14px', fontSize: '0.8125rem', borderRadius: 8 },
  md: { padding: '10px 20px', fontSize: '0.875rem', borderRadius: 10 },
  lg: { padding: '13px 28px', fontSize: '1rem', borderRadius: 12 },
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  type = 'button',
  fullWidth,
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        ...btnStyles[variant],
        ...btnSizes[size],
        ...style,
      }}
      onMouseEnter={e => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.opacity = '0.92';
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.opacity = disabled ? '0.5' : '1';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseDown={e => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin-slow 0.7s linear infinite',
              display: 'inline-block',
            }}
          />
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
}
