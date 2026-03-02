"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Plus, Lock, Globe, Search, Crown } from "lucide-react";
import { CATEGORY_CONFIG } from "@/config/categories";
import { Category } from "@/types/category";
import { addDoc, collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserStore } from "@/store/useUserStore";

interface Group {
  id: string; name: string; description: string; category?: Category;
  creatorId: string; creatorName: string;
  members: number; maxMembers: number; isPrivate: boolean;
  address?: string; tags?: string[]; createdAt: number;
}

const SEED_GROUPS: Omit<Group, "id">[] = [
  { name: "🇬🇧 Tiếng Anh CDN", description: "Luyện Tiếng Anh giao tiếp. IELTS, TOEIC, Speaking Club.", category: "language", creatorId: "seed", creatorName: "Cô Thu Hà", members: 28, maxMembers: 40, isPrivate: false, address: "Phòng A201", tags: ["english","ielts"], createdAt: Date.now() - 86400000*5 },
  { name: "💻 Lập trình CNTT CDN", description: "Web, Python, Java. Code review hàng tuần!", category: "startup", creatorId: "seed", creatorName: "Thầy Hùng IT", members: 35, maxMembers: 50, isPrivate: false, address: "Phòng C201", tags: ["python","web"], createdAt: Date.now() - 86400000*3 },
  { name: "🎵 Hội Âm Nhạc CDN", description: "Acoustic, Cover, Sáng tác tại sân khấu CDN.", category: "music", creatorId: "seed", creatorName: "Minh Châu", members: 15, maxMembers: 30, isPrivate: false, address: "Sân khấu CDN", tags: ["acoustic","guitar"], createdAt: Date.now() - 86400000*2 },
  { name: "🎮 Gamers CDN", description: "FPS, MOBA, Mobile. LAN party cuối tuần.", category: "game", creatorId: "seed", creatorName: "Quang Hùng", members: 40, maxMembers: 60, isPrivate: false, address: "Online + CDN", tags: ["fps","moba"], createdAt: Date.now() - 86400000 },
  { name: "📚 Đọc sách & Phát triển", description: "Đọc sách, chia sẻ, kỹ năng mềm.", category: "book", creatorId: "seed", creatorName: "Lan Anh", members: 12, maxMembers: 25, isPrivate: false, address: "Thư viện CDN", tags: ["books","skills"], createdAt: Date.now() - 3600000 },
  { name: "⚡ Điện tử & Arduino", description: "Arduino, IoT, Mạch điện — Khoa Điện.", category: "startup", creatorId: "seed", creatorName: "Thầy Minh Khoa", members: 22, maxMembers: 30, isPrivate: false, address: "Xưởng B103", tags: ["arduino","iot"], createdAt: Date.now() - 7200000 },
];

function CreateSheet({ onClose }: { onClose: () => void }) {
  const my = useUserStore(s => s.profile);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [priv, setPriv] = useState(false);
  const [cat, setCat] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "groups"), {
        name: name.trim(), description: desc.trim(),
        isPrivate: priv, category: cat,
        creatorId: my.id, creatorName: my.name,
        members: 1, maxMembers: 30,
        createdAt: Date.now(),
      });
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <>
      <motion.div className="absolute inset-0 bg-black/25 backdrop-blur-sm z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="absolute bottom-0 inset-x-0 z-20 bg-white rounded-t-[24px] p-5 pb-8 space-y-4"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.12)" }}
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
      >
        <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto" />
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Tạo nhóm mới</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <X size={15} style={{ color: "#64748b" }} />
          </button>
        </div>

        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Tên nhóm…"
          className="w-full px-4 py-3 rounded-2xl text-sm"
          style={{ background: "#f8fafc", border: "1.5px solid #eef2f7", color: "#0f172a", outline: "none" }} />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
          placeholder="Mô tả nhóm…"
          className="w-full px-4 py-3 rounded-2xl text-sm resize-none"
          style={{ background: "#f8fafc", border: "1.5px solid #eef2f7", color: "#0f172a", outline: "none" }} />

        {/* Category */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORY_CONFIG.map(c => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
              style={cat === c.id
                ? { background: c.color + "15", color: c.color, border: `1.5px solid ${c.color}30` }
                : { background: "#f8fafc", color: "#94a3b8", border: "1.5px solid #eef2f7" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Privacy */}
        <button onClick={() => setPriv(!priv)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all"
          style={priv
            ? { background: "#fff7ed", border: "1.5px solid #fed7aa" }
            : { background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
          <div className="flex items-center gap-2">
            {priv ? <Lock size={14} style={{ color: "#f97316" }} /> : <Globe size={14} style={{ color: "#22c55e" }} />}
            <span className="text-sm font-semibold" style={{ color: priv ? "#c2410c" : "#15803d" }}>
              {priv ? "Nhóm riêng tư" : "Nhóm công khai"}
            </span>
          </div>
          <div className="w-9 h-5 rounded-full relative transition-colors" style={{ background: priv ? "#f97316" : "#22c55e" }}>
            <motion.div animate={{ x: priv ? 17 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
          </div>
        </button>

        <button onClick={save} disabled={!name.trim() || saving}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all active:scale-95 disabled:opacity-40"
          style={{ background: "#f43f5e", boxShadow: "0 4px 16px rgba(244,63,94,0.3)" }}>
          {saving ? "Đang tạo…" : "✨ Tạo nhóm"}
        </button>
      </motion.div>
    </>
  );
}

export default function GroupsPanel({ onClose }: { onClose: () => void }) {
  const [firestoreGroups, setFirestoreGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState(new Set<string>());

  useEffect(() => {
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"), limit(30));
    return onSnapshot(q, snap => {
      setFirestoreGroups(snap.docs.map(d => ({ id: d.id, ...d.data() } as Group)));
    });
  }, []);

  const allGroups = useMemo(() => {
    const ids = new Set(firestoreGroups.map(g => g.id));
    const seeds = SEED_GROUPS.map((g, i) => ({ ...g, id: `seed_g${i}` })).filter(g => !ids.has(g.id));
    return [...firestoreGroups, ...seeds];
  }, [firestoreGroups]);

  const filtered = useMemo(() =>
    allGroups.filter(g =>
      !search || g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
    ), [allGroups, search]
  );

  return (
    <motion.div
      className="absolute inset-0 z-[2500] flex flex-col"
      style={{ background: "var(--bg)" }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 280 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 pt-14 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} style={{ color: "#8b5cf6" }} /> Nhóm CDN
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} nhóm đang hoạt động</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-[12px] text-white transition-all active:scale-95"
              style={{ background: "#8b5cf6", boxShadow: "0 4px 14px rgba(139,92,246,0.3)" }}>
              <Plus size={13} />Tạo nhóm
            </button>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#f1f5f9" }}>
              <X size={16} style={{ color: "#64748b" }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl"
          style={{ background: "#f8fafc", border: "1.5px solid #eef2f7" }}>
          <Search size={14} style={{ color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm nhóm…" className="flex-1 text-sm bg-transparent"
            style={{ color: "#0f172a", outline: "none" }} />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 no-scrollbar space-y-2">
        {filtered.map((g, i) => {
          const cfg = CATEGORY_CONFIG.find(c => c.id === g.category);
          const pct = Math.round((g.members / g.maxMembers) * 100);
          const isJoined = joined.has(g.id);

          return (
            <motion.div key={g.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="bg-white rounded-2xl p-4"
              style={{ border: "1px solid #f1f5f9", boxShadow: "var(--shadow-xs)" }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: (cfg?.color ?? "#94a3b8") + "12" }}>
                  {cfg?.icon ?? "👥"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-slate-900 text-sm truncate">{g.name}</p>
                    {g.isPrivate && <Lock size={10} style={{ color: "#94a3b8" }} className="shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-2">{g.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Crown size={9} style={{ color: "#f59e0b" }} />
                      <span className="text-[9px] text-slate-400">{g.creatorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={9} style={{ color: "#94a3b8" }} />
                      <span className="text-[9px] text-slate-400">{g.members}/{g.maxMembers}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="w-full h-1 rounded-full bg-slate-100 mb-2.5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg?.color ?? "#94a3b8" }} />
                  </div>

                  {/* Tags */}
                  {g.tags && g.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {g.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-lg font-semibold"
                          style={{ background: "#f8fafc", color: "#94a3b8", border: "1px solid #eef2f7" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Join button */}
                <button
                  onClick={() => setJoined(s => { const n = new Set(s); isJoined ? n.delete(g.id) : n.add(g.id); return n; })}
                  className="shrink-0 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all active:scale-90"
                  style={isJoined
                    ? { background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #bbf7d0" }
                    : { background: (cfg?.color ?? "#8b5cf6") + "12", color: cfg?.color ?? "#8b5cf6", border: `1.5px solid ${cfg?.color ?? "#8b5cf6"}25` }}>
                  {isJoined ? "✓ Tham gia" : "Tham gia"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && <CreateSheet onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
