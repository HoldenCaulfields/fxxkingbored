"use client"

import { useUserStore } from "@/store/useUserStore"
import { getPersonaPercentFromCategories } from "@/utils/persona"
import { Camera } from "lucide-react"
import { useMemo } from "react"

export default function ProfileCircle({ onClick }: { onClick?: () => void }) {
  const categories = useUserStore(s => s.profile.categories)
  const profile = useUserStore(s => s.profile)

  const isVisible = profile.isVisible ?? true
  const isAnonymous = profile.isAnonymous ?? false
  const isPinned = profile.isPinned ?? false

  const { funPercent } = useMemo(
    () => getPersonaPercentFromCategories(categories),
    [categories]
  )

  // Kích thước cơ sở để tính toán tỉ lệ (SVG sẽ tự scale theo div cha)
  const size = 100;
  const stroke = 10;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = radius * 2 * Math.PI;

  const funStrokeDashoffset = circumference * (1 - funPercent / 100)

  // Visibility status badge styling
  const statusIcon = !isVisible ? "🚫" : isAnonymous ? "🎭" : "✅";
  const statusColor = !isVisible ? "#ef4444" : isAnonymous ? "#a78bfa" : "#22c55e";

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[70px] sm:max-w-[85px]">
      {/* Rotating Rings */}
      <div className="absolute w-20 h-20 md:w-22 md:h-22 border md:border-2 border-dashed border-rose-400/40 rounded-full animate-[spin_12s_linear_infinite]" />
      <div className="absolute w-26 h-26 md:w-30 md:h-30 border md:border-2 border-dashed border-blue-400/30 rounded-full animate-[spin_18s_linear_infinite_reverse]" />

      {/* Vòng tròn tỉ lệ - Sử dụng viewBox để tự scale */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90 z-20 drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] w-full h-full"
      >
        {/* Nền Study (Xanh) */}
        <circle
          stroke="#2563EB"
          fill="white"
          strokeWidth={stroke}
          r={radius}
          cx={center}
          cy={center}
          className="transition-all duration-1000"
        />
        {/* Tiến trình Fun (Đỏ) */}
        <circle
          stroke="#DC2626"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: funStrokeDashoffset,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          strokeLinecap="round"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>

      {/* Ảnh đại diện - Scale theo container */}
      <div
        onClick={onClick}
        className="relative rounded-full overflow-hidden border-2 border-white shadow-xl z-30 cursor-pointer group w-[75%] h-[75%] transition-transform active:scale-95"
      >
        <img
          src={profile.avatar || '/tet.jpg'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt="avatar"
        />

        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-[1px]">
          <Camera size={16} className="text-white mb-0.5" />
          <span className="text-[8px] font-black text-white">EDIT</span>
        </div>
      </div>

      {/* Visibility Status Badge */}
      <div
        className="absolute -top-1 -right-1 z-40 w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm"
        style={{ background: statusColor }}
        title={!isVisible ? "Ẩn khỏi bản đồ" : isAnonymous ? "Ẩn danh" : "Hiển thị"}
      >
        {statusIcon}
      </div>

      {/* Pin Badge */}
      {isPinned && (
        <div
          className="absolute -bottom-1 -right-1 z-40 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs bg-amber-400"
          title="Vị trí cố định"
        >
          📌
        </div>
      )}
    </div>
  )
}