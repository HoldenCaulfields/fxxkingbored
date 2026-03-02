"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Radio } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { sendSignal, listenSignals, Signal, SignalType } from "@/services/social";

const CFG: Record<SignalType, { emoji: string; label: string; color: string; desc: string }> = {
  coffee: { emoji: "☕", label: "Cà phê",   color: "#f59e0b", desc: "Tìm người đi cà phê cùng" },
  chill:  { emoji: "😎", label: "Chill",    color: "#3b82f6", desc: "Ngồi chơi, nói chuyện" },
  food:   { emoji: "🍜", label: "Đi ăn",   color: "#f43f5e", desc: "Rủ nhau đi ăn" },
  study:  { emoji: "📚", label: "Học cùng", color: "#22c55e", desc: "Tìm bạn học chung" },
  music:  { emoji: "🎵", label: "Nhạc",     color: "#8b5cf6", desc: "Nghe nhạc / jam cùng" },
  sport:  { emoji: "⚽", label: "Thể thao", color: "#06b6d4", desc: "Rủ chơi thể thao" },
  help:   { emoji: "🆘", label: "Cần giúp", color: "#f97316", desc: "Cần ai đó hỗ trợ" },
};
const DURATIONS = [
  { label: "30 phút", ms: 1_800_000 },
  { label: "1 giờ",   ms: 3_600_000 },
  { label: "2 giờ",   ms: 7_200_000 },
  { label: "Cả ngày", ms: 86_400_000 },
];

const ago  = (ms: number) => { const s = (Date.now() - ms) / 1000; return s < 60 ? `${~~s}s` : s < 3600 ? `${~~(s/60)}m` : `${~~(s/3600)}h`; };
const left = (ms: number) => { const d = (ms - Date.now()) / 60000; return d <= 0 ? "Hết hạn" : d < 60 ? `còn ${~~d}m` : `còn ${~~(d/60)}h`; };

function Dot({ c }: { c: string }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inset-0 rounded-full opacity-50" style={{ background: c }} />
      <span className="relative rounded-full h-2 w-2" style={{ background: c }} />
    </span>
  );
}

export default function SignalPanel({ onClose }: { onClose: () => void }) {
  const my = useUserStore(s => s.profile);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [type, setType] = useState<SignalType | null>(null);
  const [msg, setMsg] = useState("");
  const [dur, setDur] = useState(DURATIONS[1]);
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [responded, setResponded] = useState(new Set<string>());

  const isGuest = !my.id || my.id === "me";
  const cfg = type ? CFG[type] : null;

  useEffect(() => listenSignals(setSignals), []);

  const handleSend = async () => {
    if (!type || isGuest) return;
    setSending(true);
    try {
      await sendSignal({
        userId: my.id, userName: my.name, userAvatar: my.avatar || "/tet.jpg",
        type, message: msg, createdAt: Date.now(), expiresAt: Date.now() + dur.ms,
      });
      setSentOk(true); setType(null); setMsg("");
      setTimeout(() => setSentOk(false), 4000);
    } finally { setSending(false); }
  };

  return (
    <motion.div
      className="absolute inset-0 z-[2500] flex flex-col"
      style={{ background: "var(--bg)" }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 280 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Radio size={18} style={{ color: "#f43f5e" }} /> Tín hiệu
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {signals.length} tín hiệu đang hoạt động trong trường
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "#f1f5f9" }}>
            <X size={16} style={{ color: "#64748b" }} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 no-scrollbar space-y-4">
        {/* Guest notice */}
        {isGuest && (
          <div className="rounded-2xl p-3 text-center text-[11px] font-semibold"
            style={{ background: "#fffbeb", border: "1.5px solid #fde68a", color: "#92400e" }}>
            ⚠️ Đăng nhập Google để phát tín hiệu thật
          </div>
        )}

        {/* Composer */}
        <div className="bg-white rounded-2xl p-4 space-y-4"
          style={{ boxShadow: "var(--shadow-sm)", border: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-2">
            <Dot c="#f43f5e" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phát tín hiệu</span>
          </div>

          {/* Type grid */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(CFG) as [SignalType, typeof CFG[SignalType]][]).map(([t, c]) => {
              const active = type === t;
              return (
                <button key={t} onClick={() => setType(active ? null : t)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all active:scale-90"
                  style={active
                    ? { background: c.color + "14", border: `2px solid ${c.color}35` }
                    : { background: "#f8fafc", border: "2px solid #eef2f7" }}>
                  <span className="text-xl leading-none">{c.emoji}</span>
                  <span className="text-[8px] font-semibold uppercase" style={{ color: active ? c.color : "#94a3b8" }}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Options */}
          <AnimatePresence>
            {type && cfg && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3">
                <p className="text-[11px] text-slate-400 italic">{cfg.desc}</p>
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  placeholder="Thêm ghi chú… (tuỳ chọn)"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  style={{ background: "#f8fafc", border: "1.5px solid #eef2f7", color: "#0f172a", outline: "none" }} />
                <div className="flex gap-1.5">
                  {DURATIONS.map(d => (
                    <button key={d.label} onClick={() => setDur(d)}
                      className="flex-1 py-2 rounded-xl text-[9px] font-semibold transition-all"
                      style={dur.label === d.label
                        ? { background: cfg.color + "15", color: cfg.color, border: `1.5px solid ${cfg.color}30` }
                        : { background: "#f8fafc", color: "#94a3b8", border: "1.5px solid #eef2f7" }}>
                      {d.label}
                    </button>
                  ))}
                </div>
                <button onClick={handleSend} disabled={sending || isGuest}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: cfg.color, boxShadow: `0 4px 16px ${cfg.color}28` }}>
                  {sending
                    ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang phát…</>
                    : <><Send size={13} />Phát tín hiệu {cfg.emoji}</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {sentOk && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-2xl p-3"
              style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
              <span className="text-xl">📡</span>
              <div>
                <p className="text-xs font-bold" style={{ color: "#15803d" }}>Tín hiệu đã phát thành công!</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#16a34a" }}>Sinh viên xung quanh sẽ thấy bạn</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live feed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dot c="#22c55e" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Đang hoạt động · {signals.length}
            </span>
          </div>

          {signals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">📡</p>
              <p className="text-sm font-semibold text-slate-400">Chưa có tín hiệu nào</p>
              <p className="text-[11px] text-slate-300 mt-1">Hãy phát tín hiệu đầu tiên!</p>
            </div>
          )}

          <div className="space-y-2">
            {signals.map((sig, i) => {
              const c = CFG[sig.type];
              const pct = Math.max(0, ((sig.expiresAt - Date.now()) / (sig.expiresAt - sig.createdAt)) * 100);
              const done = responded.has(sig.id);
              return (
                <motion.div key={sig.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #f1f5f9", boxShadow: "var(--shadow-xs)" }}>
                  {/* Time bar */}
                  <div className="h-1 bg-slate-50">
                    <div className="h-full transition-all" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img src={sig.userAvatar || "/tet.jpg"} className="w-10 h-10 rounded-2xl object-cover" alt="" />
                      <span className="absolute -bottom-1 -right-1 text-[15px]">{c.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">{sig.userName}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-lg"
                          style={{ background: c.color + "12", color: c.color }}>{c.label}</span>
                      </div>
                      {sig.message && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 italic">"{sig.message}"</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-slate-400">{ago(sig.createdAt)}</span>
                        <span className="text-[9px] font-semibold" style={{ color: c.color }}>{left(sig.expiresAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setResponded(s => { const n = new Set(s); done ? n.delete(sig.id) : n.add(sig.id); return n; })}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={done
                        ? { background: c.color + "18", color: c.color }
                        : { background: "#f8fafc", color: "#94a3b8" }}>
                      {done ? "✅" : <MessageCircle size={13} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
