'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader, EmptyState } from '@/components/ui';

export default function TeamPage() {
  return (
    <AppShell title="My Team">
      <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'fadeIn 300ms ease' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
            My Team
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
            Manage your project collaborators and pending invitations.
          </p>
        </div>

        {/* Active Teams */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Active Collaborators" />
          <EmptyState
            icon="👥"
            title="You don't have any active teammates yet."
            description="Start a project or invite people to collaborate with you."
            action={{ label: 'Discover Candidates', onClick: () => window.location.href = '/app/discover' }}
          />
        </div>

      </div>
    </AppShell>
  );
}
