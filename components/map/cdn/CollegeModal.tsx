"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users, MessageSquare, Layers, ArrowRight, Check, Phone, Globe } from "lucide-react";
import { COLLEGE_DATA } from "./data";
import { auth } from "@/lib/firebase";
import { joinCollege } from "@/services/db";
import { useAuth } from "@/contexts/AuthContext";

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisit: () => void;
}

export default function CollegeModal({ isOpen, onClose, onVisit }: CollegeModalProps) {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    if (!user) return;
    setIsJoining(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await joinCollege({
          id: user.uid,
          name: user.displayName || "Sinh viên CDN",
          avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          role: 'student',
          major: 'Sinh viên mới',
        });
        setJoined(true);
        setIsJoining(false);
      },
      async () => {
        await joinCollege({
          id: user.uid,
          name: user.displayName || "Sinh viên CDN",
          avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
          lat: COLLEGE_DATA.location[0] + (Math.random() - 0.5) * 0.05,
          lng: COLLEGE_DATA.location[1] + (Math.random() - 0.5) * 0.05,
          role: 'student',
          major: 'Sinh viên mới',
        });
        setJoined(true);
        setIsJoining(false);
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Cover */}
            <div className="relative h-44 sm:h-52">
              <img src={COLLEGE_DATA.cover} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3">
                <div className="w-16 h-16 rounded-2xl border-3 border-white shadow-xl overflow-hidden bg-white shrink-0">
                  <img src={COLLEGE_DATA.avatar} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="mb-1">
                  <h2 className="text-lg font-black text-white leading-tight">{COLLEGE_DATA.name}</h2>
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                    <MapPin size={10} />
                    <span className="truncate">{COLLEGE_DATA.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              <p className="text-slate-600 text-sm leading-relaxed mb-5">{COLLEGE_DATA.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: <Users size={18} />, value: `${COLLEGE_DATA.stats.members}+`, label: "Sinh viên", color: "#f43f5e", bg: "bg-rose-50" },
                  { icon: <MessageSquare size={18} />, value: `${COLLEGE_DATA.stats.posts}+`, label: "Bài viết", color: "#3b82f6", bg: "bg-blue-50" },
                  { icon: <Layers size={18} />, value: `${COLLEGE_DATA.stats.groups}`, label: "Nhóm học", color: "#f59e0b", bg: "bg-amber-50" },
                ].map((s, i) => (
                  <div key={i} className={`flex flex-col items-center p-3 ${s.bg} rounded-2xl`}>
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-lg font-black text-slate-900 mt-1">{s.value}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-5">
                <span className="flex items-center gap-1"><Globe size={10} />{COLLEGE_DATA.website}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                {!joined ? (
                  <button
                    onClick={handleJoin}
                    disabled={isJoining || !user}
                    className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {!user ? "Đăng nhập để tham gia" : isJoining ? "Đang xử lý..." : "Tham gia thành viên CDN"}
                  </button>
                ) : (
                  <div className="w-full py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-emerald-200">
                    <Check size={18} /> Đã tham gia thành công!
                  </div>
                )}
                <button
                  onClick={onVisit}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-rose-200"
                >
                  Vào trang trường
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
