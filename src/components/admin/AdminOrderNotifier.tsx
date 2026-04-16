"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PendingOrder {
  id: number | string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  orderType: string;
  createdAt: string;
}

export function AdminOrderNotifier() {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const seenIds = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<any>(null);

  // Load seen/dismissed IDs from localStorage on mount
  useEffect(() => {
    const savedSeen = localStorage.getItem("admin_seen_orders");
    const savedDismissed = localStorage.getItem("admin_dismissed_orders");
    if (savedSeen) {
      try {
        const arr = JSON.parse(savedSeen);
        if (Array.isArray(arr)) arr.forEach(id => seenIds.current.add(String(id)));
      } catch (e) {}
    }
    if (savedDismissed) {
      try {
        const arr = JSON.parse(savedDismissed);
        if (Array.isArray(arr)) setDismissed(new Set(arr.map(String)));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage whenever seenIds or dismissed changes
  const persistState = (ids: Set<string>, key: "admin_seen_orders" | "admin_dismissed_orders") => {
    localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  };

  const playAlarmTone = useCallback(() => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      const playBeep = (freq: number, start: number, dur: number, type: OscillatorType = "square") => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.5, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };

      // Faster, more insistent "Emergency" pattern
      playBeep(987.77, 0.0, 0.1, "sawtooth"); // B5
      playBeep(1318.51, 0.15, 0.1, "sawtooth"); // E6
      playBeep(987.77, 0.3, 0.1, "sawtooth"); // B5
      playBeep(1318.51, 0.45, 0.3, "sawtooth"); // E6
    } catch (e) {
      console.log("Audio error:", e);
    }
  }, []);

  const fetchPendingOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pending-orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const orders: PendingOrder[] = data.orders || [];

      // Filter out orders that have already been seen OR dismissed
      const filteredPending = orders.filter(o => !dismissed.has(String(o.id)));

      // Check for new orders (not in seenIds)
      const trulyNewOrders = filteredPending.filter(o => !seenIds.current.has(String(o.id)));
      if (trulyNewOrders.length > 0) {
        trulyNewOrders.forEach(o => seenIds.current.add(String(o.id)));
        persistState(seenIds.current, "admin_seen_orders");
        playAlarmTone();
      }

      setPendingOrders(filteredPending);
    } catch (e) {
      // Silently fail - DB might not be configured
    }
  }, [dismissed, playAlarmTone]);

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 8000); // Poll every 8s
    return () => clearInterval(interval);
  }, [fetchPendingOrders]);

  // Removed persistent alarm sound every 5s loop as requested

  const handleStartPreparing = async (orderId: string | number) => {
    try {
      await fetch("/api/admin/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "Preparing" }),
      });
      const updatedDismissed = new Set([...dismissed, String(orderId)]);
      setDismissed(updatedDismissed);
      persistState(updatedDismissed, "admin_dismissed_orders");
      setPendingOrders(prev => prev.filter(o => String(o.id) !== String(orderId)));
    } catch (e) {
      alert("فشل تحديث حالة الطلب");
    }
  };

  const handleDismiss = (orderId: string | number) => {
    const updatedDismissed = new Set([...dismissed, String(orderId)]);
    setDismissed(updatedDismissed);
    persistState(updatedDismissed, "admin_dismissed_orders");
    setPendingOrders(prev => prev.filter(o => String(o.id) !== String(orderId)));
  };

  // No visible output. The physical alarm sound is enough to notify the staff, 
  // and they will see the orders in the main dashboard grid.
  return null;
}
