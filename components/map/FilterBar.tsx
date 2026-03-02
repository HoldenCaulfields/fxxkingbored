"use client";
import { CATEGORY_CONFIG } from "@/config/categories";
import { useUserStore } from "@/store/useUserStore";
import ProfileCircle from "./ProfileCircle";

type Props = { onProfileClick?: () => void; onGameClick?: () => void };

export default function FilterBar({ onProfileClick, onGameClick }: Props) {
  const categories = useUserStore(s => s.profile.categories);
  const toggleCategory = useUserStore(s => s.toggleCategory);

  return (
    <div className="fixed bottom-[72px] inset-x-0 z-[4000] px-3 pointer-events-none">
      <div
        className="w-full max-w-md mx-auto rounded-[22px] p-2 pointer-events-auto"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.85)",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }).map((_, idx) => {

            /* slot 2 → profile */
            if (idx === 2) return (
              <div key="profile" className="flex items-center justify-center aspect-square">
                <ProfileCircle onClick={onProfileClick} />
              </div>
            );

            /* slot 7 → game */
            if (idx === 7) return (
              <button key="blackhole" onClick={onGameClick}
                className="group relative flex items-center justify-center transition-transform active:scale-90">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-rose-400 blur-lg opacity-30 group-hover:opacity-70 animate-pulse transition-opacity rounded-full" />
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-orange-100">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-amber-300 animate-[spin_4s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping opacity-30" />
                  </div>
                </div>
              </button>
            );

            const ci = idx > 7 ? idx - 2 : idx > 2 ? idx - 1 : idx;
            const cat = CATEGORY_CONFIG[ci];
            if (!cat) return null;
            const active = categories.includes(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="relative aspect-square rounded-[16px] flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-90 select-none"
                style={active ? {
                  background: cat.color + "15",
                  border: `1.5px solid ${cat.color}30`,
                  boxShadow: `0 2px 10px ${cat.color}18`,
                } : {
                  background: "#f8fafc",
                  border: "1.5px solid #eef2f7",
                }}
              >
                <span className="text-[19px] leading-none">{cat.icon}</span>
                <span
                  className="text-[8px] font-semibold uppercase tracking-tight leading-none"
                  style={{ color: active ? cat.color : "#a0aec0" }}
                >
                  {cat.label}
                </span>
                {active && (
                  <span
                    className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: cat.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
