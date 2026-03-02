// ============================================================
// services/userProfile.ts
// ============================================================
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";
import { InterestItem, InterestSnapshot } from "@/types/category";

const userRef = (uid: string) => doc(db, "users", uid);

/** Strip undefined values so Firestore doesn't choke */
function clean<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

/**
 * Create or deep-merge a user profile.
 * Always stamps updatedAt; stamps createdAt only on first write.
 */
export async function saveUser(
  uid: string,
  data: Partial<UserProfile>
): Promise<boolean> {
  try {
    const ref = userRef(uid);
    const existing = await getDoc(ref);
    const payload = {
      ...clean(data),
      updatedAt: Date.now(),
      ...(existing.exists() ? {} : { createdAt: Date.now() }),
    };
    await setDoc(ref, payload, { merge: true });
    return true;
  } catch (error) {
    console.error("saveUser error:", error);
    return false;
  }
}

/**
 * Fetch a single user profile.
 */
export async function getUser(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(userRef(uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as UserProfile;
  } catch (error) {
    console.error("getUser error:", error);
    return null;
  }
}

/**
 * Patch only the interests field.
 * Falls back to a merge write if the doc doesn't exist yet.
 */
export async function updateUserInterests(
  uid: string,
  interests: InterestItem[]
): Promise<boolean> {
  try {
    await updateDoc(userRef(uid), { interests, updatedAt: Date.now() });
    return true;
  } catch {
    return saveUser(uid, { interests });
  }
}

/**
 * Append a snapshot using arrayUnion so concurrent writes
 * don't clobber each other. Falls back to merge write.
 */
export async function addUserSnapshot(
  uid: string,
  snapshot: InterestSnapshot
): Promise<boolean> {
  try {
    await updateDoc(userRef(uid), {
      history: arrayUnion(snapshot),
      updatedAt: Date.now(),
    });
    return true;
  } catch {
    return saveUser(uid, { history: [snapshot] });
  }
}

/**
 * Update visibility/anonymous flags only.
 */
export async function updateVisibility(
  uid: string,
  isVisible: boolean,
  isAnonymous: boolean
): Promise<boolean> {
  try {
    await updateDoc(userRef(uid), {
      isVisible,
      isAnonymous,
      updatedAt: Date.now(),
    });
    return true;
  } catch {
    return saveUser(uid, { isVisible, isAnonymous });
  }
}