"use client";
import { Marker, Popup } from "react-leaflet";
import { memo, useMemo } from "react";
import L from "leaflet";
import { UserProfile } from "@/types/user";
import { getPersonaPercentFromCategories } from "@/utils/persona";

function createOwnMarkerIcon(profile: UserProfile) {
  const avatarUrl = profile.avatar || "/tet.jpg";
  const { funPercent } = getPersonaPercentFromCategories(profile.categories || []);
  
  const isVisible = profile.isVisible ?? true;
  const isAnonymous = profile.isAnonymous ?? false;
  const isPinned = profile.isPinned ?? false;

  const size = 50;
  const stroke = 4;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = radius * 2 * Math.PI;
  const funOffset = circumference - (funPercent / 100) * circumference;

  // Glow effect
  const glowColor = funPercent > 50 ? "rgba(239,68,68,0.5)" : "rgba(59,130,246,0.5)";

  // Border color - green if visible, red if hidden, purple if anonymous
  let borderColor = "#22c55e";
  if (!isVisible) borderColor = "#ef4444";
  if (isAnonymous) borderColor = "#a78bfa";

  const popupContent = `
    <div style="padding: 8px; text-align: center; font-family: system-ui; border-radius: 8px;">
      <strong style="font-size: 14px; color: #1f2937;">${isAnonymous ? "Ẩn danh" : profile.name}</strong>
      <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
        ${isVisible ? "✅ Hiển thị trên bản đồ" : "❌ Ẩn khỏi bản đồ"}
        ${isAnonymous ? " (Ẩn tên & ảnh)" : ""}
      </div>
      ${isPinned ? '<div style="font-size: 10px; color: #f59e0b; margin-top: 4px;">📌 Vị trí cố định</div>' : ""}
    </div>
  `;

  return L.divIcon({
    className: "custom-marker-own",
    iconSize: [size + 4, size + 36],
    iconAnchor: [center + 2, center + 18],
    html: `
      <div style="position:relative;width:${size + 4}px;height:${size + 36}px;display:flex;flex-direction:column;align-items:center;">
        <!-- Outer pulse ring (only if visible) -->
        ${isVisible ? `
          <div style="position:absolute;top:-2px;left:-2px;width:${size + 8}px;height:${size + 8}px;border-radius:50%;border:2px solid ${borderColor};opacity:0.3;animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        ` : ""}
        
        <!-- Glow background -->
        <div style="position:absolute;top:0;left:2px;width:${size}px;height:${size}px;border-radius:50%;background:${glowColor};filter:blur(10px);z-index:0;"></div>
        
        <!-- SVG ring with fun/study ratio -->
        <svg width="${size + 4}" height="${size + 4}" style="position:absolute;top:0;left:0;z-index:1;">
          <!-- Base circle -->
          <circle cx="${center + 2}" cy="${center + 2}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="${stroke}"/>
          <!-- Fun/Study ratio arc -->
          <circle cx="${center + 2}" cy="${center + 2}" r="${radius}" fill="none"
            stroke="${borderColor}" stroke-width="${stroke}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${funOffset}"
            stroke-linecap="round"
            transform="rotate(-90 ${center + 2} ${center + 2})"/>
        </svg>
        
        <!-- Avatar (or anonymous indicator) -->
        <div style="position:absolute;top:${stroke + 2}px;left:${stroke + 2}px;width:${size - stroke * 2}px;height:${size - stroke * 2}px;border-radius:50%;overflow:hidden;z-index:2;background:#f8fafc;display:flex;align-items:center;justify-content:center;">
          ${isAnonymous ? `
            <div style="font-size:${(size - stroke * 2) / 1.5}px;display:flex;align-items:center;justify-content:center;">👤</div>
          ` : `
            <img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='/tet.jpg'"/>
          `}
        </div>
        
        <!-- Status badges -->
        <div style="position:absolute;top:-4px;right:-4px;z-index:3;display:flex;gap:2px;">
          ${isPinned ? '<div style="width:18px;height:18px;background:#f59e0b;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">📌</div>' : ""}
          ${!isVisible ? '<div style="width:18px;height:18px;background:#ef4444;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">🚫</div>' : ""}
          ${isAnonymous ? '<div style="width:18px;height:18px;background:#a78bfa;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">🎭</div>' : ""}
        </div>
        
        <!-- Label -->
        <span style="margin-top:${size + 6}px;font-size:11px;font-weight:700;color:#1f2937;white-space:nowrap;background:rgba(255,255,255,0.92);padding:2px 8px;border-radius:99px;line-height:1.4;position:absolute;bottom:2px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          ${isAnonymous ? "Bạn (Ẩn danh)" : "Bạn"}
        </span>
      </div>

      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.1; }
        }
      </style>
    `,
    popupAnchor: [0, -size - 20],
  });
}

const OwnMarker = memo(
  ({ profile, onMarkClick }: { profile: UserProfile; onMarkClick?: () => void }) => {
    const icon = useMemo(
      () => createOwnMarkerIcon(profile),
      [profile.avatar, profile.name, JSON.stringify(profile.categories), profile.isVisible, profile.isAnonymous, profile.isPinned]
    );

    if (!profile.location) return null;
    if (!profile.isVisible && profile.id !== "me") return null; // Hide others if they set invisible

    return (
      <Marker
        position={profile.location}
        icon={icon}
        eventHandlers={{ click: onMarkClick }}
      >
        <Popup closeButton={false} offset={[0, -10]}>
          <div style={{ padding: "4px 0", fontSize: "12px" }}>
            {profile.isAnonymous ? "👤 Ẩn danh" : profile.name}
            <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
              {profile.isVisible ? "✅ Hiển thị" : "❌ Ẩn khỏi bản đồ"}
              {profile.isPinned && " • 📌 Ghim"}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
);
OwnMarker.displayName = "OwnMarker";

export default OwnMarker;
