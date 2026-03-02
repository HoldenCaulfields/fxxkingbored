import { useState } from "react";
import { loginGoogle, logout as firebaseLogout } from "@/services/authgoogle";
import {
  saveUser,
  getUser,
} from "@/services/userProfile";
import { UserProfile } from "@/types/user";
import { useUserStore } from "@/store/useUserStore";

export function useAuthActions() {
  const [loading, setLoading] = useState(false);

  const updateProfile = useUserStore((s) => s.updateProfile);
  const currentProfile = useUserStore((s) => s.profile);

  // LOGIN
  const loginWithGoogle = async (modalData?: Partial<UserProfile>) => {
    setLoading(true);

    try {
      const user = await loginGoogle();
      if (!user) return null;

      // load existing cloud data
      const existing = await getUser(user.uid);

      const finalData: UserProfile = {
        ...currentProfile,
        ...existing,
        ...modalData,
        id: user.uid,
        name:
          modalData?.name ??
          existing?.name ??
          user.displayName ??
          "Người dùng mới",

        avatar:
          modalData?.avatar ??
          existing?.avatar ??
          user.photoURL ??
          "",

        customTags: existing?.customTags || [],
        history: existing?.history || [],
        isPinned: existing?.isPinned || false,
      };

      await saveUser(user.uid, finalData);
      updateProfile(finalData);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true);

    try {
      await firebaseLogout();

      // reset local profile
      updateProfile({ id: "me" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, logout, loading };
}