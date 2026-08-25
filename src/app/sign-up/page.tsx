'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setSubmitError('');
    const result = await signUp(form.name, form.email, form.password);
    if (result.success) {
      router.push('/app/profile');
    } else {
      setSubmitError(result.error ?? 'Registration failed');
    }
    setLoading(false);
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6, letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Create your account</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 28, textAlign: 'center' }}>Start building better teams with AI.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <FormField
              label="Full Name"
              id="name"
              type="text"
              value={form.name}
              onChange={v => setForm(f => ({ ...f, name: v }))}
              error={errors.name}
              placeholder="Aarav Shah"
            />
            {/* Email */}
            <FormField
              label="Email"
              id="email"
              type="email"
              value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
              error={errors.email}
              placeholder="you@example.com"
            />
            {/* Password */}
            <FormField
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={v => setForm(f => ({ ...f, password: v }))}
              error={errors.password}
              placeholder="Min. 6 characters"
            />
            {/* Confirm */}
            <FormField
              label="Confirm Password"
              id="confirm"
              type="password"
              value={form.confirm}
              onChange={v => setForm(f => ({ ...f, confirm: v }))}
              error={errors.confirm}
              placeholder="Repeat password"
            />

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
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/sign-in" style={{ color: 'var(--color-organic-deep-moss)', fontWeight: 600, transition: 'color 150ms', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Shared FormField ──────────────────────────────────────────

function FormField({
  label, id, type, value, onChange, error, placeholder,
}: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; error?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-base)',
          border: `1px solid ${hasError ? 'var(--color-semantic-critical)' : focused ? 'var(--color-organic-moss)' : 'var(--border-subtle)'}`,
          color: 'var(--color-text-primary)',
          fontSize: '0.9375rem',
          outline: 'none',
          transition: 'border-color 150ms',
          boxSizing: 'border-box',
        }}
      />
      {error && <p style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--color-semantic-critical)' }}>{error}</p>}
    </div>
  );
}
