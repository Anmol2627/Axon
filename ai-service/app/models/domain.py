from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ProjectRequirement(BaseModel):
    projectId: str
    skillName: str
    tier: Literal['Critical', 'Important', 'Recommended']

class RoleRequirement(BaseModel):
    projectId: str
    title: str
    responsibilities: List[str]
    keySkills: List[str]

class ProjectRisk(BaseModel):
    label: str
    severity: Literal['Amber', 'Red']

class ProjectWorkflowPhase(BaseModel):
    phase: str
    description: str

class ProjectAnalysis(BaseModel):
    projectId: str
    complexity: Literal['Low', 'Medium', 'Medium-High', 'High']
    recommendedTeamSize: int
    recommendedRoles: List[RoleRequirement]
    requiredSkills: List[ProjectRequirement]
    insights: List[str]
    risks: List[ProjectRisk]
    recommendedWorkflow: Optional[List[ProjectWorkflowPhase]] = None

class MatchReason(BaseModel):
    label: str
    detail: str

class CandidateMatch(BaseModel):
    projectId: str
    userId: str
    score: int
    reasons: List[MatchReason]

class TeamGap(BaseModel):
    label: str
    recommendation: str
    severity: Literal['Recommended', 'Critical']
    missingSkills: List[str]

class TeamAnalysis(BaseModel):
    teamId: str
    readiness: int
    technicalCoverage: int
    experienceCoverage: int
    availability: int
    roleBalance: int
    gaps: List[TeamGap]

class SkillExtraction(BaseModel):
    name: str
    proficiency: Literal['Beginner', 'Intermediate', 'Advanced', 'Expert']
    confidence: float

class ResumeExtractionResponse(BaseModel):
    personalInfo: dict
    links: Optional[dict] = None
    skills: List[SkillExtraction]
    experience: List[dict]
    education: Optional[List[dict]] = None
    projects: List[dict]
    domains: List[str]
    suggestedRoles: List[str]
    extractionMetadata: dict

class MatchInsight(BaseModel):
    userId: str
    semanticScore: int
    insights: List[str]

class SemanticMatchResponse(BaseModel):
    matches: List[MatchInsight]

