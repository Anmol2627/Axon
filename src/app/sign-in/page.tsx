'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitError('');
    const result = await signIn(form.email, form.password);
    if (result.success) {
      router.push('/app');
    } else {
      setSubmitError(result.error ?? 'Sign in failed');
    }
    setLoading(false);
  };

  // Demo quick sign-in
  const handleDemo = async () => {
    setLoading(true);
    await signIn('aarav@example.com', 'demo');
    router.push('/app');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', background: 'var(--color-bg-base)' }}>
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, animation: 'fadeInScale 300ms ease' }}>
        {/* Logo */}
        <Link href="/landing" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4L4 32h8l8-14 8 14h8L20 4z" fill="var(--color-organic-deep-moss)" />
            <path d="M14 26h12l-6-10-6 10z" fill="var(--color-action-terracotta)" />
          </svg>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>Axon</span>
        </Link>

        {/* Card */}
        <div style={{ background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-xl)', padding: '40px 32px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-elevated)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6, letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Welcome back</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 28, textAlign: 'center' }}>Sign in to continue building your team.</p>

          {/* Demo CTA */}
          <button
            onClick={handleDemo}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-oat)',
              border: '1px solid var(--border-strong)',
              color: 'var(--color-organic-deep-moss)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 24,
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-surface)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-oat)'; }}
          >
            ✦ Try Demo — Sign in as Aarav Shah
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>OR SIGN IN</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Email" id="email" type="email" value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))} error={errors.email} placeholder="you@example.com" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label htmlFor="password" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Password</label>
                <a href="#" style={{ fontSize: '0.75rem', color: 'var(--color-action-terracotta)', fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >Forgot password?</a>
              </div>
              <FormField label="" id="password" type="password" value={form.password}
                onChange={v => setForm(f => ({ ...f, password: v }))} error={errors.password} placeholder="Your password" />
            </div>

            {submitError && (
              <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(217,122,98,0.1)', border: '1px solid rgba(217,122,98,0.3)', color: 'var(--color-semantic-critical)', fontSize: '0.8125rem' }}>
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: loading ? 'var(--color-organic-moss)' : 'var(--color-action-terracotta)',
                color: '#fff',
                fontSize: '0.9375rem',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 150ms',
                boxShadow: 'var(--shadow-subtle)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-subtle)'; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }} />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" style={{ color: 'var(--color-organic-deep-moss)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, id, type, value, onChange, error, placeholder }: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; error?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <div>
      {label && <label htmlFor={id} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>{label}</label>}
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-base)',
          border: `1px solid ${hasError ? 'var(--color-semantic-critical)' : focused ? 'var(--color-organic-moss)' : 'var(--border-subtle)'}`,
          color: 'var(--color-text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 150ms', boxSizing: 'border-box',
        }}
      />
      {error && <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-semantic-critical)' }}>{error}</p>}
    </div>
  );
}
