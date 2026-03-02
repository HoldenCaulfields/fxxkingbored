"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { useProfiles } from "@/hooks/useProfiles2";
import { CATEGORY_CONFIG } from "@/config/categories";
import { computeMatchScore, getPersonaPercentFromCategories } from "@/utils/persona";
import { Category } from "@/types/category";
import { Users, Zap, ChevronDown, Eye, EyeOff } from "lucide-react";

function LiveDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inset-0 rounded-full opacity-50" style={{ background: color }} />
      <span className="relative rounded-full h-2 w-2" style={{ background: color }} />
    </span>
  );
}

export default function TopStatsBar() {
  const myProfile = useUserStore(s => s.profile);
  const updateProfile = useUserStore(s => s.updateProfile);
  const nearby = useProfiles(200);
  const [open, setOpen] = useState(false);

  const isVisible = myProfile.isVisible ?? true;
  const isAnonymous = myProfile.isAnonymous ?? false;

  const activeCats = useMemo(
    () => Array.from(new Set(myProfile.categories)) as Category[],
    [myProfile.categories]
  );

  // Only count visible users
  const matchUsers = useMemo(
    () => nearby.filter(p => (p.isVisible ?? true) && p.categories?.some(c => myProfile.categories.includes(c))).length,
    [nearby, myProfile.categories]
  );

  const topMatch = useMemo(() => {
    if (!nearby.length) return null;
    // Filter visible users
    const visibleNearby = nearby.filter(p => p.isVisible ?? true);
    if (!visibleNearby.length) return null;
    return visibleNearby.reduce((best, p) =>
      computeMatchScore(myProfile, p) > computeMatchScore(myProfile, best) ? p : best,
      visibleNearby[0]
    );
  }, [nearby, myProfile]);

  const topMatchScore = topMatch ? computeMatchScore(myProfile, topMatch) : 0;
  const avgMatchPct = useMemo(() => {
    if (!myProfile.categories.length) return 0;
    const visibleNearby = nearby.filter(p => p.isVisible ?? true);
    if (!visibleNearby.length) return 0;
    const scores = visibleNearby.map(p => computeMatchScore(myProfile, p));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [nearby, myProfile]);

  const { funPercent } = useMemo(() =>
    getPersonaPercentFromCategories(myProfile.categories), [myProfile.categories]
  );
  const matchColor = avgMatchPct >= 70 ? "#22c55e" : avgMatchPct >= 40 ? "#f59e0b" : "#94a3b8";

  // Visibility status styling
  const visibilityColor = !isVisible ? "#ef4444" : isAnonymous ? "#a78bfa" : "#22c55e";
  const visibilityBg = !isVisible ? "#fef2f2" : isAnonymous ? "#faf5ff" : "#f0fdf4";
  const visibilityText = !isVisible ? "Ẩn khỏi bản đồ" : isAnonymous ? "Ẩn danh" : "Hiển thị";
  const visibilityIcon = !isVisible ? "🚫" : isAnonymous ? "🎭" : "✅";

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[3000] w-[calc(100%-1.5rem)] max-w-[360px]">
      {/* ── Pill bar ── */}
      <motion.button
        layout
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center rounded-2xl overflow-hidden select-none cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.85)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Visibility Status - New indicator */}
        <div className="flex flex-col items-center px-3 py-2.5 min-w-[60px] border-r border-slate-100">
          <div className="flex items-center gap-1">
            <span className="text-base">{visibilityIcon}</span>
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: visibilityColor }}>
              {visibilityText}
            </span>
          </div>
        </div>

        {/* Vibers count */}
        <div className="flex flex-col items-center px-3.5 py-2.5 min-w-[54px]">
          <div className="flex items-center gap-1.5">
            <LiveDot color="#22c55e" />
            <span className="text-[15px] font-bold text-slate-800 tabular-nums leading-none">{matchUsers}</span>
          </div>
          <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Online</span>
        </div>

        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />

        {/* Category chips */}
        <div className="flex-1 flex items-center justify-center gap-1 px-2 py-2.5 min-h-[44px] flex-wrap">
          {activeCats.length === 0
            ? <span className="text-[10px] text-slate-300 font-medium italic">Chọn sở thích bên dưới…</span>
            : activeCats.slice(0, 7).map(catId => {
                const cfg = CATEGORY_CONFIG.find(c => c.id === catId);
                return (
                  <span key={catId} className="text-[15px] leading-none" title={cfg?.label}>
                    {cfg?.icon}
                  </span>
                );
              })
          }
          {activeCats.length > 7 && (
            <span className="text-[9px] text-slate-400 font-bold">+{activeCats.length - 7}</span>
          )}
        </div>

        <div className="w-px self-stretch" style={{ background: "var(--border)" }} />

        {/* Match % */}
        <div className="flex flex-col items-center px-3.5 py-2.5 min-w-[52px]">
          <div className="flex items-center gap-0.5">
            <Zap size={10} style={{ color: matchColor }} />
            <span className="text-[15px] font-bold tabular-nums leading-none" style={{ color: matchColor }}>
              {avgMatchPct}%
            </span>
          </div>
          <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Match</span>
        </div>

        <span className="pr-2.5 pl-0.5">
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="block">
            <ChevronDown size={13} className="text-slate-400" />
          </motion.span>
        </span>
      </motion.button>

      {/* ── Dropdown panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mt-1 rounded-2xl p-4 space-y-3"
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Người dùng", val: nearby.length, color: "#3b82f6", icon: "👥" },
                { label: "Cùng vibe",  val: matchUsers,    color: "#22c55e", icon: "⚡" },
                { label: "Best match", val: topMatchScore, color: "#f59e0b", icon: "🏆", suffix: "%" },
              ].map(s => (
                <div key={s.label}
                  className="rounded-xl p-2 text-center"
                  style={{ background: s.color + "0e", border: `1.5px solid ${s.color}18` }}
                >
                  <p className="text-base mb-0.5">{s.icon}</p>
                  <p className="text-[15px] font-bold text-slate-800">{s.val}{s.suffix ?? ""}</p>
                  <p className="text-[8px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Top match preview */}
            {topMatch && topMatchScore > 0 && (
              <div className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
                <img src={topMatch.avatar || "/tet.jpg"}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 ring-2 ring-amber-300/60"
                  alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 truncate">{topMatch.name}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {(topMatch.categories ?? []).slice(0, 4)
                      .map(c => CATEGORY_CONFIG.find(x => x.id === c)?.icon).join(" ")}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: "#fef3c7", color: "#b45309" }}>
                  {topMatchScore}%
                </span>
              </div>
            )}

            {/* Persona bar */}
            <div className="rounded-xl p-3" style={{ background: "#f8fafc", border: "1.5px solid #eef2f7" }}>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Persona của bạn</p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-rose-500 font-bold shrink-0">🔴 {funPercent}%</span>
                <div className="relative flex-1 h-2 rounded-full overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(to right, #f43f5e, #fb923c 50%, #3b82f6)" }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2 border-white"
                    style={{ left: `calc(${funPercent}% - 6px)` }} />
                </div>
                <span className="text-[9px] text-blue-500 font-bold shrink-0">{100 - funPercent}% 📚</span>
              </div>
            </div>

            {/* Visibility toggle */}
            <button
              onClick={e => { e.stopPropagation(); updateProfile({ isVisible: !isVisible }); }}
              className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all"
              style={isVisible
                ? { background: "#f0fdf4", border: "1.5px solid #bbf7d0" }
                : { background: "#fef2f2", border: "1.5px solid #fecdd3" }}
            >
              <div className="flex items-center gap-2">
                {isVisible
                  ? <Eye size={14} style={{ color: "#22c55e" }} />
                  : <EyeOff size={14} style={{ color: "#ef4444" }} />}
                <span className="text-[11px] font-semibold" style={{ color: isVisible ? "#15803d" : "#991b1b" }}>
                  {isVisible ? "✅ Hiển thị trên bản đồ" : "❌ Ẩn khỏi bản đồ"}
                </span>
              </div>
              <div className="relative w-9 h-5 rounded-full transition-colors"
                style={{ background: isVisible ? "#22c55e" : "#ef4444" }}>
                <motion.div
                  animate={{ x: isVisible ? 17 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </button>

            {/* Anonymous toggle */}
            <button
              onClick={e => { e.stopPropagation(); updateProfile({ isAnonymous: !isAnonymous }); }}
              className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all"
              style={isAnonymous
                ? { background: "#faf5ff", border: "1.5px solid #e9d5ff" }
                : { background: "#f8fafc", border: "1.5px solid #eef2f7" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{isAnonymous ? "🎭" : "👤"}</span>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-semibold" style={{ color: isAnonymous ? "#7c3aed" : "#64748b" }}>
                    {isAnonymous ? "Ẩn danh - Tên & ảnh ẩn" : "Hiển thị tên & ảnh"}
                  </span>
                  <span className="text-[8px] text-slate-400">Người khác chỉ thấy vibe của bạn</span>
                </div>
              </div>
              <div className="relative w-9 h-5 rounded-full transition-colors"
                style={{ background: isAnonymous ? "#a78bfa" : "#cbd5e1" }}>
                <motion.div
                  animate={{ x: isAnonymous ? 17 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </button>

            {/* Pinned toggle */}
            <button
              onClick={e => { e.stopPropagation(); updateProfile({ isPinned: !myProfile.isPinned }); }}
              disabled={!myProfile.location}
              className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all disabled:opacity-50"
              style={myProfile.isPinned
                ? { background: "#fffbeb", border: "1.5px solid #fde68a" }
                : { background: "#f8fafc", border: "1.5px solid #eef2f7" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{myProfile.isPinned ? "📌" : "📍"}</span>
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-semibold" style={{ color: myProfile.isPinned ? "#b45309" : "#64748b" }}>
                    {myProfile.isPinned ? "Vị trí cố định" : "Vị trí động"}
                  </span>
                  <span className="text-[8px] text-slate-400">{myProfile.isPinned ? "Marker sẽ đứng yên" : "Marker cập nhật theo GPS"}</span>
                </div>
              </div>
              <div className="relative w-9 h-5 rounded-full transition-colors"
                style={{ background: myProfile.isPinned ? "#f59e0b" : "#cbd5e1" }}>
                <motion.div
                  animate={{ x: myProfile.isPinned ? 17 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
