// ============================================================
// Axon — Matching Engine (Sections 10–11 of spec)
// Pure functions, fully decoupled from UI.
// Implements weighted MatchScore composite and team optimization.
// ============================================================

import type {
  Profile,
  Project,
  ProjectAnalysis,
  Team,
  TeamMember,
  CandidateMatch,
  MatchReason,
  Proficiency,
  SkillTier,
} from '@/lib/models';

// ── Helpers ──────────────────────────────────────────────────

const proficiencyScore: Record<Proficiency, number> = {
  Beginner: 0.33,
  Intermediate: 0.67,
  Advanced: 1.0,
};

const tierWeight: Record<SkillTier, number> = {
  Critical: 3,
  Important: 2,
  Recommended: 1,
};

function clamp(val: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

// ── Sub-Score: Skill Match (30%) ─────────────────────────────
// Score how well the candidate's skills cover the project's required skills.

export function computeSkillMatch(
  profile: Profile,
  analysis: ProjectAnalysis
): number {
  if (!analysis.requiredSkills.length) return 0.5;

  let totalWeight = 0;
  let earned = 0;

  for (const req of analysis.requiredSkills) {
    const weight = tierWeight[req.tier];
    totalWeight += weight;

    const candidateSkill = profile.skills.find(
      s => s.name.toLowerCase() === req.skillName.toLowerCase()
    );

    if (candidateSkill) {
      const prof = proficiencyScore[candidateSkill.proficiency];
      // Advanced=1.0 (full), Intermediate=0.67 (partial), Beginner=0.33
      const scoreForSkill =
        prof >= 0.67
          ? 1.0
          : prof >= 0.33
          ? 0.5
          : 0;
      earned += weight * scoreForSkill;
    }
  }

  return totalWeight === 0 ? 0 : clamp(earned / totalWeight);
}

// ── Sub-Score: Experience Relevance (20%) ────────────────────
// Keyword/category overlap — structured for future embedding replacement.

export function computeExperienceRelevance(
  profile: Profile,
  project: Project,
  analysis: ProjectAnalysis
): number {
  const keywords = new Set<string>();

  // Add project category words
  project.category
    .toLowerCase()
    .split(/[\s/,]+/)
    .forEach(w => keywords.add(w));

  // Add required skill names
  analysis.requiredSkills.forEach(s =>
    s.skillName.toLowerCase().split(/\s+/).forEach(w => keywords.add(w))
  );

  if (!keywords.size) return 0.3;

  let matchCount = 0;
  let totalEntries = profile.experience.length;

  if (totalEntries === 0) return 0.1;

  for (const exp of profile.experience) {
    const text = `${exp.title} ${exp.description ?? ''}`.toLowerCase();
    let entryHit = false;
    for (const kw of keywords) {
      if (kw.length > 2 && text.includes(kw)) {
        entryHit = true;
        break;
      }
    }
    if (entryHit) matchCount++;
  }

  const ratio = matchCount / totalEntries;

  // Bonus for many experience entries
  const volumeBonus = Math.min(totalEntries / 5, 0.2);
  return clamp(ratio * 0.8 + volumeBonus);
}

// ── Sub-Score: Interest Alignment (15%) ──────────────────────

export function computeInterestAlignment(
  profile: Profile,
  project: Project,
  analysis: ProjectAnalysis
): number {
  const projectDomains = new Set<string>();
  project.category.toLowerCase().split(/[\s/,]+/).forEach(w => projectDomains.add(w));

  // Add insight-derived interests
  const roleKeywords = analysis.recommendedRoles
    .flatMap(r => r.keySkills)
    .map(s => s.toLowerCase());
  roleKeywords.forEach(kw => projectDomains.add(kw));

  if (!projectDomains.size) return 0.5;

  const candidateInterests = new Set(
    profile.interests.map(i => i.name.toLowerCase())
  );

  let overlap = 0;
  for (const domain of projectDomains) {
    for (const interest of candidateInterests) {
      if (interest.includes(domain) || domain.includes(interest)) {
        overlap++;
        break;
      }
    }
  }

  return clamp(overlap / Math.max(projectDomains.size, 1));
}

// ── Sub-Score: Availability Fit (15%) ────────────────────────

export function computeAvailabilityFit(
  profile: Profile,
  project: Project
): number {
  const required = project.requiredAvailabilityHours;
  const available = profile.availability.hoursPerWeek;

  if (available >= required) return 1.0;
  if (required === 0) return 1.0;

  // Linear taper to 0 as shortfall grows
  return clamp(available / required);
}

// ── Sub-Score: Complementary Value (20%) ─────────────────────
// Rewards filling skills/roles NOT covered by the existing team.

export function computeComplementaryValue(
  profile: Profile,
  analysis: ProjectAnalysis,
  currentTeam: { profile: Profile }[]
): number {
  if (!analysis.requiredSkills.length) return 0.5;

  // Skills already well-covered by current team
  const coveredSkills = new Set<string>();
  for (const member of currentTeam) {
    for (const skill of member.profile.skills) {
      if (proficiencyScore[skill.proficiency] >= 0.67) {
        coveredSkills.add(skill.name.toLowerCase());
      }
    }
  }

  let uncoveredWeight = 0;
  let filledByCandidate = 0;

  for (const req of analysis.requiredSkills) {
    const skillLower = req.skillName.toLowerCase();
    if (!coveredSkills.has(skillLower)) {
      const weight = tierWeight[req.tier];
      uncoveredWeight += weight;
      const candidateSkill = profile.skills.find(
        s => s.name.toLowerCase() === skillLower
      );
      if (candidateSkill && proficiencyScore[candidateSkill.proficiency] >= 0.33) {
        filledByCandidate += weight;
      }
    }
  }

  if (uncoveredWeight === 0) {
    // Everything is covered — still valuable, but lower complementary score
    return 0.4;
  }

  return clamp(filledByCandidate / uncoveredWeight);
}

// ── Composite Match Score (Sections 10) ──────────────────────

export interface MatchScoreBreakdown {
  overall: number;
  skillMatch: number;
  experienceRelevance: number;
  interestAlignment: number;
  availabilityFit: number;
  complementaryValue: number;
}

export function computeMatchScore(
  profile: Profile,
  project: Project,
  analysis: ProjectAnalysis,
  currentTeamProfiles: Profile[]
): MatchScoreBreakdown {
  const teamContext = currentTeamProfiles.map(p => ({ profile: p }));

  const skillMatch = computeSkillMatch(profile, analysis);
  const experienceRelevance = computeExperienceRelevance(profile, project, analysis);
  const interestAlignment = computeInterestAlignment(profile, project, analysis);
  const availabilityFit = computeAvailabilityFit(profile, project);
  const complementaryValue = computeComplementaryValue(profile, analysis, teamContext);

  const overall = clamp(
    0.30 * skillMatch +
    0.20 * experienceRelevance +
    0.15 * interestAlignment +
    0.15 * availabilityFit +
    0.20 * complementaryValue
  );

  return {
    overall: Math.round(overall * 100),
    skillMatch: Math.round(skillMatch * 100),
    experienceRelevance: Math.round(experienceRelevance * 100),
    interestAlignment: Math.round(interestAlignment * 100),
    availabilityFit: Math.round(availabilityFit * 100),
    complementaryValue: Math.round(complementaryValue * 100),
  };
}

// ── Match Explanation (Section 10) ───────────────────────────
// Converts score breakdown → 2-4 labeled reason strings.
// Never exposes raw formula or weights.

export function generateMatchReasons(
  breakdown: MatchScoreBreakdown,
  profile: Profile,
  project: Project,
  analysis: ProjectAnalysis
): MatchReason[] {
  const reasons: MatchReason[] = [];

  // Always pick the 2-4 highest sub-scores as the "dominant factors"
  const factors: { key: keyof typeof breakdown; label: string; threshold: number }[] = [
    { key: 'skillMatch', label: 'Skill Match', threshold: 60 },
    { key: 'experienceRelevance', label: 'Experience Relevance', threshold: 50 },
    { key: 'interestAlignment', label: 'Interest Alignment', threshold: 50 },
    { key: 'availabilityFit', label: 'Availability', threshold: 70 },
    { key: 'complementaryValue', label: 'Team Fit', threshold: 55 },
  ];

  for (const factor of factors) {
    const score = breakdown[factor.key] as number;
    if (score >= factor.threshold) {
      reasons.push(describeReason(factor.key, score, profile, project, analysis));
    }
  }

  // Ensure at least 2 reasons
  if (reasons.length < 2) {
    const sorted = [...factors].sort(
      (a, b) => (breakdown[b.key] as number) - (breakdown[a.key] as number)
    );
    for (const factor of sorted.slice(0, 2)) {
      if (!reasons.find(r => r.label.includes(factor.label))) {
        reasons.push(describeReason(factor.key, breakdown[factor.key] as number, profile, project, analysis));
      }
    }
  }

  return reasons.slice(0, 4);
}

function describeReason(
  key: string,
  score: number,
  profile: Profile,
  project: Project,
  analysis: ProjectAnalysis
): MatchReason {
  const quality = score >= 85 ? 'Excellent' : score >= 70 ? 'Strong' : score >= 55 ? 'Good' : 'Moderate';
  const topSkills = profile.skills
    .filter(s => s.proficiency !== 'Beginner')
    .slice(0, 2)
    .map(s => s.name)
    .join(' and ');

  switch (key) {
    case 'skillMatch':
      return {
        label: `${quality} skill match`,
        detail: `${topSkills ? `Strong experience in ${topSkills}` : 'Good skill coverage'} aligning with ${project.category} requirements.`,
      };
    case 'experienceRelevance':
      return {
        label: `Relevant experience`,
        detail: `${profile.experience.length} past project${profile.experience.length !== 1 ? 's' : ''} with experience directly applicable to this ${project.category} project.`,
      };
    case 'interestAlignment':
      const interests = profile.interests.slice(0, 2).map(i => i.name).join(' and ');
      return {
        label: `Aligned interests`,
        detail: `Shared passion for ${interests || project.category} matches this project's focus area.`,
      };
    case 'availabilityFit':
      return {
        label: `Availability compatible`,
        detail: `Available for approximately ${profile.availability.hoursPerWeek} hours weekly — ${
          profile.availability.hoursPerWeek >= project.requiredAvailabilityHours
            ? 'meets'
            : 'close to'
        } the project's ${project.requiredAvailabilityHours}h/week requirement.`,
      };
    case 'complementaryValue':
      const criticalSkill = analysis.requiredSkills.find(s => s.tier === 'Critical');
      return {
        label: `Complements your current team`,
        detail: `${criticalSkill ? `Provides ${criticalSkill.skillName} expertise` : 'Fills key skill gaps'} that strengthen the overall team composition.`,
      };
    default:
      return { label: 'Strong candidate', detail: 'Well-suited for this project.' };
  }
}

// ── Team Compatibility Score (Section 11) ────────────────────

export interface TeamCompatibility {
  overall: number;
  skillCoverage: number;
  availabilityCompatibility: number;
  roleCoverage: { filled: number; total: number };
}

export function computeTeamCompatibility(
  project: Project,
  analysis: ProjectAnalysis,
  memberProfiles: Profile[]
): TeamCompatibility {
  if (!memberProfiles.length) {
    return {
      overall: 0,
      skillCoverage: 0,
      availabilityCompatibility: 0,
      roleCoverage: { filled: 0, total: analysis.recommendedRoles.length },
    };
  }

  // Skill Coverage: fraction of required skills covered at ≥Intermediate by at least one member
  const requiredSkills = analysis.requiredSkills;
  let coveredCount = 0;
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const req of requiredSkills) {
    const weight = tierWeight[req.tier];
    totalWeight += weight;
    const covered = memberProfiles.some(p =>
      p.skills.some(
        s =>
          s.name.toLowerCase() === req.skillName.toLowerCase() &&
          proficiencyScore[s.proficiency] >= 0.33
      )
    );
    if (covered) {
      coveredCount++;
      earnedWeight += weight;
    }
  }

  const skillCoverage = totalWeight === 0 ? 80 : Math.round((earnedWeight / totalWeight) * 100);

  // Availability Compatibility: average availability fit
  const avgAvailability =
    memberProfiles.reduce((sum, p) => sum + computeAvailabilityFit(p, project), 0) /
    memberProfiles.length;
  const availabilityCompatibility = Math.round(avgAvailability * 100);

  // Role Coverage: estimate from team size vs recommended roles
  const total = analysis.recommendedRoles.length;
  const filled = Math.min(memberProfiles.length, total);
  const roleCoverage = { filled, total };

  // Overall: weighted average of sub-scores + role coverage bonus
  const roleCoveragePct = total === 0 ? 100 : (filled / total) * 100;
  const overall = Math.round(
    0.40 * skillCoverage +
    0.30 * availabilityCompatibility +
    0.30 * roleCoveragePct
  );

  return { overall, skillCoverage, availabilityCompatibility, roleCoverage };
}

// ── Optimal Team Selection (Section 11) ──────────────────────
// Greedy selection: fill highest-impact roles first.

export function selectOptimalTeam(
  project: Project,
  analysis: ProjectAnalysis,
  candidateProfiles: Profile[],
  targetSize: number
): Profile[] {
  const selected: Profile[] = [];
  const remaining = [...candidateProfiles];

  while (selected.length < targetSize && remaining.length > 0) {
    let bestIdx = 0;
    let bestScore = -1;

    for (let i = 0; i < remaining.length; i++) {
      const breakdown = computeMatchScore(
        remaining[i],
        project,
        analysis,
        selected
      );
      if (breakdown.overall > bestScore) {
        bestScore = breakdown.overall;
        bestIdx = i;
      }
    }

    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }

  return selected;
}

// ── Build Ranked Candidate Matches ───────────────────────────

export function buildCandidateMatches(
  project: Project,
  analysis: ProjectAnalysis,
  allProfiles: Profile[],
  currentTeamProfiles: Profile[]
): CandidateMatch[] {
  return allProfiles
    .map(profile => {
      const breakdown = computeMatchScore(
        profile,
        project,
        analysis,
        currentTeamProfiles
      );
      const reasons = generateMatchReasons(breakdown, profile, project, analysis);
      return {
        projectId: project.id,
        userId: profile.userId,
        score: breakdown.overall,
        reasons,
      } satisfies CandidateMatch;
    })
    .sort((a, b) => b.score - a.score);
}
