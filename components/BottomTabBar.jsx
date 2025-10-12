"use client";

import { useEffect, useState } from "react";
import BottomTabBar from "./BottomTabBar";

export default function PwaBottomTabBar() {
  const [isPWA, setIsPWA] = useState(false);

useEffect(() => {
  const checkPWA = () => {
    const isStandaloneDisplay =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      window.navigator.standalone === true;

    setIsPWA(isStandaloneDisplay);
  };

  checkPWA();

  // Watch for PWA launch changes
  window.matchMedia("(display-mode: standalone)").addEventListener("change", checkPWA);
  window.addEventListener("visibilitychange", checkPWA);

  return () => {
    window.matchMedia("(display-mode: standalone)").removeEventListener("change", checkPWA);
    window.removeEventListener("visibilitychange", checkPWA);
  };
}, []);

  if (!isPWA) return null;
return <BottomTabBar />;

}
