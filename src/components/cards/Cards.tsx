'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SkillBadge, MatchScore } from '../ui/Skills';
import type { Project, User, Profile, CandidateMatch, Team, TeamMember } from '@/lib/models';

// ── Shared Card Wrapper ────────────────────────────────────────

interface BaseCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  interactive?: boolean;
}

function BaseCard({ children, onClick, interactive = true }: BaseCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        cursor: interactive && onClick ? 'pointer' : 'default',
        transition: 'all 200ms ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (interactive && onClick) {
          e.currentTarget.style.boxShadow = 'var(--shadow-elevated)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
        }
      }}
      onMouseLeave={e => {
        if (interactive && onClick) {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }
      }}
    >
      {children}
    </div>
  );
}

// ── ProjectCard ───────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  matchScore?: number;
  currentUserRole?: string;
  compact?: boolean;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  draft: { bg: 'var(--color-bg-oat)', text: 'var(--color-text-muted)', border: 'var(--border-subtle)' },
  analyzed: { bg: 'var(--color-semantic-warning-bg)', text: 'var(--color-semantic-warning)', border: 'rgba(214, 181, 109, 0.3)' },
  building: { bg: 'var(--color-semantic-success-bg)', text: 'var(--color-semantic-success)', border: 'rgba(127, 167, 124, 0.3)' },
  complete: { bg: 'var(--color-organic-sage)', text: '#FFFFFF', border: 'var(--color-organic-deep-moss)' },
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  analyzed: 'Analyzed',
  building: 'Building',
  complete: 'Complete',
};

export function ProjectCard({ project, matchScore, currentUserRole, compact = false }: ProjectCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/app/projects/${project.id}/analysis`);
  };

  return (
    <BaseCard onClick={handleClick}>
      <div style={{ padding: '24px' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          {/* Category Pill */}
          <div style={{ 
            background: 'var(--color-bg-base)', 
            padding: '4px 10px', 
            borderRadius: '100px', 
            fontSize: '0.65rem', 
            fontWeight: 700, 
            color: 'var(--color-organic-moss)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {project.category}
          </div>
          
          {/* Match Pill */}
          {matchScore && (
            <div style={{ 
              background: 'rgba(168, 184, 165, 0.2)', // Soft sage tint
              padding: '6px 12px', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-organic-deep-moss)', lineHeight: 1 }}>{matchScore}%</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-organic-moss)', textTransform: 'uppercase' }}>Match</span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8, fontFamily: 'var(--font-serif)', lineHeight: 1.3 }}>
          {project.title}
        </h3>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
          {project.description}
        </p>

        {/* Meta Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '1rem' }}>👥</span> {project.teamSize} members
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            <span style={{ fontSize: '1rem' }}>🕒</span> {project.requiredAvailabilityHours}h/week
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

        {/* AI Insight */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            Why Axon Recommends This
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Strong alignment with your profile. You can contribute significantly to the core objectives.
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {(project.manualSkills ?? []).slice(0, 4).map(skill => (
            <div key={skill.name} style={{ 
              padding: '4px 10px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-subtle)', 
              fontSize: '0.75rem', 
              color: 'var(--color-text-secondary)',
              background: 'var(--color-bg-surface)' 
            }}>
              {skill.name}
            </div>
          ))}
          {(project.manualSkills?.length ?? 0) > 4 && (
            <div style={{ 
              padding: '4px 10px', 
              fontSize: '0.75rem', 
              color: 'var(--color-text-muted)'
            }}>
              +{project.manualSkills!.length - 4}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div style={{ 
          background: 'var(--color-bg-oat)', 
          padding: '12px', 
          borderRadius: 'var(--radius-sm)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: 'var(--color-text-primary)',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'background 150ms'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(246, 241, 232, 0.8)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-oat)'}>
          View Project Details <span style={{ marginLeft: 8, color: 'var(--color-organic-moss)' }}>›</span>
        </div>

      </div>
    </BaseCard>
  );
}

// ── CandidateCard ─────────────────────────────────────────────

interface CandidateCardProps {
  user: User;
  profile: Profile;
  match?: CandidateMatch;
  onAdd?: () => void;
  compact?: boolean;
  projectId?: string;
}

export function CandidateCard({
  user,
  profile,
  match,
  onAdd,
  compact = false,
}: CandidateCardProps) {
  const router = useRouter();
  const topSkills = profile.skills.slice(0, 4);
  const expLevel = profile.experienceLevel;

  return (
    <BaseCard onClick={() => router.push(`/app/discover/${user.id}`)}>
      <div style={{ padding: '24px', display: 'flex', gap: 24, alignItems: 'center' }}>
        
        {/* Left Side: Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {user.name}
            </h4>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              {profile.preferredRoles[0] ?? 'Developer'}
            </div>
            
            {match && (
              <div style={{ 
                background: 'rgba(168, 184, 165, 0.2)', // Soft sage 
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'var(--color-organic-deep-moss)',
                marginLeft: 'auto'
              }}>
                {match.score}% Match
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
            {match && match.reasons[0] ? match.reasons[0].detail : "Strong technical foundation and relevant domain experience."}
          </div>

          {/* Skills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {topSkills.map(s => (
              <div key={s.name} style={{ 
                padding: '2px 10px', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border-subtle)', 
                fontSize: '0.75rem', 
                color: 'var(--color-text-secondary)',
                background: 'var(--color-bg-surface)' 
              }}>
                {s.name}
              </div>
            ))}
            {profile.skills.length > 4 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                +{profile.skills.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        {onAdd && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, width: 120 }}>
            <button
              onClick={e => { e.stopPropagation(); router.push(`/app/discover/${user.id}`); }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--color-text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              View Profile
            </button>
            <button
              onClick={e => { e.stopPropagation(); onAdd(); }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-action-terracotta)',
                border: '1px solid var(--color-action-terracotta)',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Invite
            </button>
          </div>
        )}
      </div>
    </BaseCard>
  );
}

// ── TeamMemberCard ────────────────────────────────────────────

interface TeamMemberCardProps {
  user: User;
  profile: Profile;
  member: TeamMember;
  onRemove?: () => void;
  isOpen?: boolean;
  openRole?: string;
}

export function TeamMemberCard({ user, profile, member, onRemove, isOpen, openRole }: TeamMemberCardProps) {
  const [confirming, setConfirming] = React.useState(false);

  if (isOpen) {
    return (
      <div
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px dashed var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          minHeight: 120,
          background: 'var(--color-bg-base)',
        }}
      >
        <div style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>+</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-organic-deep-moss)', fontWeight: 600, textAlign: 'center' }}>
          Open: {openRole ?? 'Team Member'}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-subtle)',
        position: 'relative',
        animation: 'fadeIn 300ms ease',
      }}
    >
      {/* Remove button */}
      {onRemove && (
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          {confirming ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => { onRemove(); setConfirming(false); }}
                style={{ fontSize: '0.75rem', color: 'var(--color-semantic-critical)', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'transparent', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1rem', fontWeight: 300 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-semantic-critical)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Info (No Avatar) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>{user.name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-organic-moss)', fontWeight: 600 }}>{member.role}</div>
      </div>

      {/* Top skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
        {profile.skills.slice(0, 3).map(s => (
          <SkillBadge key={s.name} name={s.name} />
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {profile.availability.hoursPerWeek}h/week
        </span>
        <MatchScore score={member.roleMatchScore} size="sm" showLabel={false} />
      </div>
    </div>
  );
}
