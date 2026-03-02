"use client";
import { useEffect, useState } from "react";
import MapScreen from "@/components/map/MapScreen";
import GameScreen from "@/components/game/GameScreen";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { autoSeedIfEmpty } from "@/utils/seedFirestore";

const ONBOARDING_KEY = "cdnvibemap_onboarding_v2";

export default function App() {
  const [screen, setScreen] = useState<"map" | "game">("map");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    autoSeedIfEmpty();
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setShowOnboarding(true);
  }, []);

  const handleOnboardingDone = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  };

  return (
    <main className="h-screen w-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {screen === "map" && <MapScreen goGame={() => setScreen("game")} />}
      {screen === "game" && <GameScreen goMap={() => setScreen("map")} />}
      {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
    </main>
  );
}
