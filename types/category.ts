// ============================================================
// types/category.ts  —  single source of truth
// ============================================================

export type Category =
  | "music"
  | "film"
  | "book"
  | "language"
  | "game"
  | "dating"
  | "work"
  | "startup";

export type PersonaType = "fun" | "study";

export const CATEGORY_PERSONA: Record<Category, PersonaType> = {
  music: "fun",
  film: "fun",
  game: "fun",
  dating: "fun",
  book: "study",
  language: "study",
  work: "study",
  startup: "study",
};

export interface InterestItem {
  id: string;
  label: string;
  category: Category;
}

export interface InterestSnapshot {
  timestamp: number;
  interests: InterestItem[];
  customTags: string[];
}