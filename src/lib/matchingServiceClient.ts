// Client-safe re-export of matchingService
// This module can be dynamically imported on the client side
export {
  computeMatchScore,
  buildCandidateMatches,
  computeTeamCompatibility,
  selectOptimalTeam,
  generateMatchReasons,
} from '@/lib/matchingService';
