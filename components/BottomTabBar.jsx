"use client";

import { useEffect, useState } from "react";
import BottomTabBar from "./BottomTabBar";

export default function PwaBottomTabBar() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      try {
        const isStandalone =
          window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
        const isFullscreen =
          window.matchMedia && window.matchMedia("(display-mode: fullscreen)").matches;
        const isNavigatorStandalone = window.navigator.standalone === true;

        setIsPWA(isStandalone || isFullscreen || isNavigatorStandalone);
      } catch {
        setIsPWA(false);
      }
    };

    checkPWA();

    // Recheck on relevant events
    window.addEventListener("appinstalled", checkPWA);
    window.addEventListener("resize", checkPWA);
    window.addEventListener("visibilitychange", checkPWA);

    return () => {
      window.removeEventListener("appinstalled", checkPWA);
      window.removeEventListener("resize", checkPWA);
      window.removeEventListener("visibilitychange", checkPWA);
    };
  }, []);

  if (!isPWA) return null;
  return <BottomTabBar />;
}
