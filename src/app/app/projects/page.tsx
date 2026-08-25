'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/index';
import { ProjectCard } from '@/components/cards/Cards';
import type { Project } from '@/lib/models';

const CATEGORIES = ['All', 'AI/ML', 'Web App', 'Mobile App', 'Data Science', 'FinTech', 'Other'];
const STATUSES = ['All', 'Draft', 'Analyzed', 'Building', 'Complete'];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      const { dataService } = await import('@/lib/dataService');
      setProjects(await dataService.getAllProjects());
      setLoading(false);
    };
    load();
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase();
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <AppShell title="Projects" subtitle="Manage your projects and build optimal teams.">
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '1rem' }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…"
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#F1F5F9',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 9999,
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: catFilter === cat ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                border: catFilter === cat ? '1px solid rgba(139,92,246,0.45)' : '1px solid rgba(255,255,255,0.09)',
                color: catFilter === cat ? '#C4B5FD' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <Button onClick={() => router.push('/app/projects/new')}>
            ◈ New Project
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: 16 }}>
        {loading ? 'Loading…' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`}
      </div>

      {/* Grid */}
      {!loading && filtered.length === 0 ? (
        <GlassCard tier="secondary" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12, opacity: 0.4 }}>◈</div>
          <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#CBD5E1', marginBottom: 8 }}>
            {search ? 'No projects match your search.' : 'No projects yet.'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: 20 }}>
            {search ? 'Try a different search term.' : 'Create your first project and let AI find your team.'}
          </div>
          {!search && (
            <Button onClick={() => router.push('/app/projects/new')}>Create First Project</Button>
          )}
        </GlassCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {(loading ? Array(4).fill(null) : filtered).map((p, i) => (
            loading ? (
              <div key={i} style={{ height: 180, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', animation: 'shimmer 1.8s infinite', backgroundSize: '200%' }} className="skeleton" />
            ) : (
              <ProjectCard key={p.id} project={p} />
            )
          ))}
          {/* "+ New Project" card */}
          {!loading && (
            <GlassCard tier="secondary" hoverable onClick={() => router.push('/app/projects/new')}
              style={{
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                border: '1.5px dashed rgba(139,92,246,0.3)',
                background: 'rgba(139,92,246,0.04)',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#8B5CF6' }}>+</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#8B5CF6' }}>New Project</div>
              <div style={{ fontSize: '0.8125rem', color: '#475569' }}>Let AI find your perfect team</div>
            </GlassCard>
          )}
        </div>
      )}
    </AppShell>
  );
}
