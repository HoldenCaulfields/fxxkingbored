// ============================================================
// components/map/AllMarkers.tsx
// ============================================================
"use client";
import { Marker, Popup } from "react-leaflet";
import { memo, useMemo } from "react";
import L from "leaflet";
import { UserProfile } from "@/types/user";
import { useProfiles } from "@/hooks/useProfiles2";
import { getPersonaPercentFromCategories } from "@/utils/persona";
import { computeMatchScore } from "@/utils/persona";
import { useUserStore } from "@/store/useUserStore";
import { CATEGORY_CONFIG } from "@/config/categories";

function createMarkerIcon(marker: UserProfile, matchScore: number) {
  const avatarUrl = marker.avatar || "/tet.jpg";
  const { funPercent, studyPercent } = getPersonaPercentFromCategories(marker.categories || []);

  const size = 44;
  const stroke = 4;
  const center = size / 2;
  const radius = center - stroke / 2;
  const circumference = radius * 2 * Math.PI;
  const funOffset = circumference - (funPercent / 100) * circumference;

  const glowColor =
    funPercent > studyPercent ? "rgba(239,68,68,0.45)" : "rgba(59,130,246,0.45)";

  const matchColor =
    matchScore >= 70 ? "#22c55e" : matchScore >= 40 ? "#f59e0b" : "#9ca3af";

  return L.divIcon({
    className: "custom-marker-leaflet",
    iconSize: [size, size + 22],
    iconAnchor: [center, center + 11],
    html: `
      <div style="position:relative;width:${size}px;height:${size + 22}px;display:flex;flex-direction:column;align-items:center;">
        <!-- Glow -->
        <div style="position:absolute;top:0;left:0;width:${size}px;height:${size}px;border-radius:50%;background:${glowColor};filter:blur(8px);z-index:0;"></div>
        <!-- SVG ring -->
        <svg width="${size}" height="${size}" style="position:absolute;top:0;left:0;z-index:1;">
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="${stroke}"/>
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none"
            stroke="#ef4444" stroke-width="${stroke}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${funOffset}"
            stroke-linecap="round"
            transform="rotate(-90 ${center} ${center})"/>
        </svg>
        <!-- Avatar -->
        <div style="position:absolute;top:${stroke}px;left:${stroke}px;width:${size - stroke * 2}px;height:${size - stroke * 2}px;border-radius:50%;overflow:hidden;z-index:2;">
          <img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='/tet.jpg'"/>
        </div>
        <!-- Match badge -->
        ${
          matchScore > 0
            ? `<div style="position:absolute;top:-4px;right:-4px;background:${matchColor};color:white;font-size:8px;font-weight:700;border-radius:999px;padding:1px 4px;z-index:3;border:1px solid white;">${matchScore}</div>`
            : ""
        }
        <!-- Name label -->
        <span style="margin-top:${size + 2}px;font-size:10px;font-weight:600;color:#1f2937;white-space:nowrap;background:rgba(255,255,255,0.85);padding:1px 5px;border-radius:99px;line-height:1.4;position:absolute;bottom:0;">
          ${marker.name}
        </span>
      </div>
    `,
  });
}

const UserMarker = memo(
  ({
    marker,
    matchScore,
    onClick,
  }: {
    marker: UserProfile;
    matchScore: number;
    onClick: (m: UserProfile) => void;
  }) => {
    const icon = useMemo(
      () => createMarkerIcon(marker, matchScore),
      // ✅ correct deps: avatar, name, categories, matchScore
      [marker.avatar, marker.name, JSON.stringify(marker.categories), matchScore]
    );

    if (!marker.location) return null;

    return (
      <Marker
        position={marker.location}
        icon={icon}
        eventHandlers={{ click: () => onClick(marker) }}
      />
    );
  }
);
UserMarker.displayName = "UserMarker";

export default function AllMarkers({
  onUserClick,
}: {
  onUserClick: (u: UserProfile) => void;
}) {
  const myProfile = useUserStore((s) => s.profile);
  const firestoreUsers = useProfiles();

  // Filter out hidden users and current user
  const visibleUsers = firestoreUsers.filter(
    user => (user.isVisible ?? true) && user.id !== myProfile.id
  );

  return (
    <>
      {visibleUsers.map((user) => (
        <UserMarker
          key={user.id}
          marker={user}
          matchScore={computeMatchScore(myProfile, user)}
          onClick={onUserClick}
        />
      ))}
    </>
  );
}