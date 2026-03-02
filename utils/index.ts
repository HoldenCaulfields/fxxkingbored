// ============================================================
// utils/index.ts
// ============================================================
import { UserProfile, PersonaScore } from "@/types/user";

export function getPersonaLabel(score: PersonaScore): string {
  const { fun, study } = score;
  if (fun > 70) return "Vui nhộn";
  if (study > 70) return "Chăm chỉ";
  if (fun > study) return "Lively";
  if (study > fun) return "Serious";
  return "Balanced";
}

export function calculateCompatibility(score1: PersonaScore, score2: PersonaScore): number {
  const funDiff = Math.abs(score1.fun - score2.fun);
  const studyDiff = Math.abs(score1.study - score2.study);
  const avgDiff = (funDiff + studyDiff) / 2;
  return Math.max(0, 100 - avgDiff);
}

export function calculatePersonaScore(selectedOptions: string[]): PersonaScore {
  // Mock implementation - in production this would calculate based on actual categories
  return { fun: 50, study: 50 };
}

export function calculateDistance(loc1: [number, number], loc2: [number, number]): number {
  const [lat1, lng1] = loc1;
  const [lat2, lng2] = loc2;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
