"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, MapPin, Star, Users, Navigation2, Wifi, Clock } from "lucide-react";

type PlaceType = "all" | "cafe" | "cowork" | "library" | "restaurant" | "gym";

const FILTERS: { id: PlaceType; emoji: string; label: string; color: string }[] = [
  { id: "all",        emoji: "🗺️", label: "Tất cả",   color: "#64748b" },
  { id: "cafe",       emoji: "☕", label: "Cà phê",   color: "#f59e0b" },
  { id: "cowork",     emoji: "💻", label: "Học tập",  color: "#3b82f6" },
  { id: "library",    emoji: "📚", label: "Thư viện", color: "#22c55e" },
  { id: "restaurant", emoji: "🍜", label: "Ăn uống",  color: "#f43f5e" },
  { id: "gym",        emoji: "⚽", label: "Thể thao", color: "#8b5cf6" },
];

const PLACES = [
  { id: "p1", name: "Café Xanh CDN", type: "cafe" as PlaceType, rating: 4.7, dist: 0.3, open: true, users: 5,  tags: ["wifi","yên tĩnh","học tập"],          price: "₫"   },
  { id: "p2", name: "Thư viện CDN",  type: "library" as PlaceType, rating: 4.6, dist: 0.1, open: true, users: 12, tags: ["điều hòa","miễn phí","sách"],    price: "Free"  },
  { id: "p3", name: "Căng-tin Trường",type: "restaurant" as PlaceType, rating: 4.2, dist: 0.1, open: true, users: 35, tags: ["rẻ","đa dạng","sinh viên"],  price: "₫"   },
  { id: "p4", name: "Phòng máy C201", type: "cowork" as PlaceType, rating: 4.5, dist: 0.2, open: true, users: 8,  tags: ["máy tính","wifi nhanh","free"],   price: "Free"  },
  { id: "p5", name: "Bún Bò Cô Liên", type: "restaurant" as PlaceType, rating: 4.8, dist: 0.5, open: true, users: 15, tags: ["ngon","rẻ","sinh viên"],     price: "₫"   },
  { id: "p6", name: "Sân Thể Dục CDN",type: "gym" as PlaceType, rating: 4.3, dist: 0.2, open: true, users: 10, tags: ["cầu lông","bóng đá","miễn phí"],  price: "Free"  },
  { id: "p7", name: "Café Góc Nhỏ",   type: "cafe" as PlaceType, rating: 4.4, dist: 0.7, open: false, users: 0, tags: ["cozy","nhạc","view đẹp"],          price: "₫₫"  },
  { id: "p8", name: "Phòng Đọc Sách", type: "library" as PlaceType, rating: 4.5, dist: 0.15, open: true, users: 6, tags: ["yên tĩnh","sách mới","wifi"], price: "Free"  },
];

export default function NearbyPanel({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<PlaceType>("all");
  const filtered = useMemo(() =>
    PLACES.filter(p => active === "all" || p.type === active), [active]
  );
  const cfg = (id: PlaceType) => FILTERS.find(f => f.id === id)!;

  return (
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
              <Navigation2 size={18} style={{ color: "#f59e0b" }} /> Địa điểm
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} nơi quanh CDN Ninh Thuận</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#f1f5f9" }}>
            <X size={16} style={{ color: "#64748b" }} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setActive(f.id)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-semibold transition-all"
              style={active === f.id
                ? { background: f.color + "15", color: f.color, border: `1.5px solid ${f.color}30` }
                : { background: "#f8fafc", color: "#94a3b8", border: "1.5px solid #eef2f7" }}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 no-scrollbar space-y-2">
        {filtered.map((p, i) => {
          const f = cfg(p.type);
          return (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="bg-white rounded-2xl p-4"
              style={{ border: "1px solid #f1f5f9", boxShadow: "var(--shadow-xs)" }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: f.color + "12" }}>
                  {f.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{p.name}</p>
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-lg"
                      style={{ background: f.color + "12", color: f.color }}>
                      {p.price}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-semibold text-slate-700">{p.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <MapPin size={9} style={{ color: "#94a3b8" }} />
                      <span className="text-[10px] text-slate-400">{p.dist}km</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Users size={9} style={{ color: "#94a3b8" }} />
                      <span className="text-[10px] text-slate-400">{p.users} người</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Clock size={9} style={{ color: p.open ? "#22c55e" : "#f43f5e" }} />
                      <span className="text-[10px] font-semibold" style={{ color: p.open ? "#16a34a" : "#dc2626" }}>
                        {p.open ? "Mở cửa" : "Đóng cửa"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-lg font-medium"
                        style={{ background: "#f8fafc", color: "#94a3b8", border: "1px solid #eef2f7" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigate button */}
              <button
                className="mt-3 w-full py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                style={{ background: f.color + "10", color: f.color, border: `1px solid ${f.color}20` }}
                onClick={() => window.open(`https://maps.google.com/?q=${p.name}+Ninh+Thuan`, "_blank")}
              >
                <Navigation2 size={11} /> Chỉ đường
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
