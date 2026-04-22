"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function AdminOrderNotifier({ role }: { role: string }) {
  const isCashier = role?.toLowerCase() === "cashier";

  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hasActiveOrders, setHasActiveOrders] = useState(false);
  const [showActivation, setShowActivation] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // فحص الطلبات كل 6 ثواني
  useEffect(() => {
    if (!isCashier || !mounted) return;

    const check = async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        const data = await res.json();
        const orders = Array.isArray(data.orders) ? data.orders : [];
        const active = orders.some((o: any) => o.status === "Pending" || o.status === "Confirmed");
        setHasActiveOrders(active);

        // شاشة التفعيل تظهر بس لما يكون في طلبات نشطة والصوت مش مفعّل
        if (active && !soundEnabled) setShowActivation(true);
        if (!active) setShowActivation(false);
      } catch (e) {}
    };

    check();
    const timer = setInterval(check, 6000);
    return () => clearInterval(timer);
  }, [isCashier, mounted, soundEnabled]);

  // تشغيل الصوت كل 3 ثواني لما يكون في طلبات نشطة
  useEffect(() => {
    if (!soundEnabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const playBeep = () => {
      const audio = audioRef.current;
      if (!audio || !hasActiveOrders) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    if (hasActiveOrders) {
      playBeep(); // مرة فورية
      intervalRef.current = setInterval(playBeep, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hasActiveOrders, soundEnabled]);

  if (!mounted || !isCashier) return null;

  return (
    <>
      <audio ref={audioRef} src="/sounds/beep.mp3" preload="auto" />

      {showActivation && !soundEnabled && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "rgba(0,0,0,0.92)", display: "flex",
          alignItems: "center", justifyContent: "center", direction: "rtl",
        }}>
          <div style={{ background: "#fff", padding: "40px", borderRadius: "30px", textAlign: "center", maxWidth: "400px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🔔</div>
            <h2 style={{ fontWeight: 900, color: "#d32f2f" }}>يوجد طلبات نشطة!</h2>
            <p style={{ marginTop: "10px", color: "#555" }}>اضغط لتفعيل صوت التنبيه</p>
            <button
              onClick={() => {
                setSoundEnabled(true);
                setShowActivation(false);
              }}
              style={{
                background: "#16a34a", color: "#fff", padding: "15px",
                borderRadius: "10px", marginTop: "20px", width: "100%",
                border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer"
              }}
            >
              تفعيل الجرس 🔔
            </button>
          </div>
        </div>
      )}
    </>
  );
}