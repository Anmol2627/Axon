'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { InteractiveTeamGraph, GraphNode } from '@/components/ui/InteractiveTeamGraph';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

// ── Landing hero graph nodes ──────────────────────────────────
const HERO_NODES: GraphNode[] = [
  { id: 'project', label: 'Your Project', type: 'project' },
  { id: 'ml', label: 'Priya S.', sublabel: 'ML Engineer', type: 'member', matchScore: 97, skills: ['Python', 'ML', 'Data Analysis'] },
  { id: 'backend', label: 'Marcus C.', sublabel: 'Backend Dev', type: 'member', matchScore: 94, skills: ['Node.js', 'PostgreSQL', 'Docker'] },
  { id: 'design', label: 'Aisha O.', sublabel: 'UI/UX', type: 'member', matchScore: 91, skills: ['Figma', 'UX Research', 'React'] },
  { id: 'data', label: 'Rohan P.', sublabel: 'Data Scientist', type: 'member', matchScore: 95, skills: ['Python', 'NLP', 'Statistics'] },
];

const SKILL_CHIPS = ['ML', 'React', 'UX', 'Python', 'Node.js', 'Data'];

const HOW_IT_WORKS = [
  { step: '01', title: 'Describe your project', desc: 'Write a plain-language description of what you want to build — rough ideas are fine.' },
  { step: '02', title: 'AI understands it', desc: 'Axon analyzes your project and identifies required skills, roles, and potential risks.' },
  { step: '03', title: 'Find the best people', desc: 'AI scores every candidate against your specific needs, not a generic resume filter.' },
  { step: '04', title: 'Build your optimal team', desc: 'Assemble your team with a clear explanation of why each person belongs.' },
];

const AI_FEATURES = [
  { icon: '🧠', title: 'Project Understanding', desc: 'AI reads your project description and understands the technical requirements, not just keywords.' },
  { icon: '🎯', title: 'Smart Matching', desc: 'Multi-factor scoring weighing skills, experience, availability, and team complementarity.' },
  { icon: '⚡', title: 'Team Optimization', desc: 'Greedy selection algorithm builds the team that maximizes collective coverage, not individual scores.' },
  { icon: '🔍', title: 'Gap Detection', desc: 'Identifies skill and role gaps before they become blockers, with targeted recommendations.' },
  { icon: '💡', title: 'Explainable Results', desc: 'Plain-language explanations for every match — understand exactly why someone fits your team.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = howItWorksRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let prog = 0;
          const interval = setInterval(() => {
            prog += 2;
            setLineProgress(Math.min(prog, 100));
            if (prog >= 100) clearInterval(interval);
          }, 20);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: '#0B0D12', minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground variant="landing" />

      {/* ── Navbar ────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 48px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(11,13,18,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 200ms ease',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>A</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Axon</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#how-it-works" style={{ fontSize: '0.875rem', color: '#94A3B8', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
          >How It Works</a>
          <a href="#features" style={{ fontSize: '0.875rem', color: '#94A3B8', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F1F5F9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
          >AI Features</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/sign-in"
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#CBD5E1',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 150ms',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(124,58,237,0.5)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(124,58,237,0.3)'; }}
          >
            Build Your Team
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 48px 60px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left: Text */}
          <div style={{ animation: 'fadeIn 600ms ease forwards' }}>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              borderRadius: 9999,
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              marginBottom: 24,
            }}>
              <span style={{ fontSize: '0.75rem', color: '#8B5CF6', animation: 'glow-pulse 2s infinite' }}>✦</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#A78BFA', letterSpacing: '0.02em' }}>AI Team Intelligence</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#F1F5F9',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 20,
              margin: '0 0 20px',
            }}>
              Build better teams{' '}
              <span className="text-gradient">with AI.</span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#94A3B8',
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 480,
            }}>
              Axon understands your project, identifies the skills it needs, and connects you with the most compatible collaborators — with a plain-language explanation of why each person fits.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href="/sign-up"
                style={{
                  padding: '14px 28px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(124,58,237,0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(124,58,237,0.35)'; }}
              >
                Build Your Team →
              </Link>
              <a
                href="#how-it-works"
                style={{
                  padding: '14px 28px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#CBD5E1',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'all 200ms ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                Explore How It Works
              </a>
            </div>

            {/* Social proof */}
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', gap: -4 }}>
                {['u1','u2','u3','u4'].map((uid, i) => (
                  <div key={uid} style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid #0B0D12', marginLeft: i === 0 ? 0 : -8 }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                <span style={{ color: '#A78BFA', fontWeight: 600 }}>120+ teams</span> built with Axon this month
              </div>
            </div>
          </div>

          {/* Right: Interactive graph */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', animation: 'fadeIn 800ms 200ms ease both' }}>
            {/* Glow behind graph */}
            <div style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(circle at center, rgba(124,58,237,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <InteractiveTeamGraph
              nodes={HERO_NODES}
              width={480}
              height={380}
              mode="marketing"
            />
            {/* Floating skill chips */}
            {SKILL_CHIPS.map((chip, i) => (
              <div
                key={chip}
                style={{
                  position: 'absolute',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  color: '#A78BFA',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  animation: `float ${6 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.9}s`,
                  pointerEvents: 'none',
                  top: `${15 + (i * 13) % 70}%`,
                  left: i % 2 === 0 ? '-5%' : '85%',
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section id="how-it-works" ref={howItWorksRef} style={{ padding: '96px 48px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: 12 }}>
            How it works
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            From idea to optimal team in four steps — no spreadsheets, no guesswork.
          </p>
        </div>

        {/* Progress line */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: 32,
              left: '12.5%',
              right: '12.5%',
              height: 2,
              background: 'rgba(255,255,255,0.08)',
              zIndex: 0,
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                width: `${lineProgress}%`,
                transition: 'width 50ms linear',
                borderRadius: 9999,
              }} />
            </div>

            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  padding: 24,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'border-color 200ms, transform 200ms',
                  animation: `fadeIn ${400 + i * 100}ms ease both`,
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.25)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Step number node */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))',
                  border: '2px solid rgba(139,92,246,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#A78BFA',
                  flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Features ──────────────────────────────────── */}
      <section id="features" style={{ padding: '64px 48px 96px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em', marginBottom: 12 }}>
            AI intelligence features
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: 440, margin: '0 auto' }}>
            Every feature in Axon is backed by AI — not a label, a capability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {AI_FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '28px 24px',
                borderRadius: 18,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 200ms ease',
                animation: `fadeIn ${300 + i * 80}ms ease both`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(124,58,237,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
          {/* Last card spanning 2 cols for grid balance */}
          <div
            style={{
              gridColumn: 'span 1',
              padding: '28px 24px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.06))',
              border: '1px solid rgba(139,92,246,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              animation: `fadeIn ${300 + AI_FEATURES.length * 80}ms ease both`,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>Ready to build your best team?</h3>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: 20 }}>
              Join researchers, founders, and students who use Axon to form better teams faster.
            </p>
            <Link
              href="/sign-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
                width: 'fit-content',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              }}
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section style={{ padding: '80px 48px', position: 'relative', zIndex: 1, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F1F5F9', letterSpacing: '-0.03em', marginBottom: 16, position: 'relative' }}>
          Ready to build your best team?
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '1.125rem', marginBottom: 36, maxWidth: 440, margin: '0 auto 36px', position: 'relative', lineHeight: 1.7 }}>
          Describe your project. AI does the rest.
        </p>
        <div style={{ position: 'relative' }}>
          <Link
            href="/sign-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '16px 36px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              color: '#fff',
              fontSize: '1.0625rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(124,58,237,0.6)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)'; }}
          >
            ✦ Build Your Team Now
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.75rem' }}>A</div>
              <span style={{ fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Axon</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#475569' }}>Find the right people. Build the right team.</p>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#334155' }}>© 2024 Axon. AI Team Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
