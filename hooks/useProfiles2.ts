// ============================================================
// hooks/useProfiles.ts  —  real-time Firestore listener
// ============================================================
"use client";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  limit,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";
import { useUserStore } from "@/store/useUserStore";

/**
 * Subscribes to public, visible user profiles in real time.
 *
 * Strategy:
 *  - If the user has selected categories → filter by array-contains-any
 *    (max 10 values, Firestore limit)
 *  - Always exclude the current user and hidden/anonymous profiles
 *    from the rendered list (client-side, no compound index needed)
 *  - Debounces re-subscription by 400 ms to avoid thrashing on
 *    rapid category toggles
 */
export function useProfiles(maxResults = 100): UserProfile[] {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const myId         = useUserStore((s) => s.profile.id);
  const myCategories = useUserStore((s) => s.profile.categories);

  // Stable string key to detect real category changes
  const categoryKey = myCategories.slice().sort().join(",");
  const unsubRef    = useRef<(() => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounce: wait 400 ms after last change before re-subscribing
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      // Clean up previous listener
      unsubRef.current?.();

      const colRef = collection(db, "users");
      const constraints: QueryConstraint[] = [];

      if (myCategories.length > 0) {
        constraints.push(
          where("categories", "array-contains-any", myCategories.slice(0, 10))
        );
      }

      // Only fetch users who want to be visible
      constraints.push(where("isVisible", "!=", false));
      constraints.push(limit(maxResults));

      const q = query(colRef, ...constraints);

      unsubRef.current = onSnapshot(
        q,
        (snap) => {
          const docs = snap.docs
            .map((d) => ({ id: d.id, ...d.data() } as UserProfile))
            .filter((p) => p.id !== myId); // exclude self
          setProfiles(docs);
        },
        (err) => {
          // "isVisible != false" requires a Firestore index.
          // Fall back to unfiltered query and filter client-side.
          if (err.code === "failed-precondition") {
            console.warn(
              "useProfiles: missing Firestore index for isVisible filter — falling back to client filter"
            );
            const fallbackQ = query(
              colRef,
              ...(myCategories.length > 0
                ? [where("categories", "array-contains-any", myCategories.slice(0, 10))]
                : []),
              limit(maxResults)
            );
            unsubRef.current = onSnapshot(fallbackQ, (snap) => {
              const docs = snap.docs
                .map((d) => ({ id: d.id, ...d.data() } as UserProfile))
                .filter((p) => p.id !== myId && p.isVisible !== false);
              setProfiles(docs);
            });
          } else {
            console.error("useProfiles error:", err);
          }
        }
      );
    }, 400);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      unsubRef.current?.();
    };
  }, [myId, categoryKey, maxResults]);

  return profiles;
}