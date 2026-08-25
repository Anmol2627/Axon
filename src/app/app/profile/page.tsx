'use client';

import React, { useState, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { AIProcessingState } from '@/components/ui/AIProcessingState';
import { Profile } from '@/lib/models';

export default function ProfilePage() {
  const { currentUser, currentProfile, updateProfile } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [phase, setPhase] = useState<'view' | 'uploading' | 'processing' | 'review'>('view');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formSkills, setFormSkills] = useState(currentProfile?.skills || []);
  const [formExperience, setFormExperience] = useState(currentProfile?.experience || []);
  const [formEducation, setFormEducation] = useState(currentProfile?.education || []);
  const [formRole, setFormRole] = useState(currentProfile?.role || 'Software Engineer');
  const [formLinks, setFormLinks] = useState({
    linkedin: currentProfile?.links?.linkedin || '',
    github: currentProfile?.links?.github || '',
    portfolio: currentProfile?.links?.portfolio || '',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhase('processing');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/ai/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to parse resume');
      const data = await res.json();
      
      // Populate form with AI extracted data
      const extractedRole = (data.suggestedRoles && data.suggestedRoles.length > 0) ? data.suggestedRoles[0] : (data.personalInfo?.name ? 'Software Engineer' : '');
      setFormRole(extractedRole);
      setFormSkills((data.skills || []).map((s: any) => ({
        name: s.name,
        category: 'Technical',
        proficiency: s.proficiency || 'Intermediate'
      })));
      setFormExperience((data.experience || []).map((e: any) => ({
        id: `exp_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
        title: e.title,
        company: e.company,
        duration: e.duration,
        description: e.description
      })));
      setFormEducation((data.education || []).map((edu: any) => ({
        id: `edu_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
        degree: edu.degree || edu.title || '',
        institution: edu.institution || edu.company || '',
        graduationYear: edu.graduationYear || edu.duration || ''
      })));
      
      if (data.links) {
        setFormLinks({
          linkedin: data.links.linkedin || currentProfile?.links?.linkedin || '',
          github: data.links.github || currentProfile?.links?.github || '',
          portfolio: data.links.portfolio || currentProfile?.links?.portfolio || '',
        });
      }

      setPhase('review');
    } catch (err: any) {
      setError(err.message || 'Error parsing resume');
      setPhase('view');
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      await updateProfile({
        userId: currentUser.id,
        role: formRole,
        skills: formSkills,
        experience: formExperience,
        education: formEducation,
        interests: currentProfile?.interests || [],
        availability: currentProfile?.availability || { status: 'Available', hoursPerWeek: 40 },
        preferredRoles: currentProfile?.preferredRoles || [],
        experienceLevel: currentProfile?.experienceLevel || 'Intermediate',
        links: formLinks,
      } as any);
      setIsEditing(false);
      setPhase('view');
    } catch (err) {
      setError('Failed to save profile updates.');
    }
  };

  const addSkill = () => {
    const name = prompt("Enter skill name:");
    if (!name) return;
    setFormSkills([...formSkills, { name, category: 'Technical', proficiency: 'Intermediate' } as any]);
  };

  const removeSkill = (index: number) => {
    setFormSkills(formSkills.filter((_, i) => i !== index));
  };

  if (phase === 'processing') {
    return (
      <AppShell title="Profile">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 0' }}>
          <GlassCard tier="primary" style={{ padding: '48px' }}>
            <AIProcessingState variant="analyze" title="Extracting Profile Data..." />
          </GlassCard>
        </div>
      </AppShell>
    );
  }

  if (phase === 'review') {
    return (
      <AppShell title="Review Extracted Profile">
        <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 300ms ease' }}>
          <GlassCard tier="primary" style={{ padding: 40 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16 }}>Review Extracted Profile</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>We've extracted the following information from your resume. Please review and edit before saving.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Professional Role</label>
                <input 
                  value={formRole} 
                  onChange={e => setFormRole(e.target.value)} 
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  {formSkills.map((s, idx) => (
                    <div key={idx} style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-oat)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {s.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{s.proficiency}</span>
                      <button onClick={() => removeSkill(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-semantic-critical)', cursor: 'pointer', padding: 0, marginLeft: 4 }}>&times;</button>
                    </div>
                  ))}
                </div>
                <button onClick={addSkill} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px dashed var(--border-strong)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  + Add Skill
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Links</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input value={formLinks.linkedin} onChange={e => setFormLinks({...formLinks, linkedin: e.target.value})} placeholder="LinkedIn URL" style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }} />
                  <input value={formLinks.github} onChange={e => setFormLinks({...formLinks, github: e.target.value})} placeholder="GitHub URL" style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }} />
                  <input value={formLinks.portfolio} onChange={e => setFormLinks({...formLinks, portfolio: e.target.value})} placeholder="Portfolio / Website URL" style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }} />
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 40, justifyContent: 'flex-end' }}>
              <button onClick={() => setPhase('view')} style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--border-subtle)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', background: 'var(--color-action-terracotta)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Save to Profile</button>
            </div>
          </GlassCard>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Profile">
      <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeIn 300ms ease' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
              Your Profile
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
              Manage your professional identity and skills.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <input 
              type="file" 
              accept=".pdf,.docx" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-oat)', color: 'var(--color-organic-deep-moss)', border: '1px solid var(--color-organic-moss)', fontWeight: 600, cursor: 'pointer' }}
            >
              Upload Resume (AI)
            </button>
            {!isEditing ? (
              <button 
                onClick={() => {
                  setFormSkills(currentProfile?.skills || []);
                  setFormExperience(currentProfile?.experience || []);
                  setFormRole(currentProfile?.role || 'Software Engineer');
                  setFormLinks({
                    linkedin: currentProfile?.links?.linkedin || '',
                    github: currentProfile?.links?.github || '',
                    portfolio: currentProfile?.links?.portfolio || '',
                  });
                  setIsEditing(true);
                }}
                style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-action-terracotta)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-subtle)' }}
              >
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleSave}
                style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-action-terracotta)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-subtle)' }}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{ padding: 12, background: 'rgba(217,122,98,0.1)', color: 'var(--color-semantic-critical)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* Profile Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Personal Info */}
          <GlassCard tier="primary" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-oat)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, color: 'var(--color-organic-deep-moss)' }}>
                {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) ?? 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                  {currentUser?.name ?? 'User Name'}
                </h2>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                  {currentUser?.email ?? 'user@example.com'}
                </div>
                {isEditing ? (
                  <input 
                    value={formRole} 
                    onChange={e => setFormRole(e.target.value)} 
                    placeholder="E.g. Frontend Engineer"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }}
                  />
                ) : (
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{currentProfile?.role || formRole || 'No role set'}</div>
                )}
              </div>
            </div>
            {/* Links Section */}
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Professional Links</h3>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input value={formLinks.linkedin} onChange={e => setFormLinks({...formLinks, linkedin: e.target.value})} placeholder="LinkedIn URL" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }} />
                  <input value={formLinks.github} onChange={e => setFormLinks({...formLinks, github: e.target.value})} placeholder="GitHub URL" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }} />
                  <input value={formLinks.portfolio} onChange={e => setFormLinks({...formLinks, portfolio: e.target.value})} placeholder="Portfolio / Website URL" style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-base)', outline: 'none' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 16 }}>
                  {currentProfile?.links?.linkedin && <a href={currentProfile.links.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--color-action-terracotta)', fontWeight: 500, textDecoration: 'none' }}>LinkedIn ↗</a>}
                  {currentProfile?.links?.github && <a href={currentProfile.links.github} target="_blank" rel="noreferrer" style={{ color: 'var(--color-action-terracotta)', fontWeight: 500, textDecoration: 'none' }}>GitHub ↗</a>}
                  {currentProfile?.links?.portfolio && <a href={currentProfile.links.portfolio} target="_blank" rel="noreferrer" style={{ color: 'var(--color-action-terracotta)', fontWeight: 500, textDecoration: 'none' }}>Portfolio ↗</a>}
                  {(!currentProfile?.links?.linkedin && !currentProfile?.links?.github && !currentProfile?.links?.portfolio) && (
                    <span style={{ color: 'var(--color-text-muted)' }}>No links added yet.</span>
                  )}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Skills */}
          <GlassCard tier="primary" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)' }}>Skills & Expertise</h3>
              {isEditing && (
                <button onClick={addSkill} style={{ padding: '6px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-oat)', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  + Add Skill
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {(isEditing ? formSkills : (currentProfile?.skills || [])).map((s, idx) => (
                <div key={idx} style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{s.proficiency}</span>
                  {isEditing && (
                    <button onClick={() => removeSkill(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-semantic-critical)', cursor: 'pointer', padding: 0, marginLeft: 4 }}>&times;</button>
                  )}
                </div>
              ))}
              {(!isEditing && (!currentProfile?.skills || currentProfile.skills.length === 0)) && (
                <div style={{ color: 'var(--color-text-muted)' }}>No skills added. Click Edit Profile to add some.</div>
              )}
            </div>
          </GlassCard>

          {/* Experience */}
          <GlassCard tier="primary" style={{ padding: 32 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)', marginBottom: 24 }}>Experience</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(isEditing ? formExperience : (currentProfile?.experience || [])).map((e, idx) => (
                <div key={e.id || idx} style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <input value={e.title} onChange={ev => { const newExp = [...formExperience]; newExp[idx].title = ev.target.value; setFormExperience(newExp); }} placeholder="Job Title" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', width: '100%', outline: 'none' }} />
                      <div style={{ display: 'flex', gap: 16 }}>
                        <input value={e.company} onChange={ev => { const newExp = [...formExperience]; newExp[idx].company = ev.target.value; setFormExperience(newExp); }} placeholder="Company" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', flex: 1, outline: 'none' }} />
                        <input value={e.duration} onChange={ev => { const newExp = [...formExperience]; newExp[idx].duration = ev.target.value; setFormExperience(newExp); }} placeholder="Duration (e.g. 2020-2023)" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', flex: 1, outline: 'none' }} />
                      </div>
                      <textarea value={e.description} onChange={ev => { const newExp = [...formExperience]; newExp[idx].description = ev.target.value; setFormExperience(newExp); }} placeholder="Description" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', width: '100%', minHeight: 80, outline: 'none' }} />
                      <button onClick={() => { const newExp = [...formExperience]; newExp.splice(idx, 1); setFormExperience(newExp); }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-semantic-critical)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Remove Experience</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.1rem', marginBottom: 6 }}>{e.title}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>{e.company} • {e.duration}</div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{e.description}</div>
                    </>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <button 
                  onClick={() => setFormExperience([...formExperience, { id: `exp_${Date.now()}`, title: '', company: '', duration: '', description: '' } as any])}
                  style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px dashed var(--border-strong)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 500 }}
                >
                  + Add New Experience
                </button>
              )}
              {(!isEditing && (!currentProfile?.experience || currentProfile.experience.length === 0)) && (
                <div style={{ color: 'var(--color-text-muted)' }}>No experience added.</div>
              )}
            </div>
          </GlassCard>

          {/* Education */}
          <GlassCard tier="primary" style={{ padding: 32 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)', marginBottom: 24 }}>Education</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(isEditing ? formEducation : (currentProfile?.education || [])).map((edu, idx) => (
                <div key={edu.id || idx} style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-base)', border: '1px solid var(--border-subtle)' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <input value={edu.degree} onChange={ev => { const newEdu = [...formEducation]; newEdu[idx].degree = ev.target.value; setFormEducation(newEdu); }} placeholder="Degree (e.g. B.S. Computer Science)" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', width: '100%', outline: 'none' }} />
                      <div style={{ display: 'flex', gap: 16 }}>
                        <input value={edu.institution} onChange={ev => { const newEdu = [...formEducation]; newEdu[idx].institution = ev.target.value; setFormEducation(newEdu); }} placeholder="Institution / University" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', flex: 1, outline: 'none' }} />
                        <input value={edu.graduationYear} onChange={ev => { const newEdu = [...formEducation]; newEdu[idx].graduationYear = ev.target.value; setFormEducation(newEdu); }} placeholder="Graduation Year" style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--color-bg-oat)', flex: 1, outline: 'none' }} />
                      </div>
                      <button onClick={() => { const newEdu = [...formEducation]; newEdu.splice(idx, 1); setFormEducation(newEdu); }} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-semantic-critical)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Remove Education</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.1rem', marginBottom: 6 }}>{edu.degree}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{edu.institution}{edu.graduationYear ? ` • ${edu.graduationYear}` : ''}</div>
                    </>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <button 
                  onClick={() => setFormEducation([...formEducation, { id: `edu_${Date.now()}`, degree: '', institution: '', graduationYear: '' } as any])}
                  style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px dashed var(--border-strong)', color: 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 500 }}
                >
                  + Add New Education
                </button>
              )}
              {(!isEditing && (!currentProfile?.education || currentProfile.education.length === 0)) && (
                <div style={{ color: 'var(--color-text-muted)' }}>No education added.</div>
              )}
            </div>
          </GlassCard>

        </div>
      </div>
    </AppShell>
  );
}
