"use client";
import { motion } from "framer-motion";
import { Map, Users, School, Zap, Navigation2 } from "lucide-react";

export type MapTab = "map" | "groups" | "events" | "signal" | "nearby" | "cdn" | "match";

const TABS = [
  { id: "map"    as MapTab, icon: Map,         label: "Bản đồ",   color: "#3b82f6" },
  { id: "groups" as MapTab, icon: Users,        label: "Nhóm",     color: "#8b5cf6" },
  { id: "cdn"    as MapTab, icon: School,       label: "CDN",      color: "#f43f5e", badge: true },
  { id: "match"  as MapTab, icon: Zap,          label: "Match",    color: "#22c55e" },
  { id: "nearby" as MapTab, icon: Navigation2,  label: "Địa điểm", color: "#f59e0b" },
];

export default function MapBottomNav({
  activeTab,
  onChange,
}: {
  activeTab: MapTab;
  onChange: (t: MapTab) => void;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[5000] flex justify-center px-3 pb-safe">
      <nav
        className="w-full max-w-md flex items-center gap-0.5 p-1.5 rounded-[22px]"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 -1px 0 rgba(0,0,0,0.04), 0 -8px 28px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        {TABS.map(({ id, icon: Icon, label, color, badge }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onChange(id)}
              whileTap={{ scale: 0.88 }}
              className="relative flex-1 flex flex-col items-center justify-center py-2 rounded-[16px] gap-0.5 min-h-[52px] transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-bg"
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    background: `${color}12`,
                    border: `1.5px solid ${color}22`,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}

              {badge && !active && (
                <span
                  className="absolute top-2.5 right-[22%] w-1.5 h-1.5 rounded-full"
                  style={{ background: "#f43f5e" }}
                />
              )}

              <span
                className="relative z-10 transition-all duration-200"
                style={{ color: active ? color : "#b0bac8" }}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span
                className="relative z-10 text-[9.5px] font-semibold leading-none transition-colors"
                style={{ color: active ? color : "#b0bac8" }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
