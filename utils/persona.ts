// ============================================================
// utils/persona.ts
// ============================================================
import { Category, CATEGORY_PERSONA } from "@/types/category";
import { UserProfile } from "@/types/user";

export function getPersonaPercentFromCategories(categories?: Category[]) {
  const cats = categories ?? [];
  if (cats.length === 0) return { funPercent: 50, studyPercent: 50 };

  const fun = cats.filter((c) => CATEGORY_PERSONA[c] === "fun").length;
  const funPercent = Math.round((fun / cats.length) * 100);
  return { funPercent, studyPercent: 100 - funPercent };
}

/**
 * Compute a 0–100 match score between two profiles.
 * Weights: categories 50% + interests 35% + mood bonus 15%
 */
export function computeMatchScore(a: UserProfile, b: UserProfile): number {
  const catScore = jaccardScore(a.categories ?? [], b.categories ?? []);
  const intScore = jaccardScore(
    (a.interests ?? []).map((i) => i.id),
    (b.interests ?? []).map((i) => i.id)
  );

  // Small mood bonus: same mood = +15 pts (capped at 100)
  const moodBonus =
    a.currentMood && b.currentMood && a.currentMood === b.currentMood ? 15 : 0;

  return Math.min(
    100,
    Math.round(catScore * 50 + intScore * 35 + moodBonus)
  );
}

/**
 * Return top-N profiles sorted by match score descending.
 */
export function getTopMatches(
  me: UserProfile,
  others: UserProfile[],
  n = 5
): Array<{ profile: UserProfile; score: number }> {
  return others
    .map((p) => ({ profile: p, score: computeMatchScore(me, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

function jaccardScore<T>(a: T[], b: T[]): number {
  if (!a.length && !b.length) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}