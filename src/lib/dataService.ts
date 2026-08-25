import { supabase } from './supabase';
import type { User, Profile, Project, ProjectAnalysis, Team, TeamMember, TeamAnalysis, CandidateMatch } from './models';

// ============================================================
// Axon — Supabase Data Service
// Asynchronous CRUD over real-time Supabase Postgres Database
// ============================================================

export const dataService = {
  // ── Users ─────────────────────────────────────────────────
  getUser: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      createdAt: data.created_at,
    };
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      name: d.name,
      email: d.email,
      avatarUrl: d.avatar_url,
      bio: d.bio,
      createdAt: d.created_at,
    }));
  },

  upsertUser: async (user: User): Promise<User> => {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatarUrl,
      bio: user.bio,
    });
    if (error) throw error;
    return user;
  },

  // ── Profiles ──────────────────────────────────────────────
  getProfile: async (userId: string): Promise<Profile | undefined> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (error || !data) return undefined;
    return {
      userId: data.user_id,
      skills: data.skills || [],
      interests: data.interests || [],
      experience: data.experience || [],
      education: data.education || [],
      availability: data.availability || {},
      preferredRoles: data.preferred_roles || [],
      experienceLevel: data.experience_level,
      links: data.links || {},
    };
  },

  getAllProfiles: async (): Promise<Profile[]> => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error || !data) return [];
    return data.map(d => ({
      userId: d.user_id,
      skills: d.skills || [],
      interests: d.interests || [],
      experience: d.experience || [],
      education: d.education || [],
      availability: d.availability || {},
      preferredRoles: d.preferred_roles || [],
      experienceLevel: d.experience_level,
      links: d.links || {},
    }));
  },

  upsertProfile: async (profile: Profile): Promise<Profile> => {
    // 1. Ensure the user record exists in the public.users table to prevent FK errors
    const { data: userExists } = await supabase.from('users').select('id').eq('id', profile.userId).single();
    if (!userExists) {
       // Insert a dummy record. In a real app, we'd fetch the name/email from auth.users, but we just need it to exist
       await supabase.from('users').upsert({ id: profile.userId, name: 'User', email: 'user@example.com' });
    }

    const { error } = await supabase.from('profiles').upsert({
      user_id: profile.userId,
      skills: profile.skills,
      interests: profile.interests,
      experience: profile.experience,
      education: profile.education || [],
      availability: profile.availability,
      preferred_roles: profile.preferredRoles,
      experience_level: profile.experienceLevel,
      links: profile.links || {},
    });
    if (error) throw error;
    return profile;
  },

  // ── Projects ──────────────────────────────────────────────
  getProject: async (id: string): Promise<Project | undefined> => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return {
      id: data.id,
      ownerId: data.owner_id,
      title: data.title,
      description: data.description,
      category: data.category,
      teamSize: data.team_size,
      deadline: data.deadline,
      requiredAvailabilityHours: data.required_availability_hours,
      manualSkills: data.manual_skills || [],
      status: data.status,
      createdAt: data.created_at,
    };
  },

  getAllProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      ownerId: d.owner_id,
      title: d.title,
      description: d.description,
      category: d.category,
      teamSize: d.team_size,
      deadline: d.deadline,
      requiredAvailabilityHours: d.required_availability_hours,
      manualSkills: d.manual_skills || [],
      status: d.status,
      createdAt: d.created_at,
    }));
  },

  getProjectsByOwner: async (ownerId: string): Promise<Project[]> => {
    const { data, error } = await supabase.from('projects').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      ownerId: d.owner_id,
      title: d.title,
      description: d.description,
      category: d.category,
      teamSize: d.team_size,
      deadline: d.deadline,
      requiredAvailabilityHours: d.required_availability_hours,
      manualSkills: d.manual_skills || [],
      status: d.status,
      createdAt: d.created_at,
    }));
  },

  createProject: async (project: Project): Promise<Project> => {
    const { error } = await supabase.from('projects').insert({
      id: project.id,
      owner_id: project.ownerId,
      title: project.title,
      description: project.description,
      category: project.category,
      team_size: project.teamSize,
      deadline: project.deadline,
      required_availability_hours: project.requiredAvailabilityHours,
      manual_skills: project.manualSkills,
      status: project.status,
    });
    if (error) throw error;
    return project;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<void> => {
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.title) payload.title = updates.title;
    const { error } = await supabase.from('projects').update(payload).eq('id', id);
    if (error) throw error;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return !error;
  },

  // ── Analyses ──────────────────────────────────────────────
  getAnalysis: async (projectId: string): Promise<ProjectAnalysis | undefined> => {
    const { data, error } = await supabase.from('project_analyses').select('*').eq('project_id', projectId).single();
    if (error || !data) return undefined;
    return {
      projectId: data.project_id,
      complexity: data.complexity,
      recommendedTeamSize: data.recommended_team_size,
      recommendedRoles: data.recommended_roles || [],
      requiredSkills: data.required_skills || [],
      insights: data.insights || [],
      risks: data.risks || [],
      recommendedWorkflow: data.recommended_workflow || [],
    };
  },

  saveAnalysis: async (projectId: string, analysis: ProjectAnalysis): Promise<ProjectAnalysis> => {
    const { error } = await supabase.from('project_analyses').upsert({
      project_id: projectId,
      complexity: analysis.complexity,
      recommended_team_size: analysis.recommendedTeamSize,
      recommended_roles: analysis.recommendedRoles,
      required_skills: analysis.requiredSkills,
      insights: analysis.insights,
      risks: analysis.risks,
      recommended_workflow: analysis.recommendedWorkflow,
    });
    if (error) throw error;
    return analysis;
  },

  generateId: (prefix: string) => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};
