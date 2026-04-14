"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderSummary } from "@/lib/order-actions";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const branchSlug = searchParams.get("branchSlug");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const soundPlayed = useRef(false);

  // 🔊 Play success sound (MP3 or fallback tones)
  const playSuccessSound = () => {
    if (soundPlayed.current) return;
    soundPlayed.current = true;
    
    // Try playing the shared success sound file first
    try {
      const audio = new Audio('/sounds/success.mp3');
      audio.play().catch(() => {
        // Fallback to generated tones if file fails or not found
        playGeneratedTones();
      });
    } catch (e) {
      playGeneratedTones();
    }
  };

  const playGeneratedTones = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number, gain: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      const playSequence = (offset: number) => {
        playTone(523.25, offset + 0.0, 0.3, 0.6); // C5
        playTone(659.25, offset + 0.1, 0.3, 0.5); // E5
        playTone(783.99, offset + 0.2, 0.3, 0.4); // G5
        playTone(1046.50, offset + 0.3, 0.6, 0.3); // C6
      };
      playSequence(0);
    } catch (e) {}
  };

  useEffect(() => {
    // 1. Clear cart for this branch
    if (typeof window !== "undefined" && (window as any).Cart && branchSlug) {
      (window as any).Cart.clear(branchSlug);
    }

    // 2. Fetch Order Details
    if (orderId) {
      getOrderSummary(orderId).then(res => {
        if (res.success) {
          if (res.isDemo && typeof window !== "undefined") {
            const localData = sessionStorage.getItem(`demo_order_${orderId}`);
            if (localData) {
              try {
                const parsed = JSON.parse(localData);
                setOrderData(parsed);
              } catch (e) {
                setOrderData(res.order);
              }
            } else {
              setOrderData(res.order);
            }
          } else {
            setOrderData(res.order);
          }
        }
        setLoading(false);
        playSuccessSound();
      });
    } else {
      setLoading(false);
      playSuccessSound();
    }
  }, [orderId, branchSlug]);

  // Detect language from cookie
  const isAr = typeof document !== "undefined"
    ? document.cookie.includes("language=ar") || !document.cookie.includes("language=en")
    : true;

  // Calculate invoice breakdown
  const dPercent = orderData?.branches?.discount_percent || 0;
  const itemsSubtotal = (orderData?.order_items || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const discountAmount = (itemsSubtotal * dPercent) / 100;
  const deliveryFee = (orderData?.total_amount || 0) > 0 
    ? Math.max(0, (orderData.total_amount - (itemsSubtotal - discountAmount)))
    : 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF9F6' }}>
        <style dangerouslySetInnerHTML={{ __html: `.premium-loader { width: 48px; height: 48px; border: 5px solid #000; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; } @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
        <div className="premium-loader"></div>
      </div>
    );
  }

  return (
    <div className="success-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAF9F6',
      padding: '24px',
      textAlign: 'center',
      direction: isAr ? 'rtl' : 'ltr'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-icon { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @media print { 
          .success-page { background: #fff !important; padding: 0 !important; } 
          .no-print { display: none !important; } 
          .success-icon { display: none !important; }
          .invoice-box { 
            box-shadow: none !important; 
            border: 1px solid #000 !important; 
            border-radius: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            padding: 20px !important;
          }
          .items-list { max-height: none !important; overflow: visible !important; }
        }
      ` }} />

      <div className="invoice-box" style={{
        maxWidth: '550px',
        width: '100%',
        background: '#fff',
        padding: '40px',
        borderRadius: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
        border: '1px solid #ECEAE7'
      }}>
        {/* Success Icon */}
        <div className="success-icon" style={{
          width: '80px', height: '80px',
          background: '#cf1f28', borderRadius: '100px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 25px',
          color: '#fff', fontSize: '32px',
          boxShadow: '0 10px 30px rgba(207,31,40,0.25)'
        }}>✓</div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px', color: '#000' }}>
          {isAr ? 'تم استلام طلبك! 🎉' : 'Order Received! 🎉'}
        </h1>
        <p style={{ color: '#888', fontSize: '15px', marginBottom: '30px', fontWeight: 600 }}>
          {isAr
            ? `رقم الطلب: #${orderId}. سنتواصل معك قريباً.`
            : `Order reference: #${orderId}. We will contact you shortly.`}
        </p>

        {/* Invoice Summary */}
        {orderData && (
          <div className="invoice-receipt" style={{ 
            background: '#fff', 
            border: '1px solid #eee', 
            borderRadius: '25px', 
            padding: '30px', 
            marginBottom: '30px', 
            textAlign: 'right', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '25px', position: 'relative' }}>
                <img src="/logo.jpeg" alt="Uptown" style={{ height: '50px', marginBottom: '10px' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#000' }}>{isAr ? 'فاتورة طلب' : 'Order Invoice'}</h3>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>#{orderId}</p>
            </div>
            
            <div style={{ borderTop: '1px dashed #ddd', borderBottom: '1px dashed #ddd', padding: '15px 0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: '#888' }}>{isAr ? 'الاسم:' : 'Name:'}</span>
                    <span style={{ fontWeight: 800 }}>{orderData.customer_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#888' }}>{isAr ? 'الخدمة:' : 'Order:'}</span>
                    <span style={{ fontWeight: 800 }}>{orderData.order_type}</span>
                </div>
            </div>

            <div className="items-list" style={{ marginBottom: '20px' }}>
              {(orderData.order_items || []).map((oi: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontWeight: 800, color: '#000' }}>{isAr ? oi.product_name_ar : oi.product_name_en}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{oi.quantity} x {oi.price.toFixed(2)}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#000' }}>{(oi.price * oi.quantity).toFixed(2)} ₪</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '15px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                <span>{isAr ? 'المجموع' : 'Subtotal'}</span>
                <span>{itemsSubtotal.toFixed(2)} ₪</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669', fontWeight: 700, marginBottom: '8px' }}>
                  <span>{isAr ? `خصم (${dPercent}%)` : `Discount (${dPercent}%)`}</span>
                  <span>-{discountAmount.toFixed(2)} ₪</span>
                </div>
              )}
              {deliveryFee > 0.1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  <span>{isAr ? 'رسوم التوصيل' : 'Delivery'}</span>
                  <span>+{deliveryFee.toFixed(2)} ₪</span>
                </div>
              )}
            </div>

            <div style={{ 
                borderTop: '2px solid #000', 
                paddingTop: '15px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontWeight: 900, 
                fontSize: '1.5rem', 
                color: '#8B0000' 
            }}>
              <span>{isAr ? 'الإجمالي' : 'Total'}</span>
              <span>{orderData.total_amount || (itemsSubtotal - discountAmount + deliveryFee).toFixed(2)} ₪</span>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>
                {isAr ? 'شكراً لطلبكم! بالهناء والشفاء.' : 'Thank you for your order! Enjoy your meal.'}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* 🟢 Track Order Button */}
          {orderId && (
            <a href={`/order-status?orderId=${orderId}`} style={{
              background: 'linear-gradient(135deg, #8B0000 0%, #B91C1C 100%)',
              color: '#fff', width: '100%', borderRadius: '18px', height: '54px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '16px', textDecoration: 'none', gap: '10px',
              boxShadow: '0 10px 30px rgba(139,0,0,0.25)',
            }}>
              📍 {isAr ? 'تتبع طلبك الآن' : 'Track Your Order'}
            </a>
          )}

          <button onClick={() => window.print()} style={{
            background: '#f4f4f4', color: '#000',
            width: '100%', borderRadius: '18px', height: '50px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px',
            border: '1px solid #eee', cursor: 'pointer', gap: '8px'
          }}>
            💾 {isAr ? 'حفظ الفاتورة / طباعة' : 'Save Invoice / Print'}
          </button>

          <a href="/" style={{
            color: '#aaa', marginTop: '10px',
            fontWeight: 700, textDecoration: 'none',
            fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            {isAr ? '← العودة للرئيسية' : '← Back to Home'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF9F6' }}>
        <div style={{ width: 48, height: 48, border: '5px solid #000', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
