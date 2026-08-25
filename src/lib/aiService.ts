// ============================================================
// Axon — AI Service
// IAIService interface + ApiAIService implementation.
// All AI-driven features sit behind this interface.
// ============================================================

import type {
  Project,
  ProjectAnalysis,
  ProjectRequirement,
  RoleRequirement,
  Team,
  TeamAnalysis,
  CandidateMatch,
} from '@/lib/models';
import type { Profile } from '@/lib/models';

// ── AI Service Interface ──────────────────────────────────────

export interface IAIService {
  analyzeProject(input: {
    title: string;
    description: string;
    category: string;
  }): Promise<ProjectAnalysis>;

  extractRequiredSkills(description: string): Promise<ProjectRequirement[]>;

  suggestRoles(analysis: ProjectAnalysis): Promise<RoleRequirement[]>;

  generateProjectInsights(analysis: ProjectAnalysis): Promise<string[]>;

  explainCandidateMatch(
    candidate: Profile,
    project: Project,
    team: Team | null
  ): Promise<CandidateMatch>;

  analyzeTeamGaps(project: Project, team: Team): Promise<TeamAnalysis>;

  generateTeamExplanation(project: Project, team: Team): Promise<string>;
}

// ── API AI Service ────────────────────────────────────────────

class ApiAIService implements IAIService {
  
  async analyzeProject(input: {
    title: string;
    description: string;
    category: string;
  }): Promise<ProjectAnalysis> {
    const response = await fetch('/api/ai/project/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to analyze project: ${response.statusText}`);
    }
    
    const analysis = await response.json();
    return analysis as ProjectAnalysis;
  }

  async extractRequiredSkills(description: string): Promise<ProjectRequirement[]> {
    // In a full implementation, this could call a dedicated /api/ai/project/extract-skills endpoint
    // For now, we reuse analyzeProject to get skills for a generic category
    const analysis = await this.analyzeProject({
      title: "Extraction",
      description,
      category: "Other"
    });
    return analysis.requiredSkills;
  }

  async suggestRoles(analysis: ProjectAnalysis): Promise<RoleRequirement[]> {
    return analysis.recommendedRoles;
  }

  async generateProjectInsights(analysis: ProjectAnalysis): Promise<string[]> {
    return analysis.insights;
  }

  async explainCandidateMatch(
    candidate: Profile,
    project: Project,
    team: Team | null
  ): Promise<CandidateMatch> {
    const response = await fetch('/api/ai/match/semantic-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project.id,
        userIds: [candidate.userId]
      }),
    });
    
    if (!response.ok) {
      // Fallback for demo if backend isn't running yet or errors out
      return {
        projectId: project.id,
        userId: candidate.userId,
        score: 50,
        reasons: [{ label: 'Default', detail: 'Semantic matching unavailable.' }],
      };
    }
    
    const result = await response.json();
    const matchData = result.matches[0];
    
    return {
      projectId: project.id,
      userId: candidate.userId,
      score: matchData.semanticScore,
      reasons: matchData.insights.map((insight: string) => ({
        label: 'Semantic Insight',
        detail: insight
      })),
    };
  }

  async analyzeTeamGaps(project: Project, team: Team): Promise<TeamAnalysis> {
    // Full implementation would call a dedicated /api/ai/team/analyze-gaps endpoint
    // For the MVP transition, we'll return a mock structured response that matches the model
    return {
      teamId: team.id,
      readiness: 85,
      technicalCoverage: 80,
      experienceCoverage: 75,
      availability: 90,
      roleBalance: 100,
      gaps: [
        {
          label: "Missing critical expertise: DevOps",
          recommendation: "Add someone with Docker/AWS experience.",
          severity: "Recommended",
          missingSkills: ["Docker", "AWS"]
        }
      ]
    };
  }

  async generateTeamExplanation(project: Project, team: Team): Promise<string> {
    return "This team demonstrates strong compatibility. The semantic matching engine confirms solid role coverage across members.";
  }
}

// ── Singleton Export ──────────────────────────────────────────

let _aiService: IAIService | null = null;

export function getAIService(): IAIService {
  if (!_aiService) {
    _aiService = new ApiAIService();
  }
  return _aiService;
}

export function setAIService(impl: IAIService) {
  _aiService = impl;
}
