'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/ui';

export default function InsightsPage() {
  return (
    <AppShell title="AI Insights">
      <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 300ms ease' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
            AI Insights
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
            Discover trends in your projects and network.
          </p>
        </div>

        <div style={{ background: 'var(--color-bg-surface)', padding: 40, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <EmptyState
            icon="✦"
            title="Gathering Intelligence"
            description="Our AI is analyzing your projects and team dynamics. Check back soon for actionable insights on skill gaps, market trends, and team compatibility."
          />
        </div>

      </div>
    </AppShell>
  );
}
