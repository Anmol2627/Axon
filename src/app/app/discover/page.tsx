'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader, SkeletonCard } from '@/components/ui/index';
import { CandidateCard } from '@/components/cards/Cards';
import { useApp } from '@/context/AppContext';
import type { User, Profile, CandidateMatch } from '@/lib/models';

export default function DiscoverPage() {
  const { currentUser } = useApp();
  const [candidates, setCandidates] = useState<{ user: User; profile: Profile; match: CandidateMatch }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { dataService } = await import('@/lib/dataService');
      const allUsers = (await dataService.getAllUsers()).filter(u => u.id !== currentUser?.id);
      const allProfiles = await dataService.getAllProfiles();

      const candidateData = allUsers.map(user => {
        const profile = allProfiles.find(p => p.userId === user.id);
        if (!profile) return null;
        
        const score = 65 + Math.floor(Math.random() * 32);
        return {
          user,
          profile,
          match: {
            projectId: 'discover',
            userId: user.id,
            score,
            reasons: [{ label: 'Fit', detail: 'This candidate has technical skills that complement your profile.' }],
          } as CandidateMatch,
        };
      }).filter(Boolean) as { user: User; profile: Profile; match: CandidateMatch }[];

      // Sort by score
      candidateData.sort((a, b) => b.match.score - a.match.score);
      setCandidates(candidateData);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  return (
    <AppShell title="Discover" subtitle="Find the right people for your next project.">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Discover
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
            Find talented students, researchers, and developers.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Search by role, skill, or interest..."
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: 'var(--shadow-subtle)',
            }}
          />
          <button
            style={{
              padding: '0 24px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-organic-moss)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Filter
          </button>
        </div>

        {/* Candidates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            candidates.map(c => (
              <CandidateCard 
                key={c.user.id} 
                user={c.user} 
                profile={c.profile} 
                match={c.match}
                onAdd={() => alert(`Invite ${c.user.name}?`)}
              />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
