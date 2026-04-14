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

  const playAlarmTone = useCallback(() => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      const playBeep = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };

      // Triple beep alarm pattern
      playBeep(880, 0.0, 0.2);
      playBeep(1100, 0.25, 0.2);
      playBeep(880, 0.5, 0.2);
      playBeep(1100, 0.75, 0.4);
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

      // Check for new orders
      const newOrders = orders.filter(o => !seenIds.current.has(String(o.id)));
      if (newOrders.length > 0) {
        newOrders.forEach(o => seenIds.current.add(String(o.id)));
        playAlarmTone();
      }

      setPendingOrders(orders.filter(o => !dismissed.has(String(o.id))));
    } catch (e) {
      // Silently fail - DB might not be configured
    }
  }, [dismissed, playAlarmTone]);

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 8000); // Poll every 8s
    return () => clearInterval(interval);
  }, [fetchPendingOrders]);

  // Persistent alarm sound every 5s while there are unacknowledged pending orders
  useEffect(() => {
    if (pendingOrders.length > 0) {
      if (!alarmIntervalRef.current) {
        alarmIntervalRef.current = setInterval(playAlarmTone, 5000);
      }
    } else {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    }
    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    };
  }, [pendingOrders.length, playAlarmTone]);

  const handleStartPreparing = async (orderId: string | number) => {
    try {
      await fetch("/api/admin/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: "Preparing" }),
      });
      setDismissed(prev => new Set([...prev, String(orderId)]));
      setPendingOrders(prev => prev.filter(o => String(o.id) !== String(orderId)));
    } catch (e) {
      alert("فشل تحديث حالة الطلب");
    }
  };

  const handleDismiss = (orderId: string | number) => {
    setDismissed(prev => new Set([...prev, String(orderId)]));
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
