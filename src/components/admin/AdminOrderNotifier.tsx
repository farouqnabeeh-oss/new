"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useToast } from "./AdminToast";

interface PendingOrder {
  id: number | string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  orderType: string;
  createdAt: string;
}

interface AdminOrderNotifierProps {
  role: string;
}

export function AdminOrderNotifier({ role }: AdminOrderNotifierProps) {
  const isCashier = role === "cashier";
  const isAdmin = role === "admin";

  const seenKey = `seen_orders_${role}`;
  const dismissedKey = `dismissed_orders_${role}`;

  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isAdmin);

  // ref عشان playAlarmTone يقرأ القيمة الحالية دايماً حتى داخل الـ interval
  const soundEnabledRef = useRef<boolean>(isAdmin);

  const seenIds = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const savedSeen = localStorage.getItem(seenKey);
    const savedDismissed = localStorage.getItem(dismissedKey);
    if (savedSeen) {
      try {
        const arr = JSON.parse(savedSeen);
        if (Array.isArray(arr)) arr.forEach(id => seenIds.current.add(String(id)));
      } catch (e) { }
    }
    if (savedDismissed) {
      try {
        const arr = JSON.parse(savedDismissed);
        if (Array.isArray(arr)) setDismissed(new Set(arr.map(String)));
      } catch (e) { }
    }
  }, []);

  const persistSeen = () => {
    localStorage.setItem(seenKey, JSON.stringify(Array.from(seenIds.current)));
  };

  const playAlarmTone = useCallback(() => {
    if (isAdmin) return;
    // نقرأ من الـ ref مش من الـ state عشان دايماً نشوف القيمة الحالية
    if (!soundEnabledRef.current) return;

    try {
      const audio = new Audio('/sounds/success.mp3');
      audio.play().catch(() => {
        try {
          if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') ctx.resume();

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 1.0);
        } catch (e) { }
      });
    } catch (e) { }
  }, [isAdmin]);

  const fetchPendingOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pending-orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const orders: PendingOrder[] = data.orders || [];

      const filteredPending = orders.filter(o => !dismissed.has(String(o.id)));
      const trulyNewOrders = filteredPending.filter(o => !seenIds.current.has(String(o.id)));

      if (trulyNewOrders.length > 0) {
        trulyNewOrders.forEach(o => {
          seenIds.current.add(String(o.id));
          showToast(`📦 طلب جديد (#${o.id}): ${o.customerName}`, "info");
        });
        persistSeen();
        if (isCashier) playAlarmTone();
      }

      setPendingOrders(filteredPending);
    } catch (e) { }
  }, [dismissed, playAlarmTone, showToast, isCashier]);

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 6000);
    return () => clearInterval(interval);
  }, [fetchPendingOrders]);

  // شاشة تفعيل الصوت للكاشير
  if (isCashier && !soundEnabled) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '20px'
      }}>
        <div style={{
          background: '#fff', padding: '40px', borderRadius: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', maxWidth: '400px'
        }}>
          <h2 style={{ fontWeight: 900, marginBottom: '20px' }}>📢 تفعيل التنبيهات</h2>
          <p style={{ color: '#666', marginBottom: '30px', fontWeight: 600 }}>
            يجب تفعيل الصوت حتى يصلك رنين عند استلام طلبات جديدة من الزبائن.
          </p>
          <button
            onClick={() => {
              // نحدث الـ ref فوراً عشان الـ interval الشغال يشوف التغيير
              soundEnabledRef.current = true;
              setSoundEnabled(true);

              // نفتح AudioContext بضغطة المستخدم عشان المتصفح ما يمنعنا
              try {
                const audio = new Audio('/sounds/success.mp3');
                audio.play().catch(() => {
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    audioCtxRef.current = ctx;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(880, ctx.currentTime);
                    gain.gain.setValueAtTime(0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 1.0);
                  } catch (e) { }
                });
              } catch (e) { }
            }}
            style={{
              background: '#8b0000', color: '#fff', border: 'none',
              padding: '15px 30px', borderRadius: '20px',
              fontSize: '1.1rem', fontWeight: 900, width: '100%', cursor: 'pointer'
            }}
          >
            تفعيل الآن
          </button>
        </div>
      </div>
    );
  }

  if (pendingOrders.length > 0) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
        background: 'linear-gradient(to bottom, #8b0000, #dc2626)',
        color: '#fff', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        borderBottom: '2px solid rgba(255,255,255,0.2)',
        animation: 'slideDown 0.4s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            background: '#fff', color: '#8b0000',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 900, animation: 'pulse 1s infinite'
          }}>
            {pendingOrders.length}
          </div>
          <span style={{ fontWeight: 800, fontSize: '16px' }}>
            لديك {pendingOrders.length} طلبات جديدة متوقفة! الرجاء مراجعتها وتغيير حالتها إلى "قيد التحضير".
          </span>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#fff', color: '#8b0000', border: 'none',
            padding: '8px 16px', borderRadius: '12px',
            fontWeight: 900, cursor: 'pointer'
          }}
        >
          تحديث الصفحة
        </button>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse { 
              0% { opacity: 1; transform: scale(1); } 
              50% { opacity: 0.7; transform: scale(1.1); } 
              100% { opacity: 1; transform: scale(1); } 
            }
            @keyframes slideDown { 
              from { transform: translateY(-100%); } 
              to { transform: translateY(0); } 
            }
          `
        }} />
      </div>
    );
  }

  return null;
}