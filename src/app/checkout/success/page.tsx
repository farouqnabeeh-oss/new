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

  // 🔊 Play success chime using Web Audio API (no external file needed)
  const playSuccessSound = () => {
    if (soundPlayed.current) return;
    soundPlayed.current = true;
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
        gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      // Success arpeggio chime: C5 → E5 → G5 → C6
      playTone(523, 0.0, 0.3, 0.4);
      playTone(659, 0.2, 0.3, 0.3);
      playTone(784, 0.4, 0.3, 0.3);
      playTone(1047, 0.6, 0.6, 0.25);
    } catch (e) {
      // Audio not supported — silent fail
    }
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

  // Calculate invoice breakdown once for use in both UI and WhatsApp
  const dPercent = orderData?.branches?.discount_percent || 0;
  const itemsSubtotal = (orderData?.order_items || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const discountAmount = (itemsSubtotal * dPercent) / 100;
  const deliveryFee = (orderData?.total_amount || 0) > 0 
    ? Math.max(0, (orderData.total_amount - (itemsSubtotal - discountAmount)))
    : 0;

  const shareOnWhatsApp = () => {
    if (!orderData) return;

    const itemsList = (orderData.order_items || []).map((oi: any) =>
      `- ${oi.quantity}x ${isAr ? oi.product_name_ar : oi.product_name_en}`
    ).join('\n');

    const customerName = orderData.customer_name || (isAr ? "غير متوفّر" : "N/A");
    const orderTypeStr = orderData.order_type || (isAr ? "غير محدد" : "N/A");
    const finalTotal = orderData.total_amount || (itemsSubtotal - discountAmount + deliveryFee);

    const message = isAr
      ? `*طلب جديد رقم #${orderId}*\n\n*الاسم:* ${customerName}\n*نوع الطلب:* ${orderTypeStr}\n\n*الأصناف:*\n${itemsList}\n\n*المجموع:* ${itemsSubtotal.toFixed(2)} ₪\n${discountAmount > 0 ? `*الخصم:* -${discountAmount.toFixed(2)} ₪\n` : ''}${deliveryFee > 0.1 ? `*التوصيل:* +${deliveryFee.toFixed(2)} ₪\n` : ''}*المجموع النهائي:* ${finalTotal.toFixed(2)} ₪\n\nيرجى تأكيد الطلب. شكراً 🙏`
      : `*New Order #${orderId}*\n\n*Name:* ${customerName}\n*Type:* ${orderTypeStr}\n\n*Items:*\n${itemsList}\n\n*Subtotal:* ${itemsSubtotal.toFixed(2)} ₪\n${discountAmount > 0 ? `*Discount:* -${discountAmount.toFixed(2)} ₪\n` : ''}${deliveryFee > 0.1 ? `*Delivery:* +${deliveryFee.toFixed(2)} ₪\n` : ''}*Grand Total:* ${finalTotal.toFixed(2)} ₪\n\nPlease confirm my order. Thank you 🙏`;

    const whatsappNumber = (orderData.branches?.whatsapp || "970222951234")
      .replace(/\+/g, '').replace(/\s/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

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
          <div style={{ background: '#fcfcfc', border: '1px dashed #ddd', borderRadius: '25px', padding: '25px', marginBottom: '30px', textAlign: 'right' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 900, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {isAr ? '🧾 ملخص الفاتورة' : '🧾 Invoice Summary'}
            </h4>
            <div className="items-list" style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px' }}>
              {(orderData.order_items || []).map((oi: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{ color: '#555' }}>{oi.quantity}x {isAr ? oi.product_name_ar : oi.product_name_en}</span>
                  <span style={{ color: '#000' }}>{(oi.price * oi.quantity).toFixed(2)} ₪</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                <span>{isAr ? 'المجموع' : 'Subtotal'}</span>
                <span>{itemsSubtotal.toFixed(2)} ₪</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#059669', fontWeight: 700, marginBottom: '6px' }}>
                  <span>{isAr ? `خصم العرض (${dPercent}%)` : `Discount (${dPercent}%)`}</span>
                  <span>-{discountAmount.toFixed(2)} ₪</span>
                </div>
              )}
              {deliveryFee > 0.1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                  <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                  <span>+{deliveryFee.toFixed(2)} ₪</span>
                </div>
              )}
            </div>

            <div style={{ borderTop: '2px solid #000', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.2rem' }}>
              <span>{isAr ? 'المجموع النهائي' : 'Grand Total'}</span>
              <span style={{ color: '#cf1f28' }}>{orderData.total_amount} ₪</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={shareOnWhatsApp} style={{
            background: '#25D366', color: '#fff',
            width: '100%', borderRadius: '18px', height: '58px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '16px', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37,211,102,0.25)',
            gap: '10px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.534 5.836L0 24l6.29-1.503A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.886 9.886 0 01-5.035-1.378l-.361-.214-3.733.892.939-3.617-.236-.375A9.856 9.856 0 012.106 12C2.106 6.527 6.527 2.106 12 2.106c5.473 0 9.894 4.421 9.894 9.894 0 5.473-4.421 9.894-9.894 9.894z"/></svg>
            {isAr ? 'إرسال الطلب عبر واتساب' : 'Send Order via WhatsApp'}
          </button>

          <button onClick={() => window.print()} style={{
            background: '#f4f4f4', color: '#000',
            width: '100%', borderRadius: '18px', height: '50px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px',
            border: '1px solid #eee', cursor: 'pointer', gap: '8px'
          }}>
            🖨️ {isAr ? 'طباعة الفاتورة' : 'Print Invoice'}
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
