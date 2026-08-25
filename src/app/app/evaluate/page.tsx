'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';

export default function EvaluatePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loadingStage, setLoadingStage] = useState(0);

  const stages = [
    "Validating repository...",
    "Reading project structure...",
    "Identifying key files...",
    "Analyzing code architecture...",
    "Checking security and quality...",
    "Evaluating challenge alignment...",
    "Generating AI evaluation..."
  ];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStage(0);

    // Simulate progress stages to keep user engaged during long wait
    const interval = setInterval(() => {
      setLoadingStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      const response = await fetch('/api/ai/evaluate/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to evaluate repository.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during evaluation.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--color-organic-sage)';
    if (score >= 70) return 'var(--color-organic-moss)';
    if (score >= 50) return '#d9a05b'; // warm amber
    return 'var(--color-semantic-critical)';
  };

  const getSeverityBadge = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === 'critical' || s === 'high') {
      return <span style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(217,122,98,0.1)', color: 'var(--color-semantic-critical)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{severity}</span>;
    }
    if (s === 'medium') {
      return <span style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(217,160,91,0.1)', color: '#d9a05b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{severity}</span>;
    }
    return <span style={{ padding: '4px 8px', borderRadius: 4, background: 'var(--color-bg-oat)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{severity}</span>;
  };

  return (
    <AppShell title="AI Evaluation">
      <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 400ms ease forwards' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
            GitHub Repository Evaluation
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', maxWidth: 600 }}>
            Submit a public GitHub repository to receive a comprehensive AI-powered code evaluation against the ProjectMatch challenge criteria.
          </p>
        </div>

        {/* Input Form */}
        <GlassCard tier="primary" style={{ padding: 32, marginBottom: 40 }}>
          <form onSubmit={handleEvaluate} style={{ display: 'flex', gap: 16 }}>
            <input 
              type="url" 
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={loading}
              required
              style={{
                flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)',
                fontSize: '1rem', color: 'var(--color-text-primary)', outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0 32px', borderRadius: 'var(--radius-md)', background: 'var(--color-action-terracotta)',
                color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease', boxShadow: 'var(--shadow-subtle)'
              }}
            >
              {loading ? 'Evaluating...' : 'Evaluate Repository'}
            </button>
          </form>
          {error && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(217,122,98,0.05)', border: '1px solid rgba(217,122,98,0.2)', color: 'var(--color-semantic-critical)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>❌</span> {error}
            </div>
          )}
        </GlassCard>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: 60, textAlign: 'center', animation: 'fadeIn 300ms ease' }}>
            <div style={{ width: 48, height: 48, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--color-action-terracotta)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>Analyzing Codebase</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {stages.map((stage, idx) => (
                <div key={idx} style={{ 
                  fontSize: '0.95rem', 
                  color: idx === loadingStage ? 'var(--color-action-terracotta)' : (idx < loadingStage ? 'var(--color-organic-moss)' : 'var(--color-text-muted)'),
                  fontWeight: idx === loadingStage ? 600 : 400,
                  opacity: idx > loadingStage ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {idx < loadingStage ? '✓' : (idx === loadingStage ? '✦' : '○')} {stage}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{ animation: 'slideUp 600ms ease backwards' }}>
            
            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
              <GlassCard tier="secondary" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Overall Score</div>
                <div style={{ fontSize: '4.5rem', fontWeight: 700, color: getScoreColor(result.overallScore), lineHeight: 1, fontFamily: 'var(--font-serif)', marginBottom: 8 }}>
                  {result.overallScore}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Confidence: <span style={{ textTransform: 'capitalize', fontWeight: 500, color: 'var(--color-text-primary)' }}>{result.confidence}</span></div>
              </GlassCard>

              <GlassCard tier="secondary" style={{ padding: 32 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>Repository Context</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Project Type</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{result.repositorySummary?.projectType || 'Unknown'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Languages</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{(result.repositorySummary?.languages || []).join(', ')}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Architecture Summary</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{result.repositorySummary?.architectureSummary}</p>
              </GlassCard>
            </div>

            {/* Scores Grid */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '40px 0 20px', fontFamily: 'var(--font-serif)' }}>Category Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
              {Object.entries(result.scores || {}).map(([key, score]: [string, any]) => {
                const names: any = { codeQuality: 'Code Quality', security: 'Security', efficiency: 'Efficiency', testing: 'Testing', accessibility: 'Accessibility', problemAlignment: 'Problem Alignment' };
                const name = names[key] || key;
                return (
                  <GlassCard key={key} tier="secondary" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{name}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: getScoreColor(score) }}>{score}</div>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--color-bg-oat)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${score}%`, height: '100%', background: getScoreColor(score), borderRadius: 3 }} />
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* Strengths & Issues */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <GlassCard tier="secondary" style={{ padding: 32 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-organic-moss)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>✦</span> Key Strengths
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(result.strengths || []).map((s: any, i: number) => (
                    <div key={i} style={{ paddingBottom: 16, borderBottom: i < result.strengths.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{s.description}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard tier="secondary" style={{ padding: 32 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-action-terracotta)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚠</span> Issues Detected
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(result.issues || []).map((iss: any, i: number) => (
                    <div key={i} style={{ paddingBottom: 16, borderBottom: i < result.issues.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{iss.title}</div>
                        {getSeverityBadge(iss.severity)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>{iss.description}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-organic-moss)', fontWeight: 500 }}>Recommendation: {iss.recommendation}</div>
                    </div>
                  ))}
                  {(!result.issues || result.issues.length === 0) && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>No major issues detected.</div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Final Verdict & Priorities */}
            <GlassCard tier="primary" style={{ padding: 40 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16, fontFamily: 'var(--font-serif)' }}>Final Verdict</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
                {result.finalVerdict}
              </p>

              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Top Priority Improvements</h4>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(result.topPriorityImprovements || []).map((imp: string, i: number) => (
                  <li key={i} style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>{imp}</li>
                ))}
              </ul>
            </GlassCard>

          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </AppShell>
  );
}
