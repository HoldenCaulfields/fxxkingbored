import { Polyline } from "react-leaflet";
import { COLLEGE_DATA } from "./data";
import { Member } from "@/types/cdn";

interface ConnectionLinesProps {
  members: Member[];
  userId?: string;
}

export default function ConnectionLines({ members, userId }: ConnectionLinesProps) {
  // If userId is provided, only show line for that user
  // Otherwise show for all (as requested for "when user becomes member")
  const displayMembers = userId ? members.filter(m => m.id === userId) : members;

  return (
    <>
      {displayMembers.map((member) => (
        <Polyline
          key={`line-${member.id}`}
          positions={[
            [member.lat, member.lng],
            COLLEGE_DATA.location,
          ]}
          pathOptions={{
            color: '#f43f5e',
            weight: 1,
            dashArray: '5, 10',
            opacity: 0.4,
          }}
        />
      ))}
    </>
  );
}
