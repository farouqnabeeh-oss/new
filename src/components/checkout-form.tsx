"use client";

import { useState, useEffect, useTransition } from "react";
import { Branch, SiteSettings } from "@/lib/types";
import { saveOrderAction } from "@/lib/order-actions";
import Script from "next/script";
import { ShoppingBag, Truck, Utensils, Clock, CreditCard, Banknote, CheckCircle2, Info } from "lucide-react";

type Props = {
    branch: Branch;
    settings: SiteSettings;
    lang: string;
};

export default function CheckoutForm({ branch, settings, lang: initialLang }: Props) {
    const [lang, setLang] = useState(initialLang);
    const [orderType, setOrderType] = useState<"inRestaurant" | "delivery">("inRestaurant");
    const [subType, setSubType] = useState<"table" | "pickup">("table");
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "palpay">("cash");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [selectedZone, setSelectedZone] = useState("");
    const [isPending, startTransition] = useTransition();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    const isAr = lang === "ar";

    useEffect(() => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        if (branch.openingTime && branch.closingTime) {
            const [openH, openM] = branch.openingTime.split(':').map(Number);
            const [closeH, closeM] = branch.closingTime.split(':').map(Number);
            const openTotal = openH * 60 + openM;
            let closeTotal = closeH * 60 + closeM;
            if (closeTotal < openTotal) {
                setIsOpen(currentMinutes >= openTotal || currentMinutes <= closeTotal);
            } else {
                setIsOpen(currentMinutes >= openTotal && currentMinutes <= closeTotal);
            }
        }
    }, [branch.openingTime, branch.closingTime]);

    useEffect(() => {
        const syncData = () => {
            if ((window as any).Cart) {
                const items = (window as any).Cart.getItems(branch.slug);
                setCartItems(items);
                const itemsTotal = (window as any).Cart.getTotal(branch.slug);

                // Calculate Discount
                const dPercent = branch.discountPercent || 0;
                const dAmount = (itemsTotal * dPercent) / 100;

                setSubtotal(itemsTotal);
                setDiscount(dAmount);
                setTotal(itemsTotal - dAmount + deliveryFee);
            }
        };
        syncData();
        const interval = setInterval(syncData, 1000);
        return () => clearInterval(interval);
    }, [branch.slug, branch.discountPercent, deliveryFee]);

    // No client-side payment intent needed for Lahza redirect flow

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isOpen) return alert(isAr ? "عذراً، المطعم مغلق حالياً ولا يمكن استقبال الطلبات." : "Sorry, the restaurant is currently closed and cannot receive orders.");
        if (cartItems.length === 0) return alert(isAr ? "السلة فارغة" : "Cart is empty");

        const name = (document.getElementById('customer-name') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('customer-phone') as HTMLInputElement).value.trim();
        const email = (document.getElementById('customer-email') as HTMLInputElement).value.trim();
        const birthday = (document.getElementById('customer-birthday') as HTMLInputElement)?.value;
        const address = (document.getElementById('customer-address') as HTMLInputElement)?.value.trim();
        const table = (document.getElementById('customer-table') as HTMLInputElement)?.value.trim();
        const pickupTime = (document.getElementById('customer-pickup-time') as HTMLInputElement)?.value.trim();
        const notes = (document.getElementById('customer-notes') as HTMLTextAreaElement)?.value.trim();
        const policyAccepted = (document.getElementById('policy-accept') as HTMLInputElement).checked;

        if (!name || !phone) return alert(isAr ? 'يرجى ملأ جميع الحقول الأساسية (الاسم، الهاتف)' : 'Please fill all required fields (Name, Phone)');
        if (orderType === 'delivery' && (!selectedZone || !address)) return alert(isAr ? 'يرجى اختيار منطقة التوصيل وكتابة العنوان بالتفصيل' : 'Please select a delivery zone and enter your address');
        if (orderType === 'inRestaurant' && subType === 'table' && !table) return alert(isAr ? 'يرجى إدخال رقم الطاولة' : 'Please enter table number');
        if (orderType === 'inRestaurant' && subType === 'pickup' && !pickupTime) return alert(isAr ? 'يرجى اختيار وقت الاستلام' : 'Please select pickup time');
        if (!policyAccepted) return alert(isAr ? 'يجب الموافقة على الشروط والسياسات للمتابعة' : 'You must accept the terms and policies to continue');

        startTransition(async () => {
            // Recalculate fresh values to avoid stale state
            const items = (window as any).Cart.getItems(branch.slug);
            const freshItemsTotal = (window as any).Cart.getTotal(branch.slug);
            const dPercent = branch.discountPercent || 0;
            const freshDAmount = (freshItemsTotal * dPercent) / 100;
            const freshTotal = Number((freshItemsTotal - freshDAmount + deliveryFee).toFixed(2));

            const finalAddress = orderType === 'delivery' ? `${selectedZone} - ${address}` : address;
            try {
                const res = await saveOrderAction({
                    branchId: branch.id,
                    customerName: name,
                    customerPhone: phone,
                    customerEmail: email,
                    orderType: orderType === 'delivery' ? 'Delivery' : (subType === 'table' ? 'Table' : 'Pickup'),
                    address: finalAddress,
                    tableNumber: orderType === 'delivery' ? null : (subType === 'table' ? table : pickupTime),
                    totalAmount: freshTotal,
                    paymentMethod: paymentMethod === 'cash' ? 'Cash' : 'Card'
                }, items);

                if (res.isDemo && typeof window !== "undefined") {
                    console.log("[Checkout] Saving demo data locally for success page fallback");
                    const demoStore = {
                        customer_name: name,
                        order_type: orderType === 'delivery' ? 'Delivery' : (subType === 'table' ? 'Table' : 'Pickup'),
                        total_amount: freshTotal,
                        order_items: items.map((i: any) => ({
                            product_name_ar: i.nameAr,
                            product_name_en: i.nameEn,
                            quantity: i.quantity,
                            price: i.finalPrice
                        })),
                        branches: { discount_percent: branch.discountPercent },
                        method: paymentMethod
                    };
                    sessionStorage.setItem(`demo_order_${res.orderId}`, JSON.stringify(demoStore));
                }

                if (paymentMethod === "palpay") {
                    console.log(`[Checkout] Initiating online payment for ${freshTotal} ${settings.currencySymbol || '₪'}`);

                    const payRes = await fetch("/api/payments/lahza/initiate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            orderId: res.orderId,
                            email: email || "customer@uptown.ps", // Fallback for optional email
                            amount: freshTotal,
                            currency: settings.currencySymbol === "₪" ? "ILS" : settings.currencySymbol || "USD",
                            customerName: name,
                            customerPhone: phone,
                            branchSlug: branch.slug
                        })
                    });

                    const payData = await payRes.json();
                    if (payData.success && payData.authorizationUrl) {
                        window.location.href = payData.authorizationUrl;
                    } else {
                        console.error("Initiation Failed:", payData);
                        alert(isAr ? `فشل بدء عملية الدفع: ${payData.error || 'خطأ فني'}` : `Failed to initiate payment: ${payData.error || 'Technical error'}`);
                    }
                } else {
                    // Success for WhatsApp/Cash
                    try {
                        const audio = new Audio('/sounds/success.mp3');
                        audio.play().catch(e => console.log("Sound play error", e));
                    } catch (e) { }

                    // Construct WhatsApp Message
                    const orderTypeLabel = orderType === 'delivery' ? (isAr ? 'توصيل' : 'Delivery') : (subType === 'table' ? (isAr ? 'طاولة' : 'Table') : (isAr ? 'استلام' : 'Pickup'));
                    const itemsTxt = items.map((i: any) => `- ${i.quantity}x ${isAr ? i.nameAr : i.nameEn} (${i.finalPrice} ₪)`).join('%0A');
                    const msg = `*طلب جديد من UPTOWN*%0A%0A` +
                        `*العميل:* ${name}%0A` +
                        `*الهاتف:* ${phone}%0A` +
                        `*نوع الطلب:* ${orderTypeLabel}%0A` +
                        `${orderType === 'delivery' ? `*العنوان:* ${finalAddress}` : (subType === 'table' ? `*رقم الطاولة:* ${table}` : `*وقت الاستلام:* ${pickupTime}`)}%0A%0A` +
                        `*الأصناف:*%0A${itemsTxt}%0A%0A` +
                        `*المجموع:* ${freshTotal} ₪%0A%0A` +
                        `_تم إرسال الطب عبر الموقع الإلكتروني_`;

                    const waLink = `https://wa.me/${branch.whatsApp.replace(/\+/g, '').replace(/\s/g, '')}?text=${msg}`;

                    // Redirect to success but open WhatsApp
                    window.open(waLink, '_blank');
                    window.location.href = `/checkout/success?orderId=${res.orderId}&branchSlug=${branch.slug}&method=cash`;
                }
            } catch (err: any) {
                alert(isAr ? "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." : "Critical Error: " + err.message);
            }
        });
    };

    return (
        <div className="uptown-checkout-wrapper" style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <img src="/logo.jpeg" alt="Uptown" style={{ display: 'block', margin: '0 auto 20px auto', height: '80px' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px' }}>{isAr ? 'إتمام الطلب' : 'Checkout'}</h1>
                <p style={{ fontWeight: 800, color: '#8b0000', fontSize: '1.1rem', marginBottom: '15px' }}>{isAr ? branch.nameAr : branch.nameEn}</p>
                <button onClick={() => window.history.back()} style={{ color: '#666', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>{isAr ? '← رجوع للقائمة' : '← Back to Menu'}</button>
            </div>

            {!isOpen && (
                <div style={{
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '24px',
                    padding: '24px',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.05)'
                }}>
                    <div style={{ background: '#DC2626', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <h4 style={{ color: '#991B1B', fontWeight: 900, marginBottom: '5px' }}>{isAr ? 'المطعم مغلق حالياً' : 'Restaurant Currently Closed'}</h4>
                        <p style={{ color: '#B91C1C', fontSize: '14px', fontWeight: 600 }}>
                            {isAr
                                ? `نعتذر منك، ساعات العمل في هذا الفرع من ${branch.openingTime} حتى ${branch.closingTime}. يمكنك تصفح المنيو ولكن لا يمكن استقبال طلبات حالياً.`
                                : `We apologize, this branch operates from ${branch.openingTime} to ${branch.closingTime}. You can browse the menu but cannot place orders at this time.`
                            }
                        </p>
                    </div>
                </div>
            )}

            <div className="checkout-main-grid" style={{ background: '#FDFCFB', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid #ECEAE7' }}>

                {/* 📋 ORDER TYPE */}
                <div style={{ marginBottom: '40px' }}>
                    <h4 style={{ fontWeight: 800, marginBottom: '20px', fontSize: '1.2rem' }}>{isAr ? 'نوع الطلب' : 'Order Type'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div onClick={() => setOrderType('inRestaurant')} className={`premium-choice-card ${orderType === 'inRestaurant' ? 'active' : ''}`}>
                            <Utensils size={32} />
                            <span>{isAr ? 'داخل المطعم' : 'In Restaurant'}</span>
                        </div>
                        <div onClick={() => setOrderType('delivery')} className={`premium-choice-card ${orderType === 'delivery' ? 'active' : ''}`}>
                            <Truck size={32} />
                            <span>{isAr ? 'توصيل ' : 'Delivery'}</span>
                        </div>
                    </div>
                </div>

                {orderType === 'inRestaurant' && (
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div onClick={() => setSubType('table')} className={`premium-choice-card sm ${subType === 'table' ? 'active' : ''}`}>
                                <span>{isAr ? 'رقم الطاولة' : 'Table Number'}</span>
                            </div>
                            <div onClick={() => setSubType('pickup')} className={`premium-choice-card sm ${subType === 'pickup' ? 'active' : ''}`}>
                                <span>{isAr ? 'استلام' : 'Pickup'}</span>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                        <div className="uptown-input-group">
                            <label>{isAr ? 'الاسم الكامل' : 'Full Name'} *</label>
                            <input type="text" id="customer-name" required className="uptown-input" />
                        </div>
                        <div className="uptown-input-group">
                            <label>{isAr ? 'رقم الهاتف' : 'Phone'} *</label>
                            <input type="tel" id="customer-phone" required className="uptown-input" />
                        </div>
                        <div className="uptown-input-group">
                            <label>{isAr ? 'البريد الإلكتروني' : 'Email'} ({isAr ? 'اختياري' : 'Optional'})</label>
                            <input type="email" id="customer-email" className="uptown-input" suppressHydrationWarning />
                        </div>
                        <div className="uptown-input-group">
                            <label>{isAr ? 'تاريخ الميلاد' : 'Birth Date'} ({isAr ? 'اختياري' : 'Optional'})</label>
                            <input type="date" id="customer-birthday" className="uptown-input" />
                        </div>

                        {orderType === 'delivery' && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 800, marginBottom: '15px' }}>{isAr ? 'منطقة التوصيل' : 'Delivery Zone'} <span className="required-star">*</span></label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                                    {branch.deliveryZones?.map(z => {
                                        const zoneName = isAr ? (z.nameAr || (z as any).name) : (z.nameEn || (z as any).name);
                                        return (
                                            <div key={zoneName} onClick={() => { setDeliveryFee(z.fee); setSelectedZone(zoneName); }} className={`premium-choice-card sm ${selectedZone === zoneName ? 'active' : ''}`}>
                                                <span style={{ fontSize: '13px' }}>{zoneName}</span>
                                                <span style={{ fontSize: '11px', opacity: 0.6 }}>+{z.fee} {settings.currencySymbol}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="uptown-input-group" style={{ marginTop: '20px' }}>
                                    <label>{isAr ? 'العنوان بالتفصيل' : 'Detailed Address'} *</label>
                                    <input type="text" id="customer-address" required className="uptown-input" />
                                </div>
                            </div>
                        )}

                        {orderType === 'inRestaurant' && subType === 'table' && (
                            <div className="uptown-input-group" style={{ gridColumn: 'span 2' }}>
                                <label>{isAr ? 'رقم الطاولة' : 'Table Number'} *</label>
                                <input type="text" id="customer-table" required className="uptown-input" />
                            </div>
                        )}

                        {orderType === 'inRestaurant' && subType === 'pickup' && (
                            <div className="uptown-input-group" style={{ gridColumn: 'span 2' }}>
                                <label>{isAr ? 'وقت الاستلام' : 'Pickup Time'} *</label>
                                <input type="time" id="customer-pickup-time" required className="uptown-input" />
                            </div>
                        )}

                        <div className="uptown-input-group" style={{ gridColumn: 'span 2' }}>
                            <label>{isAr ? 'ملاحظات إضافية' : 'Notes'}</label>
                            <textarea id="customer-notes" rows={3} className="uptown-input" />
                        </div>
                    </div>

                    {/* 📦 SUMMARY BOX */}
                    <div style={{ background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '30px', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 800 }}>{cartItems.length} {isAr ? 'أصناف في السلة' : 'Items'}</span>
                            <span style={{ color: '#666', fontSize: '14px' }}>{isAr ? 'المجموع' : 'Subtotal'}: {subtotal.toFixed(2)}</span>
                        </div>
                        {cartItems.map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: '#666' }}>
                                <span>{item.quantity}x {isAr ? item.nameAr : item.nameEn}</span>
                                <span>{item.finalPrice.toFixed(2)}</span>
                            </div>
                        ))}

                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669', fontWeight: 700, marginBottom: '8px' }}>
                                    <span>{isAr ? 'خصم العرض' : 'Discount'} ({branch.discountPercent}%)</span>
                                    <span>-{discount.toFixed(2)} {settings.currencySymbol}</span>
                                </div>
                            )}
                            {deliveryFee > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', fontWeight: 700, marginBottom: '8px' }}>
                                    <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                                    <span>+{deliveryFee.toFixed(2)} {settings.currencySymbol}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#E31E24', fontWeight: 900, marginTop: '10px' }}>
                                <span>{isAr ? 'المجموع النهائي' : 'Grand Total'}</span>
                                <span>{total.toFixed(2)} {settings.currencySymbol}</span>
                            </div>
                        </div>
                    </div>

                    {/* 💳 PAYMENT */}
                    <div style={{ marginBottom: '40px' }}>
                        <h4 style={{ fontWeight: 800, marginBottom: '20px' }}>{isAr ? 'اختر طريقة الطلب والدفع' : 'Choose Order & Payment Method'}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div onClick={() => setPaymentMethod('cash')} className={`premium-choice-card ${paymentMethod === 'cash' ? 'active' : ''}`} style={{ padding: '25px' }}>
                                <Banknote size={36} />
                                <span style={{ fontSize: '14px', marginTop: '10px' }}>{isAr ? 'الطلب والدفع عبر واتساب' : 'Order & Pay via WhatsApp'}</span>
                            </div>
                            <div onClick={() => setPaymentMethod('palpay')} className={`premium-choice-card ${paymentMethod === 'palpay' ? 'active' : ''}`} style={{ padding: '25px' }}>
                                <CreditCard size={36} />
                                <span style={{ fontSize: '14px', marginTop: '10px' }}>{isAr ? 'دفع إلكتروني بطاقة/لحظة' : 'Online Payment Card/Lahza'}</span>
                            </div>
                        </div>
                    </div>

                    {paymentMethod === 'palpay' && (
                        <div style={{ background: '#fff', padding: '25px', borderRadius: '30px', border: '2px solid #EEE', marginBottom: '40px', textAlign: 'center' }}>
                            <p style={{ fontWeight: 600, color: '#666' }}>
                                {isAr ? "سيتم توجيهك إلى بوابة الدفع الآمنة لإتمام العملية." : "You will be redirected to our secure payment gateway to complete your request."}
                            </p>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
                                <div className="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" id="policy-accept" required style={{ width: '22px', height: '22px' }} />
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{isAr ? 'أوافق على الشروط والسياسات' : 'I accept the terms and policies'}</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button type="submit" className="uptown-btn red" disabled={isPending || !isOpen} style={{ opacity: !isOpen ? 0.6 : 1, cursor: !isOpen ? 'not-allowed' : 'pointer' }}>
                            <CheckCircle2 color="#fff" />
                            {!isOpen
                                ? (isAr ? 'المطعم مغلق حالياً' : 'Restaurant Closed')
                                : (isPending
                                    ? (isAr ? 'جاري المعالجة...' : 'Processing...')
                                    : (paymentMethod === 'palpay'
                                        ? (isAr ? 'المتابعة للدفع الإلكتروني' : 'Continue to Online Payment')
                                        : (isAr ? 'تأكيد إرسال الطلب' : 'Confirm & Send')))}
                        </button>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .premium-choice-card {
                    background: #fff; border: 2px solid #ECEAE7; border-radius: 25px; 
                    padding: 30px 20px; display: flex; flex-direction: column; align-items: center; 
                    gap: 15px; cursor: pointer; transition: all 0.3s ease; text-align: center;
                }
                .premium-choice-card.active {
                    background: #FDF4F4; border-color: #E31E24; color: #E31E24; box-shadow: 0 10px 30px rgba(227,30,36,0.1);
                }
                .premium-choice-card.sm { padding: 15px; border-radius: 18px; flex-direction: row; justify-content: center; }
                .premium-choice-card span { font-weight: 800; }
                
                .uptown-input-group { display: flex; flex-direction: column; gap: 8px; }
                .uptown-input-group label { font-size: 13px; font-weight: 800; color: #1a1a1a; padding-right: 5px; }
                .uptown-input { 
                    padding: 16px 20px; border-radius: 18px; border: 1px solid #ECEAE7; 
                    background: #fff; font-size: 15px; font-weight: 600; outline: none; transition: 0.3s;
                }
                .uptown-input:focus { border-color: #E31E24; box-shadow: 0 0 0 4px rgba(227,30,36,0.05); }
                
                .uptown-btn {
                    width: 100%; padding: 20px; border-radius: 25px; border: none; font-size: 18px; 
                    font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.3s;
                }
                .uptown-btn.red { background: #8B0000; color: #fff; box-shadow: 0 10px 40px rgba(139,0,0,0.3); }
                .uptown-btn.blue { background: #2563EB; color: #fff; box-shadow: 0 10px 40px rgba(37,99,235,0.2); }
                .uptown-btn:hover { transform: scale(1.02); opacity: 0.95; }
                .uptown-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            ` }} />
        </div>
    );
}
