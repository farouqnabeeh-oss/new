"use client";

import { useEffect, useRef } from "react";
import { findNearestBranch } from "@/lib/location";
import { type Branch } from "@/lib/types";

type LocationInitializerProps = {
  branches: Branch[];
  lang?: string;
};

export function LocationInitializer({ branches, lang = "ar" }: LocationInitializerProps) {
  const hasRequested = useRef(false);
  const isAr = lang === "ar";

  useEffect(() => {
    // Check if the user has already been redirected or has a saved preference
    const savedBranch = localStorage.getItem("uptown-nearest-branch");
    if (savedBranch) return;

    if (hasRequested.current) return;
    hasRequested.current = true;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearest = findNearestBranch(latitude, longitude, branches);

          if (nearest) {
            localStorage.setItem("uptown-nearest-branch", nearest.slug);

            // Show a toast or notification to the user
            const branchName = isAr ? nearest.nameAr : (nearest.nameEn || nearest.nameAr);
            const msg = isAr ? `تم تحديد موقعك! الفرع الأقرب: ${branchName}` : `Location detected! Nearest branch: ${branchName}`;

            if (typeof window !== "undefined" && (window as any).UI?.showToast) {
              (window as any).UI.showToast(msg, 'success');
            }
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [branches, isAr]);

  return null; // This is a background initializer
}
