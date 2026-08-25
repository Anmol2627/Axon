'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader, SkeletonCard } from '@/components/ui/index';
import { CandidateCard } from '@/components/cards/Cards';
import { useApp } from '@/context/AppContext';
import type { Project, ProjectAnalysis, User, Profile, CandidateMatch } from '@/lib/models';

export default function ProjectAnalysisPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [candidates, setCandidates] = useState<{ user: User; profile: Profile; match: CandidateMatch }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { dataService } = await import('@/lib/dataService');
      const proj = await dataService.getProject(projectId);
      const anl = await dataService.getAnalysis(projectId);
      
      if (!proj || !anl) {
        router.push('/app/projects/new');
        return;
      }
      
      setProject(proj);
      setAnalysis(anl);

      // Fetch potential teammates
      const allUsers = (await dataService.getAllUsers()).filter(u => u.id !== proj.ownerId);
      const allProfiles = await dataService.getAllProfiles();
      
      // Get AI Semantic Matches
      try {
        const res = await fetch('/api/ai/match/semantic-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: proj.id,
            userIds: allUsers.map(u => u.id)
          })
        });
        
        let matchResults = [];
        if (res.ok) {
          const data = await res.json();
          matchResults = data.matches; // { userId, semanticScore, insights }
        } else {
          // Fallback if backend is down
          matchResults = allUsers.map(u => ({
            userId: u.id,
            semanticScore: 60 + Math.floor(Math.random() * 30),
            insights: ["Backend offline, fallback score."]
          }));
        }

        const candidateData = allUsers.map(user => {
          const profile = allProfiles.find(p => p.userId === user.id);
          if (!profile) return null;
          
          const aiMatch = matchResults.find((m: any) => m.userId === user.id);
          const score = aiMatch?.semanticScore ?? 50;
          const reasons = (aiMatch?.insights || ["Good technical fit"]).map((r: string) => ({
            label: "AI Insight",
            detail: r
          }));

          return {
            user,
            profile,
            match: {
              projectId: proj.id,
              userId: user.id,
              score,
              reasons,
            } as CandidateMatch,
          };
        }).filter(Boolean) as { user: User; profile: Profile; match: CandidateMatch }[];

        // Sort by AI score
        candidateData.sort((a, b) => b.match.score - a.match.score);
        setCandidates(candidateData);
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [projectId, router]);

  if (!project || !analysis) return null;

  return (
    <AppShell title={project.title} subtitle="AI Project Analysis & Team Building">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 40 }}>
          
          {/* Analysis Summary */}
          <GlassCard tier="primary" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)', marginBottom: 8 }}>
                  {project.title}
                </h1>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-oat)', border: '1px solid var(--border-subtle)', color: 'var(--color-organic-deep-moss)' }}>
                    Complexity: {analysis.complexity}
                  </span>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-oat)', border: '1px solid var(--border-subtle)', color: 'var(--color-action-terracotta)' }}>
                    Team Size: {analysis.recommendedTeamSize}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/app')}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-action-terracotta)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                Save Project
              </button>
            </div>
            
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {analysis.insights.length > 0 ? analysis.insights.map((insight, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-oat)', fontSize: '0.875rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: 'var(--color-organic-moss)', marginTop: 2 }}>✦</span> {insight}
                </div>
              )) : (
                <div style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  No insights generated yet.
                </div>
              )}
            </div>

            {analysis.recommendedWorkflow && analysis.recommendedWorkflow.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Workflow</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {analysis.recommendedWorkflow.map((step, idx) => (
                    <div key={idx} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', gap: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-bg-oat)', color: 'var(--color-organic-moss)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{step.phase}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {/* Requirements Sidebar */}
          <GlassCard tier="secondary" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {analysis.requiredSkills && analysis.requiredSkills.length > 0 ? (
                analysis.requiredSkills.map((req: any) => (
                  <div key={req.skillName || req.name} style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: req.tier === 'Critical' ? 'rgba(217,122,98,0.1)' : 'var(--color-bg-oat)', border: `1px solid ${req.tier === 'Critical' ? 'rgba(217,122,98,0.4)' : 'var(--border-subtle)'}`, fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                    {req.skillName || req.name}
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  No skills identified yet. <br/>
                  <span style={{ fontSize: '0.8rem' }}>Add project details to let Axon identify the skills needed.</span>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Roles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {analysis.recommendedRoles && analysis.recommendedRoles.length > 0 ? (
                analysis.recommendedRoles.map(role => (
                  <div key={role.roleTitle} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: 4 }}>{role.roleTitle}</div>
                    {role.responsibilities && role.responsibilities[0] && (
                       <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{role.responsibilities[0]}</div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  No roles identified yet.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* AI Candidates */}
        <div>
          <SectionHeader title="Top AI Matches" description="Candidates semantically matched to your project requirements." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
            {loading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              candidates.map(c => (
                <CandidateCard 
                  key={c.user.id} 
                  user={c.user} 
                  profile={c.profile} 
                  match={c.match}
                  onAdd={() => alert(`Invited ${c.user.name} to project!`)}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
