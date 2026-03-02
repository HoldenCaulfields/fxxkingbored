"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import FilterBar from "./FilterBar";
import TopStatsBar from "./TopStatsBar";
import EditProfileModal from "../modals/EditProfileModal";
import Loading from "../Loading";
import { useUserStore } from "@/store/useUserStore";
import MapBottomNav, { MapTab } from "./panels/MapBottomNav";
import GroupsPanel from "./panels/GroupsPanel";
import EventsPanel from "./panels/EventsPanel";
import SignalPanel from "./panels/SignalPanel";
import NearbyPanel from "./panels/NearbyPanel";
import MatchPanel from "./panels/MatchPanel";
import CollegeDetailView from "./cdn/CollegeDetailView";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function MapScreen({ goGame }: { goGame: () => void }) {
  const profile = useUserStore(s => s.profile);
  const syncToCloud = useUserStore(s => s.syncToCloud);
  const [editOpen, setEditOpen] = useState(false);
  const [tab, setTab] = useState<MapTab>("map");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!profile.id || profile.id === "me") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(syncToCloud, 2000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [profile]);

  const isMap = tab === "map";

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* Map — always mounted, hidden behind panels */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isMap ? 1 : 0,
          pointerEvents: isMap ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
      >
        <LeafletMap onVisitCollege={() => setTab("cdn")} />
      </div>

      {/* Map overlays */}
      {isMap && (
        <>
          <TopStatsBar />
          <FilterBar
            onProfileClick={() => setEditOpen(true)}
            onGameClick={goGame}
          />
        </>
      )}

      {/* Full-screen panels */}
      <AnimatePresence mode="wait">
        {tab === "cdn"    && <CollegeDetailView key="cdn"    onBack={() => setTab("map")} />}
        {tab === "groups" && <GroupsPanel       key="groups" onClose={() => setTab("map")} />}
        {tab === "events" && <EventsPanel       key="events" onClose={() => setTab("map")} />}
        {tab === "signal" && <SignalPanel       key="signal" onClose={() => setTab("map")} />}
        {tab === "nearby" && <NearbyPanel       key="nearby" onClose={() => setTab("map")} />}
        {tab === "match"  && <MatchPanel        key="match"  onClose={() => setTab("map")} />}
      </AnimatePresence>

      {/* Always-on-top nav */}
      <MapBottomNav activeTab={tab} onChange={setTab} />

      {/* Modals */}
      <AnimatePresence>
        {editOpen && <EditProfileModal key="edit" onClose={() => setEditOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
