'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const router = useRouter();
  const { currentUser } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const notifications = [
    { id: 1, text: 'Priya Sharma matched your project (97%)', time: '2m ago', unread: true },
    { id: 2, text: 'Team gap detected in EcoTrack project', time: '1h ago', unread: true },
    { id: 3, text: 'Marcus Chen accepted your invitation', time: '3h ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header
        style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end', // Only content is on the right
          padding: '0 40px',
          background: scrolled ? 'var(--color-bg-base)' : 'transparent',
          transition: 'background 200ms',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          gap: 16,
        }}
      >
        {/* Right: Search Input */}
        <div
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 150ms',
            width: 320,
            boxShadow: 'var(--shadow-subtle)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <span style={{ fontSize: '1rem' }}>⌕</span>
          <span style={{ flex: 1, userSelect: 'none' }}>Search projects, people, skills...</span>
        </div>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setSearchOpen(false); }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 150ms',
              position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-semantic-critical)',
                  border: '1.5px solid var(--color-bg-base)',
                }}
              />
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 320,
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                zIndex: 100,
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-elevated)',
                animation: 'fadeInScale 150ms ease',
              }}
            >
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Notifications</span>
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: n.unread ? 'var(--color-bg-base)' : 'transparent',
                      transition: 'background 120ms',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-oat)')}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? 'var(--color-bg-base)' : 'transparent')}
                  >
                    {n.unread && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-action-terracotta)', marginTop: 6, flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User initials */}
        <div
          onClick={() => router.push('/app/profile')}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            cursor: 'pointer',
            background: 'var(--color-bg-oat)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: 'var(--color-organic-deep-moss)',
            fontSize: '0.9rem',
            border: '1px solid var(--border-subtle)',
            transition: 'border-color 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) ?? 'AS'}
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh',
            background: 'rgba(250, 248, 243, 0.8)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 150ms ease',
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              width: 600,
              maxWidth: '90vw',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-elevated)',
              overflow: 'hidden',
              animation: 'fadeInScale 200ms ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>⌕</span>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects, people, or skills…"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '1.1rem',
                  fontFamily: 'inherit',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ESC</span>
            </div>

            {/* Quick links */}
            <div style={{ padding: '16px' }}>
              <div style={{ padding: '4px 12px 12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
                Quick Links
              </div>
              {[
                { label: 'Create new project', href: '/app/projects/new', icon: '◈' },
                { label: 'Discover candidates', href: '/app/discover', icon: '◎' },
                { label: 'My Team', href: '/app/team', icon: '◉' },
                { label: 'AI Insights', href: '/app/insights', icon: '✦' },
              ].map(item => (
                <button
                  key={item.href}
                  onClick={() => { router.push(item.href); setSearchOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 120ms',
                    fontWeight: 500,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-base)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: 'var(--color-organic-moss)', fontSize: '1.1rem', width: 24, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
