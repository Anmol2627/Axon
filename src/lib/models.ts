// ============================================================
// Axon — Data Models (Section 12 of spec)
// All TypeScript interfaces forming the shared contract between
// UI, service layer, and mock data. NO component imports here.
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
}

export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ProjectStatus = 'draft' | 'analyzed' | 'building' | 'complete';
export type SkillTier = 'Critical' | 'Important' | 'Recommended';
export type GapSeverity = 'Critical' | 'Recommended';
export type Complexity = 'Low' | 'Medium' | 'Medium-High' | 'High';
export type PreferredTime = 'Morning' | 'Afternoon' | 'Evening' | 'Flexible';
export type ExperienceType = 'project' | 'hackathon' | 'internship';
export type ProjectCategory =
  | 'AI/ML'
  | 'Web App'
  | 'Mobile App'
  | 'Data Science'
  | 'Hardware/IoT'
  | 'FinTech'
  | 'Other';

export interface Skill {
  id: string;
  name: string;
  proficiency: Proficiency;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  graduationYear?: string;
}

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  company?: string;
  duration?: string;
  description?: string;
  date?: string;
}

export interface Availability {
  hoursPerWeek: number;
  daysAvailable: string[];
  preferredTime: PreferredTime;
}

export interface Profile {
  userId: string;
  role?: string;
  skills: Skill[];
  interests: Interest[];
  experience: Experience[];
  education?: Education[];
  availability: Availability;
  preferredRoles: string[];
  experienceLevel: ExperienceLevel;
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: ProjectCategory;
  teamSize: number;
  deadline?: string;
  requiredAvailabilityHours: number;
  manualSkills: Skill[];
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectRequirement {
  projectId: string;
  skillName: string;
  tier: SkillTier;
}

export interface RoleRequirement {
  projectId: string;
  roleTitle: string;
  responsibilities: string[];
  keySkills: string[];
}

export interface ProjectAnalysis {
  projectId: string;
  complexity: Complexity;
  recommendedTeamSize: number;
  recommendedRoles: RoleRequirement[];
  requiredSkills: ProjectRequirement[];
  insights: string[];
  risks: { label: string; severity: 'Amber' | 'Red' }[];
  recommendedWorkflow?: {
    phase: string;
    description: string;
  }[];
}

export interface MatchReason {
  label: string;
  detail: string;
}

export interface CandidateMatch {
  projectId: string;
  userId: string;
  score: number;
  reasons: MatchReason[];
}

export interface Team {
  id: string;
  projectId: string;
  memberIds: string[];
  compatibilityScore: number;
  skillCoverage: number;
  availabilityCompatibility: number;
  roleCoverage: { filled: number; total: number };
}

export interface TeamMember {
  teamId: string;
  userId: string;
  role: string;
  roleMatchScore: number;
}

export interface TeamAnalysis {
  teamId: string;
  readiness: number;
  technicalCoverage: number;
  experienceCoverage: number;
  availability: number;
  roleBalance: number;
  gaps: {
    label: string;
    recommendation: string;
    severity: GapSeverity;
    missingSkills?: string[];
  }[];
}

export interface Recommendation {
  id: string;
  userId: string;
  type: 'project' | 'candidate';
  targetId: string;
  score: number;
  reason: string;
}

// ── Composite view models used by UI hooks ──────────────────

export interface CandidateProfile {
  user: User;
  profile: Profile;
}

export interface ProjectWithAnalysis {
  project: Project;
  analysis?: ProjectAnalysis;
}
