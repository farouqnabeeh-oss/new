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

  if (pendingOrders.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes notif-pulse {
          0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.7); }
          70% { box-shadow: 0 0 0 18px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
        @keyframes notif-slide-in {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .order-notif-card {
          animation: notif-slide-in 0.4s ease, notif-pulse 1.8s infinite;
          background: #fff;
          border: 2px solid #DC2626;
          border-radius: 20px;
          padding: 20px 24px;
          margin-bottom: 12px;
          direction: rtl;
        }
      ` }} />
      <div style={{
        position: "fixed",
        top: "80px",
        left: "20px",
        zIndex: 9999,
        maxWidth: "380px",
        width: "90vw",
      }}>
        <div style={{
          background: "#DC2626",
          color: "#fff",
          borderRadius: "16px 16px 0 0",
          padding: "12px 20px",
          fontWeight: 900,
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "20px" }}>🔔</span>
          {pendingOrders.length > 1
            ? `${pendingOrders.length} طلبات جديدة بانتظار التأكيد!`
            : "طلب جديد بانتظار التأكيد!"}
        </div>

        {pendingOrders.map((order) => (
          <div key={order.id} className="order-notif-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontWeight: 900, fontSize: "16px", color: "#DC2626" }}>
                #{order.id}
              </span>
              <span style={{ fontSize: "12px", color: "#888" }}>
                {new Date(order.createdAt).toLocaleTimeString("ar-PS")}
              </span>
            </div>
            <div style={{ fontWeight: 800, marginBottom: "4px" }}>{order.customerName}</div>
            <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>
              📞 {order.customerPhone}
            </div>
            <div style={{ color: "#666", fontSize: "13px", marginBottom: "14px" }}>
              🛵 {order.orderType} — <strong style={{ color: "#000" }}>{Number(order.totalAmount).toFixed(2)} ₪</strong>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleStartPreparing(order.id)}
                style={{
                  flex: 1,
                  background: "#DC2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px",
                  fontWeight: 900,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                ✅ قيد التحضير
              </button>
              <button
                onClick={() => handleDismiss(order.id)}
                style={{
                  background: "#f5f5f5",
                  color: "#666",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                تجاهل
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
