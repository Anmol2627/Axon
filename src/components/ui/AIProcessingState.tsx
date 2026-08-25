'use client';

import React, { useEffect, useRef, useState } from 'react';

// ============================================================
// AIProcessingState — The signature AI orb + checklist overlay
// Section 7.7: The single most important animated moment in Axon
// ============================================================

export type ProcessingStage = {
  label: string;
  status: 'pending' | 'active' | 'done';
};

type ProcessingVariant = 'analyze' | 'team-build';

const ANALYZE_STAGES: string[] = [
  'Understanding project goal',
  'Analyzing technical requirements',
  'Identifying required skills',
  'Designing team composition',
  'Finding potential expertise gaps',
];

const TEAM_BUILD_STAGES = (candidateCount: number): string[] => [
  `Analyzing ${candidateCount} candidates…`,
  'Matching complementary skills…',
  'Checking availability…',
  'Optimizing team composition…',
];

interface AIProcessingStateProps {
  variant: ProcessingVariant;
  onComplete?: () => void;
  candidateCount?: number;
  title?: string;
}

const STAGE_DURATION = 600; // ms per stage

export function AIProcessingState({
  variant,
  onComplete,
  candidateCount = 120,
  title,
}: AIProcessingStateProps) {
  const stages =
    variant === 'analyze'
      ? ANALYZE_STAGES
      : TEAM_BUILD_STAGES(candidateCount);

  const [stageStatuses, setStageStatuses] = useState<ProcessingStage['status'][]>(
    stages.map(() => 'pending')
  );
  const [currentStage, setCurrentStage] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let stageIdx = 0;

    const advance = () => {
      if (stageIdx >= stages.length) {
        // Done — small pause then complete
        timerRef.current = setTimeout(() => {
          onComplete?.();
        }, 400);
        return;
      }

      setCurrentStage(stageIdx);
      setStageStatuses(prev => {
        const next = [...prev];
        if (stageIdx > 0) next[stageIdx - 1] = 'done';
        next[stageIdx] = 'active';
        return next;
      });

      timerRef.current = setTimeout(() => {
        stageIdx++;
        advance();
      }, STAGE_DURATION + Math.random() * 200);
    };

    // Small initial delay
    timerRef.current = setTimeout(advance, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        minHeight: 320,
        animation: 'fadeIn 300ms ease',
      }}
    >
      {/* Orb */}
      <div style={{ position: 'relative', marginBottom: 40, width: 96, height: 96 }}>
        {/* Pulsing rings */}
        {[1, 2, 3].map(ring => (
          <div
            key={ring}
            style={{
              position: 'absolute',
              inset: -(ring * 14),
              borderRadius: '50%',
              border: `1px solid rgba(217,122,98,${0.4 - ring * 0.1})`, // Terracotta
              animation: `pulse-ring ${2 + ring * 0.5}s ease-in-out infinite`,
              animationDelay: `${ring * 0.4}s`,
            }}
          />
        ))}

        {/* Orbiting particle */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'spin-slow 3s linear infinite',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-action-terracotta)',
              transform: 'translate(-50%, -50%) translateX(-52px)',
              boxShadow: '0 0 8px rgba(217,122,98,0.8)',
            }}
          />
        </div>

        {/* Slower reverse orbit */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'spin-slow 5s linear infinite reverse',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--color-organic-moss)',
              transform: 'translate(-50%, -50%) translateX(52px)',
              boxShadow: '0 0 6px rgba(113,131,111,0.8)',
            }}
          />
        </div>

        {/* Core orb */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #F1B6A5, var(--color-action-terracotta) 50%, var(--color-organic-deep-moss))',
            boxShadow: '0 0 40px rgba(217,122,98,0.5), 0 0 80px rgba(217,122,98,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            animation: 'glow-pulse 2s ease-in-out infinite',
            color: '#fff'
          }}
        >
          ✦
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4, fontFamily: 'var(--font-serif)' }}>
          {title ?? (variant === 'analyze' ? 'Analyzing Your Project' : 'Building Optimal Team')}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          {variant === 'analyze'
            ? 'AI is understanding your requirements…'
            : 'AI is finding the perfect combination…'}
        </div>
      </div>

      {/* Stage checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
        {stages.map((label, i) => {
          const status = stageStatuses[i] ?? 'pending';
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: status === 'pending' ? 0.35 : 1,
                transition: 'opacity 300ms ease',
                animation: status === 'active' ? 'fadeIn 200ms ease' : undefined,
              }}
            >
              {/* Status indicator */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  transition: 'all 300ms ease',
                  ...(status === 'done'
                    ? {
                        background: 'rgba(63,81,68,0.1)',
                        border: '1px solid var(--color-organic-moss)',
                        color: 'var(--color-organic-deep-moss)',
                      }
                    : status === 'active'
                    ? {
                        background: 'rgba(217,122,98,0.15)',
                        border: '1px solid var(--color-action-terracotta)',
                        color: 'var(--color-action-terracotta)',
                        boxShadow: '0 0 8px rgba(217,122,98,0.3)',
                        animation: 'glow-pulse 1.5s ease-in-out infinite',
                      }
                    : {
                        border: '1px solid var(--border-strong)',
                        color: 'var(--color-text-muted)',
                      }),
                }}
              >
                {status === 'done' ? '✓' : status === 'active' ? '●' : '○'}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.875rem',
                  color:
                    status === 'done'
                      ? 'var(--color-text-secondary)'
                      : status === 'active'
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-muted)',
                  fontWeight: status === 'active' ? 500 : 400,
                  transition: 'color 300ms ease',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
