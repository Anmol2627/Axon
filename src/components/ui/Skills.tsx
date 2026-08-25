'use client';

import React from 'react';
import type { Proficiency } from '@/lib/models';

// ── SkillPill ─────────────────────────────────────────────────
// Used in onboarding, profile editing, discovery. Interactive
// variant has selectable state + removable affordance.

interface SkillPillProps {
  name: string;
  proficiency?: Proficiency;
  onRemove?: () => void;
  onProficiencyChange?: (p: Proficiency) => void;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const proficiencyColors: Record<Proficiency, string> = {
  Beginner: '#64748B',
  Intermediate: '#06B6D4',
  Advanced: '#10B981',
};

export function SkillPill({
  name,
  proficiency,
  onRemove,
  onProficiencyChange,
  selected,
  onClick,
  size = 'md',
}: SkillPillProps) {
  const proficiencies: Proficiency[] = ['Beginner', 'Intermediate', 'Advanced'];
  const isInteractive = !!onClick;
  const hasProf = !!proficiency;

  return (
    <span
      className={`skill-pill${selected ? ' selected' : ''}${isInteractive ? ' clickable' : ''}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 4 : 6,
        padding: size === 'sm' ? '3px 10px' : '5px 12px',
        borderRadius: 9999,
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 500,
        background: selected
          ? 'rgba(139,92,246,0.2)'
          : 'rgba(255,255,255,0.06)',
        border: `1px solid ${selected ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.10)'}`,
        color: selected ? '#C4B5FD' : '#CBD5E1',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 150ms ease',
        whiteSpace: 'nowrap',
        animation: 'scale-in 200ms ease forwards',
      }}
    >
      {hasProf && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: proficiencyColors[proficiency!],
            flexShrink: 0,
          }}
        />
      )}
      {name}
      {hasProf && onProficiencyChange && (
        <span style={{ display: 'flex', gap: 2 }}>
          {proficiencies.map(p => (
            <button
              key={p}
              title={p}
              onClick={e => { e.stopPropagation(); onProficiencyChange(p); }}
              style={{
                width: 20,
                height: 14,
                borderRadius: 3,
                border: `1px solid ${proficiency === p ? proficiencyColors[p] : 'rgba(255,255,255,0.15)'}`,
                background: proficiency === p ? `${proficiencyColors[p]}33` : 'transparent',
                cursor: 'pointer',
                fontSize: '0.6rem',
                color: proficiency === p ? proficiencyColors[p] : '#64748B',
                lineHeight: 1,
                padding: 0,
                transition: 'all 120ms',
              }}
            >
              {p[0]}
            </button>
          ))}
        </span>
      )}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            lineHeight: 1,
            transition: 'background 120ms',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
          ×
        </button>
      )}
    </span>
  );
}

// ── SkillBadge ────────────────────────────────────────────────
// Compact static skill tag for dense card contexts

interface SkillBadgeProps {
  name: string;
  tier?: 'Critical' | 'Important' | 'Recommended';
}

const tierBadgeStyles = {
  Critical: {
    background: 'rgba(139,92,246,0.2)',
    border: '1px solid rgba(139,92,246,0.4)',
    color: '#C4B5FD',
  },
  Important: {
    background: 'rgba(6,182,212,0.12)',
    border: '1px solid rgba(6,182,212,0.3)',
    color: '#67E8F9',
  },
  Recommended: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#94A3B8',
  },
};

export function SkillBadge({ name, tier }: SkillBadgeProps) {
  const tierStyle = tier ? tierBadgeStyles[tier] : tierBadgeStyles.Recommended;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 9999,
        fontSize: '0.7rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        ...tierStyle,
      }}
    >
      {name}
    </span>
  );
}

// ── MatchScore ────────────────────────────────────────────────
// Percentage badge with color-coded tiering

interface MatchScoreProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchScore({ score, showLabel = true, size = 'md' }: MatchScoreProps) {
  const color =
    score >= 90 ? '#10B981' :
    score >= 75 ? '#06B6D4' :
    score >= 60 ? '#8B5CF6' :
    '#94A3B8';

  const bg =
    score >= 90 ? 'rgba(16,185,129,0.15)' :
    score >= 75 ? 'rgba(6,182,212,0.15)' :
    score >= 60 ? 'rgba(139,92,246,0.15)' :
    'rgba(148,163,184,0.10)';

  const borderColor =
    score >= 90 ? 'rgba(16,185,129,0.4)' :
    score >= 75 ? 'rgba(6,182,212,0.4)' :
    score >= 60 ? 'rgba(139,92,246,0.4)' :
    'rgba(148,163,184,0.2)';

  const fontSize = size === 'lg' ? '1rem' : size === 'md' ? '0.875rem' : '0.75rem';
  const padding = size === 'lg' ? '6px 14px' : size === 'md' ? '4px 10px' : '2px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding,
        borderRadius: 9999,
        fontSize,
        fontWeight: 700,
        color,
        background: bg,
        border: `1px solid ${borderColor}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {score}%{showLabel && size !== 'sm' ? ' Match' : ''}
    </span>
  );
}
