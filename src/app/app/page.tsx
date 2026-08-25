'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { AIInsightCard } from '@/components/ui/AIInsightCard';
import { SectionHeader, SkeletonCard, EmptyState } from '@/components/ui/index';
import { ProjectCard, CandidateCard } from '@/components/cards/Cards';
import { useApp } from '@/context/AppContext';
import type { Project, User, Profile, CandidateMatch } from '@/lib/models';

export default function OverviewPage() {
  const router = useRouter();
  const { currentUser, currentProfile } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [candidates, setCandidates] = useState<{ user: User; profile: Profile; match: CandidateMatch }[]>([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const firstName = currentUser?.name?.split(' ')[0] ?? 'there';

  useEffect(() => {
    const load = async () => {
      const { dataService } = await import('@/lib/dataService');
      
      const allProjects = await dataService.getAllProjects();
      const userProjects = currentUser ? allProjects.filter(p => p.ownerId === currentUser.id) : [];
      setProjects(userProjects);

      const allUsers = (await dataService.getAllUsers()).filter(u => u.id !== currentUser?.id).slice(0, 6);
      const allProfiles = await dataService.getAllProfiles();

      const candidateData = allUsers.map(user => {
        const profile = allProfiles.find(p => p.userId === user.id);
        if (!profile) return null;
        // Mock match scores for dashboard
        const score = 70 + Math.floor(Math.random() * 27);
        return {
          user,
          profile,
          match: {
            projectId: 'dashboard',
            userId: user.id,
            score,
            reasons: [{ label: 'Strong match', detail: `Strong compatibility based on complementary skills and domain experience.` }],
          } as CandidateMatch,
        };
      }).filter(Boolean) as { user: User; profile: Profile; match: CandidateMatch }[];

      setCandidates(candidateData.slice(0, 3));
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const activeProjectsCount = projects.filter(p => p.status !== 'draft').length;
  const missingSkills = (currentProfile?.skills.length ?? 0) < 5;

  return (
    <AppShell title="Overview">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Greeting */}
        <div style={{ marginBottom: 48, animation: 'fadeIn 400ms ease' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
            Good {timeOfDay.toLowerCase()}, {firstName}.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
            Let's find the right opportunities for you.
          </p>
        </div>

        {/* Top 3 Cards Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr', gap: 24, marginBottom: 48 }} className="stagger">
          
          {/* 1. Axon Suggests */}
          <AIInsightCard
            title={missingSkills ? "Complete your profile to unlock matches." : "Your strongest opportunity is in AI & Data projects."}
            detail={missingSkills ? "Add your skills to get better recommendations." : "Explore projects where your skills complement the team."}
            actionText={missingSkills ? "Complete Profile" : "Explore Projects"}
            onAction={() => router.push(missingSkills ? '/app/profile' : '/app/discover')}
          />

          {/* 2. Best Match Quality */}
          <div style={{ background: 'var(--color-bg-surface)', padding: '32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Best Match Quality</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--color-organic-moss)', lineHeight: 0.9 }}>
                87<span style={{ fontSize: '2rem' }}>%</span>
              </div>
              
              {/* Minimal Line Chart Graphic */}
              <div style={{ width: 80, height: 40, position: 'relative' }}>
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M 0 45 C 20 45, 30 30, 45 35 C 60 40, 70 15, 85 20 C 95 23, 100 5, 100 5" fill="none" stroke="#A8B8A5" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="5" r="4" fill="#D97A62" />
                </svg>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>Great match potential!</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Keep your profile updated to unlock even better matches.</div>
            </div>
          </div>

          {/* 3. Activity Summary */}
          <div style={{ background: 'var(--color-bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-organic-moss)', fontSize: '1.2rem' }}>
                📁
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>3</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Active Projects</div>
              </div>
            </div>
            
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-organic-moss)', fontSize: '1.2rem' }}>
                ✉
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>2</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Team Invitations</div>
              </div>
            </div>
            
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-organic-moss)', fontSize: '1.2rem' }}>
                📖
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>6</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Skills on Profile</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Two-column lower section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Recommended Projects */}
          <div>
            <SectionHeader
              title="Recommended Projects"
              action={{ label: 'View all', onClick: () => router.push('/app/projects') }}
            />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : projects.length === 0 ? (
              <EmptyState
                icon="◈"
                title="Every great team starts with an idea."
                action={{ label: 'Create Your First Project', onClick: () => router.push('/app/projects/new') }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {projects.slice(0, 3).map(p => (
                  <ProjectCard key={p.id} project={p} matchScore={78 + Math.floor(Math.random() * 20)} />
                ))}
              </div>
            )}
          </div>

          {/* Recommended People */}
          <div>
            <SectionHeader
              title="Recommended People"
              action={{ label: 'Discover all', onClick: () => router.push('/app/discover') }}
            />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1, 2].map(i => <SkeletonCard key={i} hasAvatar />)}
              </div>
            ) : candidates.length === 0 ? (
              <EmptyState
                icon="◎"
                title="No recommendations yet."
                description="Complete your profile to see personalized matches."
                action={{ label: 'Complete Profile', onClick: () => router.push('/app/profile') }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {candidates.slice(0, 3).map(c => (
                  <CandidateCard key={c.user.id} user={c.user} profile={c.profile} match={c.match} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
