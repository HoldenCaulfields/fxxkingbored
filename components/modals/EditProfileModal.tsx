'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Camera, Chrome, CloudLightning, Sparkles,
  Eye, EyeOff, MapPin, MapPinOff, History,
  User, Link2, BarChart3, ChevronRight,
  Facebook, Instagram, Youtube, Flame, BookOpen,
  TrendingUp, Clock, Trash2, LogOut, Check,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { useAuthActions } from '@/hooks/useAuth';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORY_CONFIG } from '@/config/categories';
import { getPersonaPercentFromCategories } from '@/utils/persona';
import { Category } from '@/types/category';
import { InterestSnapshot } from '@/types/category';

interface Props { onClose: () => void; }

type Tab = 'profile' | 'vibe' | 'history' | 'settings';
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',  label: 'Hồ sơ',   icon: <User size={14} /> },
  { id: 'vibe',     label: 'Vibe',     icon: <Flame size={14} /> },
  { id: 'history',  label: 'Lịch sử', icon: <History size={14} /> },
  { id: 'settings', label: 'Cài đặt', icon: <BarChart3 size={14} /> },
];
const MOODS = [
  { emoji: '🔥', label: 'Bứt phá' }, { emoji: '🎯', label: 'Tập trung' },
  { emoji: '🌊', label: 'Thư giãn' }, { emoji: '💡', label: 'Sáng tạo' },
  { emoji: '🤝', label: 'Kết nối' },  { emoji: '🎉', label: 'Vui vẻ' },
  { emoji: '🌙', label: 'Đêm muộn' },{ emoji: '☕', label: 'Chill' },
];

/* ── Light persona ring ─────────────────────────────────────── */
function PersonaRing({ funPercent }: { funPercent: number }) {
  const size = 90; const stroke = 7;
  const c = size / 2; const r = c - stroke / 2;
  const circ = r * 2 * Math.PI;
  const fun   = circ * (funPercent / 100);
  const study = circ * ((100 - funPercent) / 100);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={c} cy={c} r={r} fill="none" stroke="#3b82f6"
        strokeWidth={stroke} strokeDasharray={`${study} ${circ}`}
        strokeDashoffset={-fun} strokeLinecap="round" />
      <circle cx={c} cy={c} r={r} fill="none" stroke="#ef4444"
        strokeWidth={stroke} strokeDasharray={`${fun} ${circ}`}
        strokeLinecap="round" />
    </svg>
  );
}

/* ── History snapshot card (light) ─────────────────────────── */
function SnapshotCard({ snap, index }: { snap: InterestSnapshot; index: number }) {
  const [open, setOpen] = useState(false);
  const date = new Date(snap.timestamp);
  const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const catIds = Array.from(new Set(snap.interests.map(i => i.category))) as Category[];
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <button className="w-full flex items-center gap-3 p-3.5 text-left" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-[9px] text-gray-500 font-bold leading-none">{timeStr}</span>
          <span className="text-[8px] text-gray-400 leading-none mt-0.5">{dateStr}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-1 flex-wrap">
            {catIds.slice(0, 4).map(catId => {
              const cfg = CATEGORY_CONFIG.find(c => c.id === catId);
              return (
                <span key={catId} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: (cfg?.color || '#888') + '15', color: cfg?.color || '#888' }}>
                  {cfg?.icon} {cfg?.label}
                </span>
              );
            })}
            {catIds.length > 4 && <span className="text-[10px] text-gray-400">+{catIds.length - 4}</span>}
          </div>
        </div>
        <ChevronRight size={14} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-3.5 pb-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
              {snap.interests.map(i => (
                <span key={i.id} className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">{i.label}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Location Detect ──────────────────────────────────── */
function LocationDetect() {
  const updateProfile = useUserStore(s => s.updateProfile);
  const profile = useUserStore(s => s.profile);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const detect = () => {
    if (!navigator.geolocation) { setStatus("err"); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        updateProfile({ location: [pos.coords.latitude, pos.coords.longitude] });
        setStatus("ok");
        setLoading(false);
      },
      () => { setStatus("err"); setLoading(false); },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vị trí trên bản đồ</label>
      <button
        onClick={detect}
        disabled={loading}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-sm font-bold ${
          status === "ok"
            ? "bg-green-50 border-green-300 text-green-700"
            : status === "err"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />Đang xác định...</>
        ) : status === "ok" ? (
          <>📍 Đã cập nhật vị trí! ({profile.location?.[0].toFixed(4)}, {profile.location?.[1].toFixed(4)})</>
        ) : status === "err" ? (
          <>⚠️ Không thể lấy vị trí — thử lại</>
        ) : (
          <>📍 Xác định vị trí hiện tại</>
        )}
      </button>
      {!profile.location && status === "idle" && (
        <p className="text-[10px] text-amber-600">⚠️ Chưa có vị trí — bạn sẽ không hiện trên bản đồ</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
const EditProfileModal: React.FC<Props> = ({ onClose }) => {
  const profile       = useUserStore(s => s.profile);
  const updateProfile = useUserStore(s => s.updateProfile);
  const syncToCloud   = useUserStore(s => s.syncToCloud);
  const { loginWithGoogle, logout, loading } = useAuthActions();
  const { user } = useAuth();

  const [tab, setTab]               = useState<Tab>('profile');
  const [uploading, setUploading]   = useState(false);
  const [saved, setSaved]           = useState(false);
  const [name, setName]             = useState(profile.name);
  const [bio, setBio]               = useState(profile.bio || '');
  const [avatar, setAvatar]         = useState(profile.avatar);
  const [mood, setMood]             = useState(profile.currentMood || '');
  const [isVisible, setIsVisible]   = useState((profile as any).isVisible ?? true);
  const [isAnonymous, setIsAnonymous] = useState((profile as any).isAnonymous ?? false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: profile.socialLinks?.facebook || '', instagram: profile.socialLinks?.instagram || '',
    youtube:  profile.socialLinks?.youtube  || '', tiktok:    profile.socialLinks?.tiktok    || '',
    zalo:     profile.socialLinks?.zalo     || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name); setBio(profile.bio || ''); setAvatar(profile.avatar);
    setMood(profile.currentMood || '');
    setSocialLinks({ facebook: profile.socialLinks?.facebook || '', instagram: profile.socialLinks?.instagram || '',
      youtube: profile.socialLinks?.youtube || '', tiktok: profile.socialLinks?.tiktok || '', zalo: profile.socialLinks?.zalo || '' });
  }, [profile.id]);

  const { funPercent, studyPercent } = useMemo(() => getPersonaPercentFromCategories(profile.categories), [profile.categories]);
  const dominantPersona = funPercent >= studyPercent ? 'fun' : 'study';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadToCloudinary(file); setAvatar(url); }
    catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (uploading) return;
    updateProfile({ name, bio, avatar, currentMood: mood, socialLinks, isPinned: profile.isPinned, isVisible, isAnonymous } as any);
    await syncToCloud();
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const categoryFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    profile.history.forEach(snap => snap.interests.forEach(i => { freq[i.category] = (freq[i.category] || 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [profile.history]);
  const totalSnapshots = profile.history.length;
  const sortedHistory = useMemo(() => [...profile.history].sort((a, b) => b.timestamp - a.timestamp), [profile.history]);

  /* ── Shared input style ── */
  const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all";
  const labelCls = "text-[10px] font-black text-gray-400 uppercase tracking-widest px-1";
  const cardCls  = "rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden";

  /* ── Toggle component ── */
  const Toggle = ({ on, onToggle, color = "#22c55e" }: { on: boolean; onToggle: () => void; color?: string }) => (
    <button onClick={onToggle} className="relative w-11 h-6 rounded-full transition-colors shrink-0"
      style={{ background: on ? color : '#e5e7eb' }}>
      <motion.div animate={{ x: on ? 21 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
    </button>
  );

  return (
    /* z-index = 6000, above bottom nav (5000) */
    <div className="fixed inset-0 z-[6000] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        drag="y" dragConstraints={{ top: 0 }} dragElastic={0.12}
        onDragEnd={(_, info) => { if (info.offset.y > 120) onClose(); }}
        className="relative w-full max-h-[92dvh] sm:max-w-md sm:rounded-[2rem] rounded-t-[2rem] flex flex-col overflow-hidden bg-[#f4f6f9]"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
      >
        {/* ── Drag handle ── */}
        <div className="w-full flex justify-center pt-3 pb-0 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── Header ── */}
        <div className="px-5 pt-3 pb-0 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {tab === 'profile' && 'Hồ sơ'}{tab === 'vibe' && 'Vibe & Cảm xúc'}
              {tab === 'history' && 'Lịch sử'}{tab === 'settings' && 'Cài đặt'}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {user ? `✓ ${user.email}` : '👤 Chế độ khách'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
            <X size={17} />
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="px-4 mt-3 mb-0 shrink-0">
          <div className="flex gap-1 p-1 rounded-2xl bg-white border border-gray-100 shadow-sm">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold transition-all ${
                  tab === t.id ? 'bg-gray-900 text-white shadow' : 'text-gray-400 hover:text-gray-700'
                }`}>
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
          <AnimatePresence mode="wait">

            {/* ════ PROFILE ════ */}
            {tab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="space-y-3">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="absolute inset-0 -m-1"><PersonaRing funPercent={funPercent} /></div>
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                      {uploading
                        ? <div className="w-full h-full bg-gray-100 flex items-center justify-center"><div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" /></div>
                        : <img src={avatar || '/tet.jpg'} className="w-full h-full object-cover" alt="" />
                      }
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-red-500 flex items-center justify-center shadow-md ring-2 ring-white">
                      <Camera size={12} className="text-white" />
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-500 font-bold">🎉 {funPercent}%</span>
                    <div className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${funPercent}%` }} />
                    </div>
                    <span className="text-blue-500 font-bold">{studyPercent}% 📚</span>
                  </div>
                </div>

                <div className="space-y-1"><label className={labelCls}>Nickname</label>
                  <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Tên của bạn..." /></div>

                <div className="space-y-1"><label className={labelCls}>Giới thiệu</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} className={inputCls + " h-20 resize-none"} placeholder="Chia sẻ về bản thân..." /></div>

                {/* Location */}
                <LocationDetect />

                <div className="space-y-2">
                  <label className={labelCls}>Mạng xã hội</label>
                  {[
                    { key: 'instagram', icon: <Instagram size={14} />, ph: 'Instagram', color: '#e1306c' },
                    { key: 'tiktok',    icon: <span className="text-sm">🎵</span>, ph: 'TikTok', color: '#010101' },
                    { key: 'facebook',  icon: <Facebook size={14} />, ph: 'Facebook URL', color: '#1877f2' },
                    { key: 'youtube',   icon: <Youtube size={14} />, ph: 'YouTube', color: '#ff0000' },
                    { key: 'zalo',      icon: <span className="text-sm">💬</span>, ph: 'Số Zalo', color: '#0068ff' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-400 transition-all">
                      <span className="shrink-0" style={{ color: item.color }}>{item.icon}</span>
                      <input value={(socialLinks as any)[item.key]}
                        onChange={e => setSocialLinks(p => ({ ...p, [item.key]: e.target.value }))}
                        placeholder={item.ph}
                        className="flex-1 bg-transparent text-sm text-gray-900 font-medium placeholder:text-gray-400 outline-none" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ════ VIBE ════ */}
            {tab === 'vibe' && (
              <motion.div key="vibe" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="space-y-3">
                <div className="space-y-2">
                  <label className={labelCls}>Tâm trạng hiện tại</label>
                  <div className="grid grid-cols-4 gap-2">
                    {MOODS.map(m => (
                      <button key={m.label} onClick={() => setMood(mood === m.label ? '' : m.label)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all text-center ${
                          mood === m.label ? 'border-red-400 bg-red-50 scale-95' : 'border-gray-100 bg-white hover:bg-gray-50'
                        }`}>
                        <span className="text-xl">{m.emoji}</span>
                        <span className="text-[9px] font-bold text-gray-500">{m.label}</span>
                      </button>
                    ))}
                  </div>
                  {mood && <p className="text-xs text-center text-gray-400 italic">Đang hiển thị: <span className="text-gray-700 font-bold">{mood}</span></p>}
                </div>

                {/* Active categories */}
                <div className="space-y-2">
                  <label className={labelCls}>Lĩnh vực đang chọn ({profile.categories.length})</label>
                  {profile.categories.length === 0
                    ? <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">Dùng FilterBar ngoài bản đồ để chọn.</div>
                    : <div className="flex flex-wrap gap-1.5">
                        {profile.categories.map(catId => {
                          const cfg = CATEGORY_CONFIG.find(c => c.id === catId);
                          return cfg ? (
                            <motion.span key={catId} initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
                              style={{ background: cfg.color + '18', color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                              {cfg.icon} {cfg.label}
                            </motion.span>
                          ) : null;
                        })}
                      </div>
                  }
                </div>

                {/* Active interests */}
                <div className="space-y-2">
                  <label className={labelCls}>Sở thích active ({profile.interests.length})</label>
                  {profile.interests.length === 0
                    ? <p className="text-gray-400 text-xs text-center py-4 bg-white rounded-2xl border border-gray-100">Chưa có sở thích nào.</p>
                    : <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar">
                        {profile.interests.map(i => {
                          const cfg = CATEGORY_CONFIG.find(c => c.id === i.category);
                          return (
                            <span key={i.id} className="text-[11px] px-2.5 py-1 rounded-lg font-semibold"
                              style={{ background: (cfg?.color || '#888') + '12', color: cfg?.color || '#888', border: `1px solid ${cfg?.color || '#888'}20` }}>
                              {i.label}
                            </span>
                          );
                        })}
                      </div>
                  }
                </div>

                {/* Persona breakdown */}
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Phân tích Persona</p>
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <PersonaRing funPercent={funPercent} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl">{dominantPersona === 'fun' ? '🎉' : '📚'}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[
                        { label: '🔴 Fun', pct: funPercent, color: '#ef4444', grad: 'from-red-500 to-orange-400' },
                        { label: '🔵 Study', pct: studyPercent, color: '#3b82f6', grad: 'from-blue-500 to-cyan-400' },
                      ].map(s => (
                        <div key={s.label}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-bold" style={{ color: s.color }}>{s.label}</span>
                            <span className="font-black" style={{ color: s.color }}>{s.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full bg-gradient-to-r ${s.grad}`}
                              initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.2, duration: 0.5 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ HISTORY ════ */}
            {tab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Cập nhật', value: totalSnapshots, icon: <Clock size={13} />, color: '#3b82f6' },
                    { label: 'Lĩnh vực', value: categoryFrequency.length, icon: <TrendingUp size={13} />, color: '#22c55e' },
                    { label: 'Sở thích', value: new Set(profile.history.flatMap(s => s.interests.map(i => i.id))).size, icon: <Sparkles size={13} />, color: '#f59e0b' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-3 text-center shadow-sm">
                      <span style={{ color: s.color }} className="flex justify-center mb-1">{s.icon}</span>
                      <p className="text-xl font-black text-gray-900">{s.value}</p>
                      <p className="text-[9px] text-gray-400 font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
                {categoryFrequency.length > 0 && (
                  <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Lĩnh vực hay chọn</p>
                    {categoryFrequency.map(([catId, count], i) => {
                      const cfg = CATEGORY_CONFIG.find(c => c.id === catId);
                      return (
                        <div key={catId} className="flex items-center gap-2">
                          <span className="w-5 text-sm shrink-0">{cfg?.icon}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ background: cfg?.color || '#888' }}
                              initial={{ width: 0 }} animate={{ width: `${(count / categoryFrequency[0][1]) * 100}%` }}
                              transition={{ delay: i * 0.05, duration: 0.4 }} />
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold w-6 text-right">{count}x</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="space-y-2">
                  {sortedHistory.length === 0
                    ? <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
                        <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                        Chưa có lịch sử nào.
                      </div>
                    : sortedHistory.map((snap, i) => <SnapshotCard key={snap.timestamp} snap={snap} index={i} />)
                  }
                </div>
              </motion.div>
            )}

            {/* ════ SETTINGS ════ */}
            {tab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                className="space-y-3">
                {/* Visibility */}
                <div className={cardCls}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">Hiển thị bản đồ</p>
                  {[
                    { label: 'Hiển thị trên bản đồ', sub: 'Người khác có thể thấy bạn', on: isVisible, toggle: () => setIsVisible((v: boolean) => !v), color: '#22c55e', icon: isVisible ? <MapPin size={15}/> : <MapPinOff size={15}/> },
                    { label: 'Ẩn danh', sub: 'Ẩn tên & ảnh, chỉ hiện vibe', on: isAnonymous, toggle: () => setIsAnonymous((v: boolean) => !v), color: '#8b5cf6', icon: isAnonymous ? <EyeOff size={15}/> : <Eye size={15}/> },
                    { label: 'Ghim vị trí', sub: 'Marker cố định trên bản đồ', on: profile.isPinned, toggle: () => updateProfile({ isPinned: !profile.isPinned }), color: '#f59e0b', icon: <MapPin size={15}/> },
                  ].map((row, i) => (
                    <div key={row.label} className={`flex items-center justify-between px-4 py-3.5 border-t border-gray-100 ${i === 0 ? 'border-t-0' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: row.on ? row.color + '18' : '#f3f4f6', color: row.on ? row.color : '#9ca3af' }}>
                          {row.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{row.label}</p>
                          <p className="text-[10px] text-gray-400">{row.sub}</p>
                        </div>
                      </div>
                      <Toggle on={row.on} onToggle={row.toggle} color={row.color} />
                    </div>
                  ))}
                </div>

                {/* Auth */}
                <div className={cardCls}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">Tài khoản</p>
                  {!user ? (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0"><CloudLightning size={16} /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Đăng nhập để lưu trữ</p>
                          <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">Đang dùng chế độ khách. Đăng nhập để đồng bộ dữ liệu.</p>
                        </div>
                      </div>
                      <button onClick={async () => { const res = await loginWithGoogle(); if (res) onClose(); }} disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50">
                        {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><span>G</span>ĐĂNG NHẬP VỚI GOOGLE</>}
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-gray-100">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <img src={user.photoURL || '/tet.jpg'} className="w-9 h-9 rounded-xl object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.displayName}</p>
                          <p className="text-[10px] text-green-600">✓ Đồng bộ Google</p>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <button onClick={async () => { await logout(); onClose(); }}
                          className="w-full py-3 bg-red-50 border border-red-100 text-red-500 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all">
                          <LogOut size={14} />Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Danger */}
                <div className="rounded-2xl border border-red-200 overflow-hidden">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-wider px-4 pt-4 pb-2">Vùng nguy hiểm</p>
                  <button onClick={() => { if (confirm('Xoá toàn bộ lịch sử Vibe?')) updateProfile({ history: [] }); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} /><span className="text-sm font-bold">Xoá lịch sử Vibe</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100 pb-safe">
          <div className="flex gap-3">
            <button onClick={onClose}
              className="shrink-0 px-5 py-3.5 rounded-2xl bg-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all active:scale-95">
              Đóng
            </button>
            <button onClick={handleSave} disabled={uploading}
              className={`flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-white ${
                saved ? 'bg-green-500' : ''
              }`}
              style={saved ? {} : { background: 'linear-gradient(135deg, #ef4444, #f97316)', boxShadow: '0 4px 20px rgba(239,68,68,0.30)' }}>
              {saved ? <><Check size={15} strokeWidth={3} />Đã lưu!</> : uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles size={14} />Lưu hồ sơ</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
