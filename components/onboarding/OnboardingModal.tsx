"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { CATEGORY_CONFIG } from "@/config/categories";
import { Category } from "@/types/category";
import { ArrowRight, Check, MapPin, Zap, Users } from "lucide-react";

const MOODS = [
  { e: "🔥", l: "Đang bứt phá" }, { e: "🎯", l: "Tập trung cao" },
  { e: "🌊", l: "Chill mode"  }, { e: "💡", l: "Sáng tạo"     },
  { e: "🤝", l: "Muốn kết nối"}, { e: "🎉", l: "Vui vẻ hôm nay"},
  { e: "🌙", l: "Đêm muộn"    }, { e: "☕", l: "Đi cà phê thôi"},
];

const STEPS = ["welcome", "categories", "mood", "done"] as const;
type Step = typeof STEPS[number];

export default function OnboardingModal({ onDone }: { onDone: () => void }) {
  const updateProfile = useUserStore(s => s.updateProfile);
  const toggleCategory = useUserStore(s => s.toggleCategory);
  const profile = useUserStore(s => s.profile);
  const [step, setStep] = useState<Step>("welcome");
  const [mood, setMood] = useState("");

  const next = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
    else { if (mood) updateProfile({ currentMood: mood }); onDone(); }
  };

  const canNext = step === "welcome" || step === "done" || step === "mood"
    || (step === "categories" && profile.categories.length >= 1);

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(6px)" }}>
      <motion.div
        className="w-full max-w-md bg-white flex flex-col"
        style={{ borderRadius: "28px 28px 0 0", maxHeight: "92vh", boxShadow: "0 -8px 48px rgba(0,0,0,0.15)" }}
        initial={{ y: "100%" }} animate={{ y: 0 }}
        transition={{ type: "spring", damping: 32, stiffness: 280 }}
      >
        {/* Progress */}
        <div className="flex gap-1.5 px-6 pt-5 pb-1">
          {STEPS.map((s, i) => (
            <motion.div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: stepIdx >= i ? "#f43f5e" : "#eef2f7" }} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
          <AnimatePresence mode="wait">

            {/* Welcome */}
            {step === "welcome" && (
              <motion.div key="welcome" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center gap-5">
                <div className="text-7xl mt-2 animate-[float_3s_ease-in-out_infinite]">🗺️</div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Chào mừng đến<br />VibeMap CDN! 🎉</h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Tìm bạn cùng sở thích tại CDN Ninh Thuận. Kết nối thật — không qua trung gian.
                  </p>
                </div>
                <div className="w-full space-y-2.5">
                  {[
                    { icon: <MapPin size={14} />, c: "#f43f5e", t: "Xem ai đang online quanh trường" },
                    { icon: <Zap size={14} />,   c: "#22c55e", t: "Match theo sở thích thật sự" },
                    { icon: <Users size={14} />, c: "#8b5cf6", t: "Tham gia nhóm và sự kiện CDN" },
                  ].map(item => (
                    <div key={item.t} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
                      style={{ background: item.c + "08", border: `1px solid ${item.c}18` }}>
                      <span style={{ color: item.c }}>{item.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{item.t}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Categories */}
            {step === "categories" && (
              <motion.div key="cats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Bạn thích gì? 🎯</h2>
                <p className="text-[12px] text-slate-400 mb-5">Chọn ít nhất 1 để tìm người cùng vibe</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_CONFIG.map(cat => {
                    const active = profile.categories.includes(cat.id);
                    return (
                      <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                        className="flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95 text-left"
                        style={active
                          ? { background: cat.color + "12", border: `2px solid ${cat.color}30`, boxShadow: `0 4px 16px ${cat.color}18` }
                          : { background: "#f8fafc", border: "2px solid #eef2f7" }}>
                        <span className="text-3xl">{cat.icon}</span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: active ? cat.color : "#0f172a" }}>
                            {cat.label}
                          </p>
                          {active && <span className="text-[9px] font-semibold" style={{ color: cat.color }}>✓ Đã chọn</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {profile.categories.length > 0 && (
                  <p className="text-center text-xs font-semibold mt-4" style={{ color: "#22c55e" }}>
                    ✅ Đã chọn {profile.categories.length} lĩnh vực
                  </p>
                )}
              </motion.div>
            )}

            {/* Mood */}
            {step === "mood" && (
              <motion.div key="mood" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Hôm nay vibe thế nào? ✨</h2>
                <p className="text-[12px] text-slate-400 mb-5">Sẽ hiện trên profile của bạn · Bỏ qua được</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map(m => {
                    const label = `${m.e} ${m.l}`;
                    const active = mood === label;
                    return (
                      <button key={m.l} onClick={() => setMood(active ? "" : label)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-95"
                        style={active
                          ? { background: "#f43f5e12", border: "2px solid #f43f5e30" }
                          : { background: "#f8fafc", border: "2px solid #eef2f7" }}>
                        <span className="text-2xl">{m.e}</span>
                        <span className="font-semibold text-sm" style={{ color: active ? "#f43f5e" : "#334155" }}>
                          {m.l}
                        </span>
                        {active && <Check size={14} style={{ color: "#f43f5e" }} className="ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Done */}
            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-5 py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, stiffness: 300 }}
                  className="text-7xl">
                  🎉
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Sẵn sàng khám phá!</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Bản đồ đang hiển thị người cùng vibe với bạn. Tap vào avatar để kết nối!
                  </p>
                </div>
                <div className="w-full rounded-2xl p-4" style={{ background: "#f8fafc", border: "1.5px solid #eef2f7" }}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Tips</p>
                  <div className="space-y-2 text-left">
                    {[
                      { e: "🎯", t: "Tap FilterBar để lọc theo sở thích" },
                      { e: "⚡", t: "Tab \"Match\" để xem người phù hợp nhất" },
                      { e: "📡", t: "Tab \"CDN\" → Tín hiệu để rủ đi cà phê" },
                      { e: "👤", t: "Chỉnh profile để nhiều người match hơn" },
                    ].map(t => (
                      <p key={t.t} className="text-xs text-slate-600 flex items-center gap-2">
                        <span>{t.e}</span>{t.t}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <button onClick={next} disabled={!canNext}
            className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #f43f5e, #fb7185)", boxShadow: "0 4px 20px rgba(244,63,94,0.3)" }}>
            {step === "done" ? "🗺️ Khám phá bản đồ!" : (
              <>{step === "categories" && profile.categories.length === 0 ? "Chọn ít nhất 1 lĩnh vực" : "Tiếp theo"}
              <ArrowRight size={15} /></>
            )}
          </button>

          {(step === "mood" || step === "categories") && (
            <button onClick={next}
              className="w-full mt-2 py-2 text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors">
              Bỏ qua
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
