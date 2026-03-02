import L from "leaflet";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Member } from "@/types/cdn";

interface MemberMarkersProps {
  members: Member[];
  onMemberClick: (member: Member) => void;
}

function createMemberIcon(avatar: string, role: string) {
  const roleColor = role === 'teacher' ? 'bg-blue-500' : role === 'alumni' ? 'bg-amber-500' : 'bg-rose-500';
  
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex flex-col items-center justify-center" style="transform: translate(-50%, -50%);">
        <div class="relative w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white">
          <img src="${avatar}" class="w-full h-full object-cover" alt="Member" />
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${roleColor} shadow-sm"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export default function MemberMarkers({ members, onMemberClick }: MemberMarkersProps) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      polygonOptions={{
        fillColor: '#f43f5e',
        color: '#f43f5e',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.2,
      }}
    >
      {members.map((member) => (
        <Marker
          key={member.id}
          position={[member.lat, member.lng]}
          icon={createMemberIcon(member.avatar, member.role)}
          eventHandlers={{
            click: () => onMemberClick(member),
          }}
        />
      ))}
    </MarkerClusterGroup>
  );
}
