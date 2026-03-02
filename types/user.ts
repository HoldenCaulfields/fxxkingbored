// ============================================================
// types/user.ts
// ============================================================
import { Category, InterestItem, InterestSnapshot } from "./category";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  zalo?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  location?: [number, number]; // [lat, lng]
  categories: Category[];
  interests: InterestItem[];
  customTags: string[];
  history: InterestSnapshot[];
  isPinned: boolean;
  currentMood?: string;
  socialLinks?: SocialLinks;
  // ── Visibility ──────────────────────────────────────────
  isVisible?: boolean;    // show/hide on map (default: true)
  isAnonymous?: boolean;  // hide name+avatar, show vibe only
  // ── Meta ────────────────────────────────────────────────
  updatedAt?: number;     // ms timestamp, set on every save
  createdAt?: number;     // ms timestamp, set on first save
}

export const DEFAULT_PROFILE: UserProfile = {
  id: "me",
  name: "Người dùng mới",
  avatar: "",
  categories: [],
  interests: [],
  customTags: [],
  history: [],
  isPinned: false,
  isVisible: true,
  isAnonymous: false,
};