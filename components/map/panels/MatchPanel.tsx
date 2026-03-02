"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, UserPlus, MessageCircle } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles2";
import { useUserStore } from "@/store/useUserStore";
import { computeMatchScore, getPersonaPercentFromCategories } from "@/utils/persona";
import { CATEGORY_CONFIG } from "@/config/categories";
import { UserProfile } from "@/types/user";
import { Category } from "@/types/category";
import { sendConnection } from "@/services/social";
import ChatScreen from "@/components/chat/ChatScreen";

const THRESHOLDS = [
  { label: "Tất cả", min: 0,  color: "#94a3b8" },
  { label: "≥ 40%",  min: 40, color: "#f59e0b" },
  { label: "≥ 70%",  min: 70, color: "#22c55e" },
  { label: "🔥 ≥90%",min: 90, color: "#f43f5e" },
];

function MatchCard({ user, score, onConnect, onMessage }: {
  user: UserProfile; score: number;
  onConnect: () => void; onMessage: () => void;
}) {
  const { funPercent } = getPersonaPercentFromCategories(user.categories ?? []);
  const matchColor = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#94a3b8";
  const accent = funPercent >= 50 ? "#f43f5e" : "#3b82f6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid #f1f5f9", boxShadow: "var(--shadow-xs)" }}
    >
      <div className="h-1 bg-slate-50">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: matchColor }} />
      </div>
      <div className="p-3.5 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden"
            style={{ border: `2px solid ${accent}18` }}>
            <img src={user.avatar || "/tet.jpg"} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl flex items-center justify-center text-white text-[9px] font-bold border-2 border-white"
            style={{ background: matchColor }}>
            {score}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
            {score >= 90 && (
              <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-bold"
                style={{ background: "#fff1f3", color: "#f43f5e" }}>🔥HOT</span>
            )}
          </div>
          {user.currentMood && (
            <p className="text-[10px] italic mb-1" style={{ color: "#7c3aed" }}>{user.currentMood}</p>
          )}
          <div className="flex gap-1 flex-wrap">
            {(user.categories ?? []).slice(0, 4).map(catId => {
              const cfg = CATEGORY_CONFIG.find(c => c.id === catId);
              return (
                <span key={catId} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-lg"
                  style={{ background: (cfg?.color ?? "#888") + "12", color: cfg?.color ?? "#888" }}>
                  {cfg?.icon} {cfg?.label}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button onClick={onMessage}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: "#0f172a", color: "white" }}>
            <MessageCircle size={13} />
          </button>
          <button onClick={onConnect}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: accent + "12", color: accent }}>
            <UserPlus size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MatchPanel({ onClose }: { onClose: () => void }) {
  const my = useUserStore(s => s.profile);
  const all = useProfiles(200);
  const [minScore, setMinScore] = useState(0);
  const [catFilter, setCatFilter] = useState<Category | null>(null);
  const [chatPeer, setChatPeer] = useState<UserProfile | null>(null);

  const scored = useMemo(() =>
    all
      .map(p => ({ user: p, score: computeMatchScore(my, p) }))
      .filter(({ score }) => score >= minScore)
      .filter(({ user }) => !catFilter || (user.categories ?? []).includes(catFilter))
      .sort((a, b) => b.score - a.score),
    [all, my, minScore, catFilter]
  );

  const avg = scored.length
    ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : 0;
  const matchColor = avg >= 70 ? "#22c55e" : avg >= 40 ? "#f59e0b" : "#94a3b8";

  const handleConnect = async (user: UserProfile) => {
    if (!my.id || my.id === "me") return;
    await sendConnection(my.id, user.id);
  };

  return (
    <>
      <motion.div
        className="absolute inset-0 z-[2500] flex flex-col"
        style={{ background: "var(--bg)" }}
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-4 pt-14 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap size={18} style={{ color: "#22c55e" }} />Tìm Match
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {scored.length} người · avg
                <span className="font-bold ml-1" style={{ color: matchColor }}>{avg}%</span>
              </p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#f1f5f9" }}>
              <X size={16} style={{ color: "#64748b" }} />
            </button>
          </div>

          {/* Threshold */}
          <div className="flex gap-1.5 mb-3">
            {THRESHOLDS.map(t => (
              <button key={t.label} onClick={() => setMinScore(t.min)}
                className="flex-1 py-2 rounded-xl text-[9px] font-semibold transition-all"
                style={minScore === t.min
                  ? { background: t.color + "15", color: t.color, border: `1.5px solid ${t.color}30` }
                  : { background: "#f8fafc", color: "#94a3b8", border: "1.5px solid #eef2f7" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            <button onClick={() => setCatFilter(null)}
              className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
              style={!catFilter
                ? { background: "#0f172a", color: "white" }
                : { background: "#f8fafc", color: "#94a3b8", border: "1px solid #eef2f7" }}>
              Tất cả
            </button>
            {CATEGORY_CONFIG.map(cat => (
              <button key={cat.id} onClick={() => setCatFilter(catFilter === cat.id ? null : cat.id)}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
                style={catFilter === cat.id
                  ? { background: cat.color + "15", color: cat.color, border: `1px solid ${cat.color}30` }
                  : { background: "#f8fafc", color: "#94a3b8", border: "1px solid #eef2f7" }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 no-scrollbar space-y-2">
          {scored.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-semibold text-slate-400">Không tìm thấy ai phù hợp</p>
              <p className="text-[11px] text-slate-300 mt-1">Thử hạ ngưỡng hoặc thêm sở thích</p>
            </div>
          )}
          {scored.map(({ user, score }, i) => (
            <motion.div key={user.id} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
              <MatchCard
                user={user} score={score}
                onConnect={() => handleConnect(user)}
                onMessage={() => setChatPeer(user)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat overlay */}
      <AnimatePresence>
        {chatPeer && (
          <motion.div key={chatPeer.id}
            className="absolute inset-0 z-[3000]"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}>
            <ChatScreen peer={chatPeer} onBack={() => setChatPeer(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
