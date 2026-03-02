"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Users, Ticket, Search, CalendarDays, Plus, ArrowLeft } from "lucide-react";
import { CATEGORY_CONFIG } from "@/config/categories";
import { Category } from "@/types/category";

interface MockEvent {
  id: string; title: string; category: Category; hostName: string; description: string;
  address: string; startAt: number; attendees: number; maxAttendees: number;
  tags: string[]; coverEmoji: string;
}

const MOCK_EVENTS: MockEvent[] = [
  { id: "e1", title: "Indie Night 🎸 CDN Ninh Thuận", category: "music", hostName: "CLB Âm nhạc CDN", description: "Đêm nhạc acoustic tại sân khấu ngoài trời CDN. Cùng thưởng thức âm nhạc indie nhẹ nhàng.", address: "Sân khấu CDN, Ninh Thuận", startAt: Date.now() + 86400000 * 2, attendees: 47, maxAttendees: 80, tags: ["indie","acoustic","cdntour"], coverEmoji: "🎸" },
  { id: "e2", title: "Workshop Lập Trình AI 🚀", category: "startup", hostName: "CLB CNTT CDN", description: "Học cách dùng AI trong lập trình. Dành cho sinh viên CNTT và những ai yêu công nghệ.", address: "Phòng máy CNTT C201", startAt: Date.now() + 86400000 * 3, attendees: 35, maxAttendees: 60, tags: ["ai","coding","workshop"], coverEmoji: "🚀" },
  { id: "e3", title: "English Speaking Club ☕", category: "language", hostName: "Cô Thu Hà", description: "Thực hành tiếng Anh giao tiếp mỗi tuần. Free, chỉ cần nhiệt tình!", address: "Phòng A201, CDN Ninh Thuận", startAt: Date.now() + 86400000, attendees: 18, maxAttendees: 30, tags: ["english","speaking","free"], coverEmoji: "☕" },
  { id: "e4", title: "Cuộc thi Điện tử Sáng tạo ⚡", category: "startup", hostName: "Khoa Điện - ĐT CDN", description: "Thi làm sản phẩm điện tử sáng tạo: Arduino, IoT, Robot. Giải nhất 5 triệu!", address: "Xưởng Điện tử B103", startAt: Date.now() + 86400000 * 10, attendees: 24, maxAttendees: 50, tags: ["arduino","robot","prize"], coverEmoji: "⚡" },
  { id: "e5", title: "Ngày hội Hướng nghiệp CDN 📋", category: "work", hostName: "Phòng Đào tạo CDN", description: "Gặp gỡ nhà tuyển dụng, tìm cơ hội thực tập và việc làm. Miễn phí!", address: "Hội trường A, CDN Ninh Thuận", startAt: Date.now() + 86400000 * 5, attendees: 120, maxAttendees: 300, tags: ["career","internship","free"], coverEmoji: "📋" },
];

function timeLabel(ms: number) {
  const diff = ms - Date.now();
  const d = new Date(ms);
  const hm = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  if (diff < 0) return "Đã kết thúc";
  if (diff < 86400000) return `Hôm nay ${hm}`;
  if (diff < 86400000 * 2) return `Ngày mai ${hm}`;
  return `${d.getDate()}/${d.getMonth() + 1} ${hm}`;
}

function EventDetail({ event, isJoined, onToggle, onBack }: { event: MockEvent; isJoined: boolean; onToggle: () => void; onBack: () => void }) {
  const cfg = CATEGORY_CONFIG.find(c => c.id === event.category);
  const pct = Math.round((event.attendees / event.maxAttendees) * 100);
  return (
    <motion.div className="absolute inset-0 z-10 bg-gray-50 flex flex-col"
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 280 }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-14 pb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 text-sm mb-3 hover:text-gray-900">
          <ArrowLeft size={16} /> Quay lại
        </button>
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: (cfg?.color || "#888") + "14" }}>{event.coverEmoji}</div>
          <div>
            <h2 className="font-black text-gray-900 text-base leading-tight">{event.title}</h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg mt-1"
              style={{ background: (cfg?.color || "#888") + "14", color: cfg?.color }}>
              {cfg?.icon} {cfg?.label}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <Clock size={12} />, label: "Thời gian", value: timeLabel(event.startAt), color: cfg?.color || "#888" },
            { icon: <MapPin size={12} />, label: "Địa điểm", value: event.address, color: "#3b82f6" },
            { icon: <Users size={12} />, label: "Đăng ký", value: `${event.attendees}/${event.maxAttendees}`, color: "#10b981" },
            { icon: <span className="text-sm">👑</span>, label: "Tổ chức", value: event.hostName, color: "#f59e0b" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1" style={{ color: item.color }}>
                {item.icon}<span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="text-xs font-bold text-gray-900 line-clamp-2">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mô tả</p>
          <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-bold text-gray-500">Mức độ đăng ký</span>
            <span className="font-black" style={{ color: cfg?.color }}>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: cfg?.color }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">{event.maxAttendees - event.attendees} chỗ còn trống</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {event.tags.map(t => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white text-gray-400 border border-gray-100">#{t}</span>)}
        </div>
        <button onClick={onToggle}
          className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          style={isJoined
            ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
            : { background: cfg?.color, color: "#fff", boxShadow: `0 4px 16px ${cfg?.color}40` }}>
          {isJoined ? "✅ Đã đăng ký — Hủy?" : <><Ticket size={15} />Đăng ký tham gia</>}
        </button>
      </div>
    </motion.div>
  );
}

export default function EventsPanel({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const selectedEvent = MOCK_EVENTS.find(e => e.id === selected);
  const filtered = useMemo(() =>
    MOCK_EVENTS.filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())), [search]);
  const toggleJoin = (id: string) => setJoined(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <motion.div className="absolute inset-0 z-[2500] flex flex-col bg-gray-50"
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 280 }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Sự kiện</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tại CDN Ninh Thuận</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs text-white bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-200 transition-colors">
              <Plus size={13} />Tạo sự kiện
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sự kiện..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-3">
        {filtered.map((ev, i) => {
          const cfg = CATEGORY_CONFIG.find(c => c.id === ev.category);
          const isJoined = joined.has(ev.id);
          const pct = Math.round((ev.attendees / ev.maxAttendees) * 100);
          const isSoon = ev.startAt - Date.now() < 86400000;
          return (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 280 }}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm"
              onClick={() => setSelected(ev.id)}>
              <div className="h-1" style={{ background: cfg?.color }} />
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform hover:scale-110"
                    style={{ background: (cfg?.color || "#888") + "14" }}>{ev.coverEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 text-sm leading-tight mb-1">{ev.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: isSoon ? "#ef4444" : cfg?.color || "#888" }}>
                        <Clock size={9} />{timeLabel(ev.startAt)}{isSoon && " 🔴"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <MapPin size={9} /><span className="truncate max-w-[100px]">{ev.address}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mb-3 line-clamp-1 italic">{ev.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: cfg?.color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 shrink-0 flex items-center gap-0.5">
                    <Users size={9} />{ev.attendees}/{ev.maxAttendees}
                  </span>
                </div>
                <button onClick={e => { e.stopPropagation(); toggleJoin(ev.id); }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  style={isJoined
                    ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
                    : { background: (cfg?.color || "#888") + "10", color: cfg?.color || "#888", border: `1px solid ${cfg?.color || "#888"}18` }}>
                  {isJoined ? "✅ Đã đăng ký" : <><Ticket size={11} />Đăng ký</>}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedEvent && <EventDetail event={selectedEvent} isJoined={joined.has(selectedEvent.id)} onToggle={() => toggleJoin(selectedEvent.id)} onBack={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
