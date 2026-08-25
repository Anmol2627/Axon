'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { AIProcessingState } from '@/components/ui/AIProcessingState';
import { useApp } from '@/context/AppContext';
import type { Project } from '@/lib/models';

const CATEGORIES = ['AI/ML', 'Web App', 'Mobile App', 'Data Science', 'FinTech', 'Hardware/IoT', 'Other'];

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function NewProjectPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'AI/ML' as Project['category'],
    teamSize: 4,
    hoursPerWeek: 15,
  });
  const [phase, setPhase] = useState<'form' | 'analyzing' | 'done'>('form');
  const [charCount, setCharCount] = useState(0);

  const canAnalyze = form.title.trim().length >= 4 && form.description.trim().length >= 20;

  const handleAnalyze = async () => {
    try {
      setPhase('analyzing');
      const { dataService } = await import('@/lib/dataService');
      const { getAIService } = await import('@/lib/aiService');

      const project: Project = {
        id: generateId(),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: 'draft',
        ownerId: currentUser?.id ?? 'user_1',
        teamSize: form.teamSize,
        requiredAvailabilityHours: form.hoursPerWeek,
        manualSkills: [],
        createdAt: new Date().toISOString(),
      };

      await dataService.createProject(project);

      const aiService = getAIService();
      const analysis = await aiService.analyzeProject(project);
      await dataService.saveAnalysis(project.id, analysis);
      await dataService.updateProject(project.id, { status: 'analyzed' });

      router.push(`/app/projects/${project.id}/analysis`);
    } catch (err: any) {
      console.error(err);
      alert(`Error analyzing project: ${err.message}`);
      setPhase('form');
    }
  };

  return (
    <AppShell title="Create Project" subtitle="Describe your idea and AI will handle the rest.">
      {phase === 'analyzing' ? (
        <div style={{ maxWidth: 480, margin: '60px auto' }}>
          <GlassCard tier="primary" style={{ padding: 0 }}>
            <AIProcessingState variant="analyze" onComplete={() => {}} title="Analyzing Your Project" />
          </GlassCard>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
            {/* Form */}
            <GlassCard tier="primary" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 24, fontFamily: 'var(--font-serif)' }}>
                Project Details
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {/* Title */}
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Project Title</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. AI-Powered Carbon Footprint Tracker"
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 8,
                      background: 'var(--color-bg-base)',
                      border: `1px solid ${form.title.length >= 4 ? 'var(--color-organic-moss)' : 'var(--border-strong)'}`,
                      color: 'var(--color-text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'border-color 150ms', boxSizing: 'border-box',
                    }}
                    onFocus={e => { if (form.title.length < 4) e.target.style.borderColor = 'var(--color-action-terracotta)'; }}
                    onBlur={e => { if (form.title.length < 4) e.target.style.borderColor = 'var(--border-strong)'; }}
                  />
                  {form.title.length > 0 && form.title.length < 4 && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-semantic-warning)', marginTop: 4 }}>Enter at least 4 characters.</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as Project['category'] }))}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 8,
                      background: 'var(--color-bg-base)',
                      border: '1px solid var(--border-strong)',
                      color: 'var(--color-text-primary)', fontSize: '0.9375rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
                    }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Project Description</label>
                    <span style={{ fontSize: '0.7rem', color: charCount >= 20 ? 'var(--color-organic-moss)' : 'var(--color-text-muted)' }}>{charCount} chars</span>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setCharCount(e.target.value.length); }}
                    placeholder="Describe what you want to build. You can start rough — AI will understand the intent. Include the problem you're solving, any tech preferences, and what success looks like."
                    rows={6}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 8,
                      background: 'var(--color-bg-base)',
                      border: `1px solid ${form.description.length >= 20 ? 'var(--color-organic-moss)' : 'var(--border-strong)'}`,
                      color: 'var(--color-text-primary)', fontSize: '0.9375rem', outline: 'none', resize: 'vertical',
                      lineHeight: 1.6, boxSizing: 'border-box', transition: 'border-color 150ms',
                    }}
                    onFocus={e => { if (form.description.length < 20) e.target.style.borderColor = 'var(--color-action-terracotta)'; }}
                    onBlur={e => { if (form.description.length < 20) e.target.style.borderColor = 'var(--border-strong)'; }}
                  />
                  {form.description.length > 0 && form.description.length < 20 && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-semantic-warning)', marginTop: 4 }}>Add more context (need {20 - form.description.length} more characters).</p>
                  )}
                </div>

                {/* Team Size */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Team Size</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-action-terracotta)' }}>{form.teamSize} members</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[2, 3, 4, 5, 6, 8, 10].map(n => (
                      <button
                        key={n}
                        onClick={() => setForm(f => ({ ...f, teamSize: n }))}
                        style={{
                          width: 44, height: 36, borderRadius: 8,
                          background: form.teamSize === n ? 'var(--color-bg-oat)' : 'var(--color-bg-base)',
                          border: form.teamSize === n ? '1px solid rgba(217,122,98,0.45)' : '1px solid var(--border-subtle)',
                          color: form.teamSize === n ? 'var(--color-action-terracotta)' : 'var(--color-text-muted)',
                          fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 150ms',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hours/week */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Required Availability</label>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-action-terracotta)' }}>{form.hoursPerWeek}h / week</span>
                  </div>
                  <input
                    type="range" min={5} max={40} step={5} value={form.hoursPerWeek}
                    onChange={e => setForm(f => ({ ...f, hoursPerWeek: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--color-action-terracotta)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    <span>5h (casual)</span><span>20h (part-time)</span><span>40h (full-time)</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: 32 }}>
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  style={{
                    width: '100%', padding: '14px',
                    borderRadius: 12,
                    background: canAnalyze ? 'var(--color-action-terracotta)' : 'var(--color-bg-oat)',
                    border: 'none',
                    color: canAnalyze ? '#fff' : 'var(--color-text-muted)',
                    fontSize: '1rem', fontWeight: 600,
                    cursor: canAnalyze ? 'pointer' : 'not-allowed',
                    transition: 'all 200ms',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: canAnalyze ? 'var(--shadow-subtle)' : 'none',
                  }}
                  onMouseEnter={e => { if (canAnalyze) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = canAnalyze ? 'var(--shadow-subtle)' : 'none'; }}
                >
                  {canAnalyze ? '✦ Analyze with AI' : 'Add title and description to continue'}
                </button>
              </div>
            </GlassCard>

            {/* Live Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <GlassCard tier="secondary" style={{ padding: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-action-terracotta)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>Live Preview</div>
                {form.title ? (
                  <>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 9999, background: 'var(--color-bg-oat)', border: '1px solid var(--border-subtle)', color: 'var(--color-organic-deep-moss)', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{form.category}</span>
                      <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 9999, background: 'var(--color-bg-oat)', border: '1px solid var(--border-subtle)', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Draft</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8, lineHeight: 1.35, fontFamily: 'var(--font-serif)' }}>{form.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: 14,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {form.description || <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Start writing your description…</span>}
                    </p>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <span>👥 {form.teamSize} members</span>
                      <span>⏱ {form.hoursPerWeek}h/week</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8, opacity: 0.5, color: 'var(--color-organic-moss)' }}>◈</div>
                    Start typing to see your project preview
                  </div>
                )}
              </GlassCard>

              <GlassCard tier="secondary" style={{ padding: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-organic-moss)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16 }}>What AI will do</div>
                {[
                  'Understand your project intent',
                  'Identify required skills and roles',
                  'Score candidates semantically',
                  'Explain why each person fits',
                  'Detect potential team gaps',
                ].map((item, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--color-organic-sage)' }}>✦</span> {item}
                  </div>
                ))}
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
