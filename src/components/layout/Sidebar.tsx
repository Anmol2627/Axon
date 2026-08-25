'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

// ── Nav items ────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/app', label: 'Overview', icon: <span style={{ fontSize: '1.2rem' }}>⌂</span> },
  { href: '/app/projects', label: 'Projects', icon: <span style={{ fontSize: '1.2rem' }}>📁</span> },
  { href: '/app/discover', label: 'Discover', icon: <span style={{ fontSize: '1.2rem' }}>⌕</span> },
  { href: '/app/team', label: 'My Team', icon: <span style={{ fontSize: '1.2rem' }}>👥</span> },
  { href: '/app/insights', label: 'AI Insights', icon: <span style={{ fontSize: '1.2rem' }}>✦</span> },
  { href: '/app/evaluate', label: 'Evaluate Repo', icon: <span style={{ fontSize: '1.2rem' }}>✦</span> },
  { href: '/app/profile', label: 'Profile', icon: <span style={{ fontSize: '1.2rem' }}>👤</span> },
  { href: '/app/settings', label: 'Settings', icon: <span style={{ fontSize: '1.2rem' }}>⚙</span> },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, sidebarCollapsed, signOut } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  const width = sidebarCollapsed ? 72 : 260;

  return (
    <aside
      style={{
        width,
        minWidth: width,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-organic-deep-moss)',
        transition: 'width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1)',
        zIndex: 40,
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '2px 0 24px rgba(0,0,0,0.05)',
      }}
    >
      {/* Branding Section */}
      <div style={{ padding: '32px 24px 24px' }}>
        <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {/* Abstract 'A' SVG similar to reference image */}
          <div style={{ width: 28, height: 28, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H6.5L12 11L17.5 22H22L12 2Z" fill="#F6F1E8"/>
              <path d="M6.5 22L12 11L17.5 22H13.5L12 19L10.5 22H6.5Z" fill="#D97A62"/>
            </svg>
          </div>
          {!sidebarCollapsed && (
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#F6F1E8', letterSpacing: '0.05em' }}>
              AXON
            </span>
          )}
        </Link>
        
        {!sidebarCollapsed && (
          <div style={{ color: 'var(--color-organic-sage)', fontSize: '0.8125rem', lineHeight: 1.5, opacity: 0.9 }}>
            Find the right people.<br/>
            Build the right projects.
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: active ? 'rgba(246, 241, 232, 0.12)' : 'transparent',
                transition: 'background 150ms',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = 'rgba(246, 241, 232, 0.05)';
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              {active && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--color-action-terracotta)', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
              )}
              
              <div style={{ color: active ? '#F6F1E8' : 'var(--color-organic-sage)', opacity: active ? 1 : 0.8, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </div>
              
              {!sidebarCollapsed && (
                <span style={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500, color: active ? '#F6F1E8' : 'var(--color-organic-sage)', opacity: active ? 1 : 0.9 }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Completion Card */}
      {!sidebarCollapsed && (
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{ background: 'rgba(246, 241, 232, 0.06)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid rgba(246, 241, 232, 0.08)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(168, 184, 165, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <span style={{ color: 'var(--color-organic-sage)', fontSize: '1.2rem' }}>🌿</span>
            </div>
            <h4 style={{ color: '#F6F1E8', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Complete your profile</h4>
            <p style={{ color: 'var(--color-organic-sage)', fontSize: '0.75rem', lineHeight: 1.4, marginBottom: 16 }}>
              Add your skills and interests to get better recommendations.
            </p>
            <button
              onClick={() => router.push('/app/profile')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(246, 241, 232, 0.15)',
                background: 'transparent',
                color: '#F6F1E8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(246, 241, 232, 0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}

      {/* User Initials Row */}
      <div style={{ padding: '16px 20px 24px' }}>
        <div
          onClick={() => setUserMenuOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: sidebarCollapsed ? '8px 0' : '8px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            transition: 'background 150ms',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(246, 241, 232, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#F6F1E8',
              flexShrink: 0,
            }}
          >
            {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) ?? 'AS'}
          </div>
          {!sidebarCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F6F1E8', whiteSpace: 'nowrap' }}>
                {currentUser?.name ?? 'User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-organic-sage)', opacity: 0.9 }}>
                View Profile
              </div>
            </div>
          )}
          {!sidebarCollapsed && (
            <div style={{ color: 'var(--color-organic-sage)', fontSize: '1rem', paddingRight: 4 }}>›</div>
          )}

          {userMenuOpen && !sidebarCollapsed && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                marginBottom: 8,
                borderRadius: 'var(--radius-md)',
                padding: '6px',
                zIndex: 100,
                background: 'var(--color-bg-surface)',
                boxShadow: 'var(--shadow-elevated)',
                border: '1px solid var(--border-subtle)',
                animation: 'fadeInScale 150ms ease',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => { signOut(); router.push('/sign-in'); }}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 6, border: 'none', background: 'transparent', color: 'var(--color-semantic-critical)', fontSize: '0.875rem', cursor: 'pointer', transition: 'background 120ms', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-base)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

