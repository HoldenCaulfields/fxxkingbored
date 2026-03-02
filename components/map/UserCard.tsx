"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Heart, MessageCircle, UserPlus, UserCheck,
  Instagram, Youtube, Facebook, Zap
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { CATEGORY_CONFIG } from "@/config/categories";
import { computeMatchScore, getPersonaPercentFromCategories } from "@/utils/persona";
import { useUserStore } from "@/store/useUserStore";

type ConnState = "none" | "pending" | "connected";
type Props = {
  user: UserProfile | null;
  onClose: () => void;
  onConnect?: (u: UserProfile) => Promise<void>;
  onMessage?: (u: UserProfile) => void;
};

export default function UserCard({ user, onClose, onConnect, onMessage }: Props) {
  const myProfile = useUserStore(s => s.profile);
  const [connState, setConnState] = useState<ConnState>("none");
  const [liked, setLiked] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const matchScore = useMemo(
    () => user ? computeMatchScore(myProfile, user) : 0,
    [user?.id, myProfile.categories, myProfile.interests]
  );
  const { funPercent } = useMemo(
    () => user ? getPersonaPercentFromCategories(user.categories ?? []) : { funPercent: 50 },
    [user?.categories]
  );
  const sharedCats = useMemo(
    () => (user?.categories ?? []).filter(c => myProfile.categories.includes(c)),
    [user?.categories, myProfile.categories]
  );
  const sharedInterests = useMemo(
    () => (user?.interests ?? []).filter(i => myProfile.interests.some(mi => mi.id === i.id)),
    [user?.interests, myProfile.interests]
  );

  const accentColor = funPercent >= 50 ? "#f43f5e" : "#3b82f6";
  const matchColor = matchScore >= 70 ? "#22c55e" : matchScore >= 40 ? "#f59e0b" : "#94a3b8";

  const socials = useMemo(() => {
    if (!user?.socialLinks) return [];
    const { instagram, tiktok, facebook, youtube, zalo } = user.socialLinks;
    return [
      instagram && { href: `https://instagram.com/${instagram}`, icon: <Instagram size={13} />, label: "IG",     color: "#e1306c" },
      tiktok    && { href: `https://tiktok.com/@${tiktok}`,      icon: <span className="text-xs">🎵</span>,      label: "TikTok", color: "#69c9d0" },
      facebook  && { href: facebook,                              icon: <Facebook size={13} />,                  label: "FB",     color: "#1877f2" },
      youtube   && { href: youtube,                               icon: <Youtube size={13} />,                   label: "YT",     color: "#ff0000" },
      zalo      && { href: `https://zalo.me/${zalo}`,             icon: <span className="text-xs">💬</span>,      label: "Zalo",   color: "#0068ff" },
    ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string; color: string }[];
  }, [user?.socialLinks]);

  const handleConnect = async () => {
    if (!user || connState !== "none") return;
    setConnState("pending");
    try { await onConnect?.(user); setConnState("connected"); }
    catch { setConnState("none"); }
  };

  return (
    <AnimatePresence>
      {user && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[6000]"
            style={{ background: "rgba(15,23,42,0.25)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 inset-x-0 z-[6000] sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 bg-white"
            style={{ borderRadius: "24px 24px 0 0", boxShadow: "0 -4px 40px rgba(0,0,0,0.12)" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            drag="y" dragConstraints={{ top: 0 }} dragElastic={0.08}
            onDragEnd={(_, info) => { if (info.offset.y > 110) onClose(); }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "#e2e8f0" }} />
            </div>
            <button onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#f1f5f9" }}>
              <X size={14} style={{ color: "#64748b" }} />
            </button>

            {/* Hero */}
            <div className="px-5 pt-2 pb-4"
              style={{ background: `linear-gradient(160deg, ${accentColor}06 0%, transparent 100%)`, borderBottom: "1px solid #f1f5f9" }}>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden"
                    style={{ boxShadow: `0 4px 16px ${accentColor}30` }}>
                    <img src={user.avatar || "/tet.jpg"} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-slate-900 text-[17px] leading-tight truncate">{user.name}</h3>
                    {matchScore >= 80 && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[8px] font-bold"
                        style={{ background: "#fef3c7", color: "#b45309" }}>
                        <Zap size={8} />HOT MATCH
                      </span>
                    )}
                  </div>
                  {user.currentMood && (
                    <p className="text-[11px] italic mt-0.5" style={{ color: "#7c3aed" }}>✨ {user.currentMood}</p>
                  )}
                  {user.bio && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{user.bio}</p>
                  )}
                  {/* Persona slider */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] text-rose-500 font-bold shrink-0">{funPercent}%🔴</span>
                    <div className="relative flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                      <div className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(to right, #f43f5e, #fb923c 50%, #3b82f6)" }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow"
                        style={{ left: `calc(${funPercent}% - 5px)` }} />
                    </div>
                    <span className="text-[9px] text-blue-500 font-bold shrink-0">📚{100 - funPercent}%</span>
                  </div>
                </div>

                {/* Match bubble */}
                <div className="shrink-0 flex flex-col items-center gap-0.5 mr-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[15px] font-bold"
                    style={{ background: matchColor + "15", color: matchColor }}>
                    {matchScore}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Match</span>
                </div>
              </div>

              {/* Shared categories */}
              {sharedCats.length > 0 && (
                <div className="mt-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    ⚡ {sharedCats.length} lĩnh vực chung
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {sharedCats.map((catId, i) => {
                      const cfg = CATEGORY_CONFIG.find(c => c.id === catId);
                      return (
                        <motion.span key={catId}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold"
                          style={{
                            background: (cfg?.color ?? "#888") + "12",
                            color: cfg?.color ?? "#888",
                            border: `1px solid ${cfg?.color ?? "#888"}22`,
                          }}>
                          {cfg?.icon} {cfg?.label}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-5 pt-4 pb-7 space-y-4">
              {/* Shared interests */}
              {sharedInterests.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Cùng thích ({sharedInterests.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sharedInterests.slice(0, 8).map(interest => {
                      const cfg = CATEGORY_CONFIG.find(c => c.id === interest.category);
                      return (
                        <span key={interest.id}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-xl"
                          style={{
                            background: (cfg?.color ?? "#888") + "10",
                            color: cfg?.color ?? "#888",
                            border: `1px solid ${cfg?.color ?? "#888"}18`,
                          }}>
                          {interest.label}
                        </span>
                      );
                    })}
                    {sharedInterests.length > 8 && (
                      <span className="text-[10px] text-slate-400 font-bold px-2.5 py-1 rounded-xl"
                        style={{ background: "#f8fafc", border: "1px solid #eef2f7" }}>
                        +{sharedInterests.length - 8} nữa
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Social links */}
              {socials.length > 0 && (
                <div className="flex gap-2.5">
                  {socials.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 group transition-transform hover:scale-105">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: s.color + "12", color: s.color, border: `1px solid ${s.color}22` }}>
                        {s.icon}
                      </div>
                      <span className="text-[8px] font-semibold" style={{ color: s.color + "99" }}>{s.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {/* Like */}
                <button
                  onClick={() => { setLiked(true); setHeartPop(true); setTimeout(() => setHeartPop(false), 600); }}
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-90"
                  style={{ background: liked ? "#fff1f3" : "#f8fafc", border: `1.5px solid ${liked ? "#fecdd3" : "#eef2f7"}` }}
                >
                  <Heart size={17} style={{ color: liked ? "#f43f5e" : "#94a3b8", fill: liked ? "#f43f5e" : "none" }} />
                  <AnimatePresence>
                    {heartPop && (
                      <motion.span className="absolute -top-6 text-base pointer-events-none"
                        initial={{ y: 0, opacity: 1 }} animate={{ y: -16, opacity: 0 }} transition={{ duration: 0.4 }}>
                        ❤️
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Message */}
                <button
                  onClick={() => user && onMessage?.(user)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
                  style={{ background: "#0f172a", color: "white" }}
                >
                  <MessageCircle size={15} />Nhắn tin
                </button>

                {/* Connect */}
                <button
                  onClick={handleConnect}
                  disabled={connState === "pending"}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-60"
                  style={connState === "connected"
                    ? { background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #bbf7d0" }
                    : connState === "pending"
                    ? { background: "#f8fafc", color: "#94a3b8" }
                    : { background: accentColor, color: "white", boxShadow: `0 4px 14px ${accentColor}30` }}
                >
                  {connState === "connected"
                    ? <><UserCheck size={15} />Đã kết nối</>
                    : connState === "pending"
                    ? <><div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />Đang gửi…</>
                    : <><UserPlus size={15} />Kết nối</>}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
