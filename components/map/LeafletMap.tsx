"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { UserProfile } from "@/types/user";
import { useUserStore } from "@/store/useUserStore";
import { sendConnection } from "@/services/social";
import AllMarkers from "./AllMarkers";
import UserCard from "./UserCard";
import CollegeModal from "./cdn/CollegeModal";
import MarkerCDN from "./cdn/MarkerCDN";
import ChatScreen from "@/components/chat/ChatScreen";

const CENTER: [number, number] = [11.563022, 109.013219];

export default function LeafletMap({ onVisitCollege }: { onVisitCollege: () => void }) {
  const my = useUserStore(s => s.profile);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [chatPeer, setChatPeer] = useState<UserProfile | null>(null);
  const [collegeOpen, setCollegeOpen] = useState(false);

  const handleConnect = async (user: UserProfile) => {
    if (!my.id || my.id === "me") return;
    await sendConnection(my.id, user.id);
  };

  const handleMessage = useCallback((user: UserProfile) => {
    setSelectedUser(null);
    setTimeout(() => setChatPeer(user), 160);
  }, []);

  return (
    <>
      <MapContainer
        center={CENTER}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <MarkerCDN onClick={() => setCollegeOpen(true)} />
        <AllMarkers onUserClick={setSelectedUser} />
      </MapContainer>

      <UserCard
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onConnect={handleConnect}
        onMessage={handleMessage}
      />

      <CollegeModal
        isOpen={collegeOpen}
        onClose={() => setCollegeOpen(false)}
        onVisit={() => { setCollegeOpen(false); onVisitCollege(); }}
      />

      <AnimatePresence>
        {chatPeer && (
          <ChatScreen key={chatPeer.id} peer={chatPeer} onBack={() => setChatPeer(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
