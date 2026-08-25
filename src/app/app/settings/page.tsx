'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 300ms ease' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
            Settings
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
            Manage your account preferences and application settings.
          </p>
        </div>

        <div style={{ background: 'var(--color-bg-surface)', padding: 40, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            Settings options will be available soon.
          </div>
        </div>

      </div>
    </AppShell>
  );
}
