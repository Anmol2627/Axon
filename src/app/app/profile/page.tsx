'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useApp } from '@/context/AppContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Profile } from '@/lib/models';

export default function ProfilePage() {
  const { currentUser, currentProfile, updateProfile } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [uploadPhase, setUploadPhase] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Ref for hidden file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      setUploadPhase('idle');
    } catch (err) {
      console.error('Failed to save profile updates.', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File is too large (max 10MB)");
      setUploadPhase('error');
      return;
    }

    try {
      setUploadPhase('uploading');
      setUploadError(null);
      setIsEditing(true); // Force edit mode to show the new extracted data

      const formData = new FormData();
      formData.append('file', file);

      // We jump straight to analyzing after short delay for UX
      setTimeout(() => setUploadPhase('analyzing'), 800);

      const response = await fetch('/api/ai/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Auto-populate form
      if (data.role) setFormRole(data.role);
      if (data.skills && data.skills.length > 0) {
        const newSkills = data.skills.map((s: any) => ({
          name: s.name,
          category: s.category || 'Technical',
          proficiency: s.proficiency || 'Intermediate'
        }));
        setFormSkills(newSkills);
      }
      if (data.experience && data.experience.length > 0) {
        setFormExperience(data.experience.map((e: any, i: number) => ({ ...e, id: `ai_exp_${i}` })));
      }
      if (data.education && data.education.length > 0) {
        setFormEducation(data.education.map((e: any, i: number) => ({ ...e, id: `ai_edu_${i}` })));
      }
      
      // Extract links if possible from Github/LinkedIn
      const newLinks = { ...formLinks };
      let updatedLinks = false;
      if (data.linkedin) { newLinks.linkedin = data.linkedin; updatedLinks = true; }
      if (data.github) { newLinks.github = data.github; updatedLinks = true; }
      if (updatedLinks) setFormLinks(newLinks);

      setUploadPhase('success');
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to parse resume.");
      setUploadPhase('error');
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
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.docx,.txt" 
              onChange={handleFileUpload} 
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadPhase === 'uploading' || uploadPhase === 'analyzing'}
              style={{ 
                padding: '10px 16px', borderRadius: 'var(--radius-md)', 
                background: 'var(--color-bg-base)', color: 'var(--color-organic-moss)', 
                border: '1px solid var(--color-organic-moss)', fontWeight: 600, 
                cursor: (uploadPhase === 'uploading' || uploadPhase === 'analyzing') ? 'not-allowed' : 'pointer', 
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: (uploadPhase === 'uploading' || uploadPhase === 'analyzing') ? 0.6 : 1
              }}
            >
              ✦ Upload Resume (AI)
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



        {/* AI Upload Status */}
        {uploadPhase !== 'idle' && (
          <div style={{ marginBottom: 24 }}>
            <GlassCard tier="secondary" style={{ padding: 24, borderLeft: '4px solid var(--color-organic-moss)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {uploadPhase === 'uploading' && <span style={{ fontSize: '1.2rem' }}>☁️ Uploading...</span>}
                {uploadPhase === 'analyzing' && <span style={{ fontSize: '1.2rem', color: 'var(--color-organic-moss)', animation: 'pulse 1.5s infinite' }}>✦ Analyzing your experience...</span>}
                {uploadPhase === 'success' && <span style={{ fontSize: '1.2rem', color: 'var(--color-organic-sage)' }}>✅ Profile populated successfully! Please review and save.</span>}
                {uploadPhase === 'error' && (
                  <div style={{ color: 'var(--color-semantic-critical)' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: 8 }}>❌</span> 
                    <strong>Error:</strong> {uploadError}
                  </div>
                )}
              </div>
            </GlassCard>
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
                    <button aria-label={`Remove ${s.name} skill`} onClick={() => removeSkill(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-semantic-critical)', cursor: 'pointer', padding: 0, marginLeft: 4 }}>&times;</button>
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
