// ============================================================
// store/useUserStore.ts
// ============================================================
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { UserProfile, DEFAULT_PROFILE } from "@/types/user";
import { Category, InterestSnapshot } from "@/types/category";
import { saveUser } from "@/services/userProfile";

interface UserStore {
  profile: UserProfile;

  /** Merge partial data into the profile */
  updateProfile: (data: Partial<UserProfile>) => void;

  /** Toggle a category on/off */
  toggleCategory: (cat: Category) => void;

  /**
   * Save the current vibe as a history snapshot.
   * Call this whenever interests/categories change meaningfully.
   */
  saveSnapshot: () => void;

  /** Write the full profile to Firestore (skips guest accounts) */
  syncToCloud: () => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        profile: DEFAULT_PROFILE,

        // ── updateProfile ──────────────────────────────────
        updateProfile: (data) =>
          set((state) => ({
            profile: { ...state.profile, ...data },
          })),

        // ── toggleCategory ─────────────────────────────────
        toggleCategory: (cat) =>
          set((state) => {
            const current = state.profile.categories;
            const next = current.includes(cat)
              ? current.filter((c) => c !== cat)
              : [...current, cat];
            return { profile: { ...state.profile, categories: next } };
          }),

        // ── saveSnapshot ───────────────────────────────────
        saveSnapshot: () =>
          set((state) => {
            const { interests, customTags, history } = state.profile;

            // Don't save empty snapshots
            if (!interests.length && !customTags.length) return state;

            const snapshot: InterestSnapshot = {
              timestamp: Date.now(),
              interests,
              customTags,
            };

            // Keep last 50 snapshots only
            const trimmed = [snapshot, ...history].slice(0, 50);
            return { profile: { ...state.profile, history: trimmed } };
          }),

        // ── syncToCloud ────────────────────────────────────
        syncToCloud: async () => {
          const { profile } = get();
          // Skip guests
          if (!profile.id || profile.id === "me") return;
          try {
            await saveUser(profile.id, {
              ...profile,
              updatedAt: Date.now(),
            });
          } catch (e) {
            console.error("syncToCloud error:", e);
          }
        },
      }),
      {
        name: "user-profile-v2", // bumped version to avoid stale cache
        // Persist only what's safe to keep locally
        partialize: (state) => ({
          profile: {
            id:          state.profile.id,
            name:        state.profile.name,
            avatar:      state.profile.avatar,
            bio:         state.profile.bio,
            categories:  state.profile.categories,
            interests:   state.profile.interests,
            customTags:  state.profile.customTags,
            isPinned:    state.profile.isPinned,
            isVisible:   state.profile.isVisible,
            isAnonymous: state.profile.isAnonymous,
            currentMood: state.profile.currentMood,
            socialLinks: state.profile.socialLinks,
            // history intentionally omitted — loaded from Firestore
          },
        }),
      }
    )
  )
);