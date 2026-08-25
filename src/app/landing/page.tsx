'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { InteractiveTeamGraph, GraphNode } from '@/components/ui/InteractiveTeamGraph';

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
    <div style={{ background: 'var(--color-bg-base)', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

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
          background: scrolled ? 'rgba(253, 252, 247, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
          transition: 'all 200ms ease',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--color-action-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>A</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)' }}>Axon</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#how-it-works" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >How It Works</a>
          <a href="#features" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >AI Features</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/sign-in"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 150ms',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-oat)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-action-terracotta)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 150ms',
              boxShadow: 'var(--shadow-subtle)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-medium)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-subtle)'; }}
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
              background: 'var(--color-bg-oat)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 24,
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-action-terracotta)', animation: 'glow-pulse 2s infinite' }}>✦</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-organic-deep-moss)', letterSpacing: '0.02em' }}>AI Team Intelligence</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 20,
              fontFamily: 'var(--font-serif)',
            }}>
              Build better teams{' '}
              <span style={{ color: 'var(--color-action-terracotta)' }}>with AI.</span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-secondary)',
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
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-action-terracotta)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 200ms ease',
                  boxShadow: 'var(--shadow-medium)',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-elevation)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-medium)'; }}
              >
                Build Your Team &rarr;
              </Link>
              <a
                href="#how-it-works"
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'all 200ms ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-oat)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                Explore How It Works
              </a>
            </div>

            {/* Social proof */}
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', gap: -4 }}>
                {['u1','u2','u3','u4'].map((uid, i) => (
                  <div key={uid} style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-bg-base)', marginLeft: i === 0 ? 0 : -8 }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                <span style={{ color: 'var(--color-organic-deep-moss)', fontWeight: 600 }}>120+ teams</span> built with Axon this month
              </div>
            </div>
          </div>

          {/* Right: Interactive graph */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', animation: 'fadeIn 800ms 200ms ease both' }}>
            {/* Glow behind graph */}
            <div style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(circle at center, rgba(217, 122, 98, 0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-elevation)'
            }}>
                <InteractiveTeamGraph
                nodes={HERO_NODES}
                width={480}
                height={380}
                mode="marketing"
                />
            </div>
            {/* Floating skill chips */}
            {SKILL_CHIPS.map((chip, i) => (
              <div
                key={chip}
                style={{
                  position: 'absolute',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  background: 'var(--color-bg-base)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  animation: `float ${6 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.9}s`,
                  pointerEvents: 'none',
                  top: `${15 + (i * 13) % 70}%`,
                  left: i % 2 === 0 ? '-5%' : '85%',
                  boxShadow: 'var(--shadow-subtle)'
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
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 12, fontFamily: 'var(--font-serif)' }}>
            How it works
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
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
              background: 'var(--border-subtle)',
              zIndex: 0,
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                background: 'var(--color-action-terracotta)',
                width: `${lineProgress}%`,
                transition: 'width 100ms linear',
              }} />
            </div>

            {HOW_IT_WORKS.map((item, i) => {
              const active = lineProgress >= (i * 33.33);
              return (
                <div key={item.step} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: active ? 'var(--color-action-terracotta)' : 'var(--color-bg-oat)',
                    border: `2px solid ${active ? 'var(--color-action-terracotta)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: active ? '#fff' : 'var(--color-text-muted)',
                    marginBottom: 20,
                    transition: 'all 300ms ease',
                    boxShadow: active ? '0 0 0 8px rgba(217, 122, 98, 0.1)' : 'none',
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" style={{ padding: '96px 48px', background: 'var(--color-bg-oat)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 12, fontFamily: 'var(--font-serif)' }}>
              Powered by deep AI understanding
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: 540, margin: '0 auto' }}>
              We don't just match keywords. Our intelligence layer understands the context of your project and the nuanced experience of every candidate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {AI_FEATURES.map((feat, i) => (
              <div key={feat.title} style={{
                background: 'var(--color-bg-base)',
                borderRadius: 'var(--radius-lg)',
                padding: 32,
                border: '1px solid var(--border-subtle)',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-elevation)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-bg-oat)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 20 }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ────────────────────────────────────── */}
      <footer style={{ padding: '100px 48px', textAlign: 'center', background: 'var(--color-bg-base)', borderTop: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 24, fontFamily: 'var(--font-serif)' }}>
          Ready to build your dream team?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Stop guessing who fits where. Let Axon assemble the perfect team for your next big project.
        </p>
        <Link
          href="/sign-up"
          style={{
            padding: '16px 36px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-action-terracotta)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1.125rem',
            fontWeight: 600,
            transition: 'all 200ms ease',
            boxShadow: 'var(--shadow-medium)',
            display: 'inline-block',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-elevation)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-medium)'; }}
        >
          Get Started for Free
        </Link>

        <div style={{ marginTop: 80, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Axon Team Intelligence. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
