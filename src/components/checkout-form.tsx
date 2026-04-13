"use client";

import { useState, useEffect, useTransition } from "react";
import { Branch, SiteSettings } from "@/lib/types";
import { saveOrderAction } from "@/lib/order-actions";
import Script from "next/script";
import { ShoppingBag, Truck, Utensils, Clock, CreditCard, Banknote, CheckCircle2, Info } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

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
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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

                // Delivery Logic
                let effectiveFee = orderType === 'delivery' ? (deliveryFee || settings.deliveryFee || 0) : 0;
                
                if (branch.freeDelivery) {
                    effectiveFee = 0;
                } else if (branch.deliveryDiscountPercent && branch.deliveryDiscountPercent > 0) {
                    effectiveFee = effectiveFee - (effectiveFee * branch.deliveryDiscountPercent / 100);
                }

                setSubtotal(itemsTotal);
                setDiscount(dAmount);
                setTotal(itemsTotal - dAmount + effectiveFee);
            }
        };
        syncData();
        const interval = setInterval(syncData, 1000);
        return () => clearInterval(interval);
    }, [branch.slug, branch.discountPercent, deliveryFee, branch.freeDelivery, branch.deliveryDiscountPercent]);

    // No client-side payment intent needed for Lahza redirect flow

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return alert(isAr ? "السلة فارغة" : "Cart is empty");

        const name = (document.getElementById('customer-name') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('customer-phone') as HTMLInputElement).value.trim();
        const email = (document.getElementById('customer-email') as HTMLInputElement).value.trim();
        const birthday = (document.getElementById('customer-birthday') as HTMLInputElement)?.value;
        const street = (document.getElementById('customer-street') as HTMLInputElement)?.value.trim() || "";
        const building = (document.getElementById('customer-building') as HTMLInputElement)?.value.trim() || "";
        const addressNotes = (document.getElementById('customer-address-notes') as HTMLInputElement)?.value.trim() || "";
        const address = street ? `${street}, ${building}${addressNotes ? ` (${addressNotes})` : ""}` : "";
        
        const table = (document.getElementById('customer-table') as HTMLInputElement)?.value.trim();
        const pickupTime = (document.getElementById('customer-pickup-time') as HTMLInputElement)?.value.trim();
        const notes = (document.getElementById('customer-notes') as HTMLTextAreaElement)?.value.trim();
        const policyAccepted = (document.getElementById('policy-accept') as HTMLInputElement).checked;

        if (!name || !phone) return alert(isAr ? 'يرجى ملأ جميع الحقول الأساسية (الاسم، الهاتف)' : 'Please fill all required fields (Name, Phone)');
        if (paymentMethod === 'palpay' && !email) return alert(isAr ? 'يرجى إدخال البريد الإلكتروني لإتمام الدفع بالفيزا' : 'Please enter your email to complete Visa payment');
        if (orderType === 'delivery' && (!selectedZone || !street || !building)) return alert(isAr ? 'يرجى اختيار منطقة التوصيل وإدخال بيانات الشارع والبناية بالتفصيل' : 'Please select a delivery zone and enter street and building details');
        if (orderType === 'inRestaurant' && subType === 'table' && !table) return alert(isAr ? 'يرجى إدخال رقم الطاولة' : 'Please enter table number');
        if (orderType === 'inRestaurant' && subType === 'pickup' && !pickupTime) return alert(isAr ? 'يرجى اختيار وقت الاستلام' : 'Please select pickup time');
        if (!policyAccepted) return alert(isAr ? 'يجب الموافقة على الشروط والسياسات للمتابعة' : 'You must accept the terms and policies to continue');

        // Verify Captcha Check
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (siteKey && !captchaToken) {
            return alert(isAr ? "يرجى تأكيد أنك لست روبوت" : "Please confirm you are not a bot");
        }

        startTransition(async () => {
            // Recalculate fresh values to avoid stale state
            const items = (window as any).Cart.getItems(branch.slug);
            const freshItemsTotal = (window as any).Cart.getTotal(branch.slug);
            const dPercent = branch.discountPercent || 0;
            const freshDAmount = (freshItemsTotal * dPercent) / 100;

            let freshEffectiveFee = deliveryFee;
            if (branch.freeDelivery) {
                freshEffectiveFee = 0;
            } else if (branch.deliveryDiscountPercent && branch.deliveryDiscountPercent > 0) {
                freshEffectiveFee = freshEffectiveFee - (freshEffectiveFee * branch.deliveryDiscountPercent / 100);
            }

            const freshTotal = Number((freshItemsTotal - freshDAmount + freshEffectiveFee).toFixed(2));

            const finalAddress = orderType === 'delivery' ? `${selectedZone} - ${address}` : address;
            try {
                const mappedItems = items.map((i: any) => {
                    const normalAddons = i.selectedAddOns?.filter((a: any) => !(a.nameAr || '').includes('بدون') && !(a.nameEn || '').toLowerCase().includes('without') && !(a.nameEn || '').toLowerCase().includes('no '));
                    const noteAddons = i.selectedAddOns?.filter((a: any) => (a.nameAr || '').includes('بدون') || (a.nameEn || '').toLowerCase().includes('without') || (a.nameEn || '').toLowerCase().includes('no '));
                    const parts = [];
                    if (i.selectedSize) parts.push(`الحجم: ${isAr ? i.selectedSize.nameAr : i.selectedSize.nameEn}`);
                    if (i.selectedType) parts.push(`النوع: ${isAr ? i.selectedType.nameAr : i.selectedType.nameEn}`);
                    if (normalAddons?.length) parts.push(`إضافات: ` + normalAddons.map((a:any)=> isAr ? a.nameAr : a.nameEn).join('، '));
                    if (noteAddons?.length) parts.push(`ملاحظات: ` + noteAddons.map((a:any)=> isAr ? a.nameAr : a.nameEn).join('، '));
                    if (i.note) parts.push(`ملاحظة إضافية: ${i.note}`);
                    
                    return { ...i, addonDetails: parts.join(' | ') };
                });

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
                }, mappedItems, captchaToken || undefined);

                console.log("[Checkout] Order Save Result:", res);

                // Check if order was saved successfully
                if (!res.success || !res.orderId) {
                    alert(isAr
                        ? `فشل حفظ الطلب: ${res.error || 'خطأ غير متوقع، يرجى المحاولة مرة أخرى'}`
                        : `Failed to save order: ${res.error || 'Unexpected error, please try again'}`
                    );
                    return;
                }

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
                    const itemsTxt = mappedItems.map((i: any) => `- ${i.quantity}x ${isAr ? i.nameAr : i.nameEn} (${i.finalPrice} ₪) %0A   ${i.addonDetails || ''}`).join('%0A');
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
        <div className="uptown-checkout-wrapper" style={{ margin: '0 auto', background: '#fff' }}>


            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 1px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '5px' }}>{isAr ? 'إتمام الطلب' : 'Checkout'}</h1>
                    <p style={{ fontWeight: 800, color: '#8b0000', fontSize: '1rem', marginBottom: '15px' }}>{isAr ? branch.nameAr : branch.nameEn}</p>
                    <button onClick={() => window.history.back()} style={{ color: '#666', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>{isAr ? '← رجوع للقائمة' : '← Back to Menu'}</button>
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
                            <label>
                                {isAr ? 'البريد الإلكتروني' : 'Email'} 
                                {paymentMethod !== 'palpay' ? (isAr ? ' (اختياري)' : ' (Optional)') : ' *'}
                            </label>
                            <input type="email" id="customer-email" className="uptown-input" required={paymentMethod === 'palpay'} suppressHydrationWarning />
                        </div>
                        <div className="uptown-input-group">
                            <label>{isAr ? 'تاريخ الميلاد' : 'Birth Date'} ({isAr ? 'اختياري' : 'Optional'})</label>
                            <input type="date" id="customer-birthday" className="uptown-input" />
                        </div>

                        {orderType === 'delivery' && (
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontWeight: 800, marginBottom: '10px' }}>{isAr ? 'منطقة التوصيل' : 'Delivery Zone'} <span className="required-star">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <select 
                                        className="uptown-input premium-select" 
                                        style={{ width: '100%', cursor: 'pointer', backgroundPosition: 'left 20px center' }}
                                        value={selectedZone}
                                        onChange={(e) => {
                                            const zone = branch.deliveryZones?.find(z => (isAr ? (z.nameAr || (z as any).name) : (z.nameEn || (z as any).name)) === e.target.value);
                                            if (zone) {
                                                setDeliveryFee(zone.fee);
                                                setSelectedZone(e.target.value);
                                            } else {
                                                setDeliveryFee(0);
                                                setSelectedZone("");
                                            }
                                        }}
                                    >
                                        <option value="">{isAr ? '--- اختر المنطقة ---' : '--- Choose Zone ---'}</option>
                                        {(branch.deliveryZones ?? []).length > 0 ? (branch.deliveryZones ?? []).map((z, zIdx) => {
                                            const zoneName = isAr ? z.nameAr : z.nameEn;
                                            if (!zoneName) return null;
                                            const feeText = z.fee === 0 
                                                ? (isAr ? 'مجاناً' : 'Free') 
                                                : `+${z.fee} ${settings.currencySymbol}`;
                                            return <option key={`zone-${zIdx}`} value={zoneName}>{zoneName} ({feeText})</option>;
                                        }) : <option value="Manual" disabled>{isAr ? 'المناطق غير متاحة حالياً' : 'Zones momentarily unavailable'}</option>}
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                                    <div className="uptown-input-group">
                                        <label>{isAr ? 'اسم الشارع' : 'Street Name'} *</label>
                                        <input type="text" id="customer-street" required className="uptown-input" />
                                    </div>
                                    <div className="uptown-input-group">
                                        <label>{isAr ? 'البناية / الشقة' : 'Building / Apt'} *</label>
                                        <input type="text" id="customer-building" required className="uptown-input" />
                                    </div>
                                </div>
                                <div className="uptown-input-group" style={{ marginTop: '20px' }}>
                                    <label>{isAr ? 'ملاحظات العنوان' : 'Address Notes'} ({isAr ? 'اختياري' : 'Optional'})</label>
                                    <input type="text" id="customer-address-notes" className="uptown-input" placeholder={isAr ? "مثلاً: قرب سوبرماركت..." : "e.g. Near supermarket..."} />
                                </div>
                                <div style={{ marginTop: '20px', padding: '15px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Clock size={20} color="#0284C7" />
                                    <span style={{ color: '#0369A1', fontWeight: 800, fontSize: '14px' }}>
                                        {isAr ? 'وقت التوصيل المتوقع: حوالي نصف ساعة (30 دقيقة)' : 'Expected Delivery Time: About 30 minutes'}
                                    </span>
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
                            {!!branch.deliveryDiscountPercent && branch.deliveryDiscountPercent > 0 && deliveryFee > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669', fontWeight: 700, marginBottom: '8px' }}>
                                    <span>{isAr ? 'خصم التوصيل' : 'Delivery Discount'} ({branch.deliveryDiscountPercent}%)</span>
                                    <span>-{(deliveryFee * (branch.deliveryDiscountPercent || 0) / 100).toFixed(2)} {settings.currencySymbol}</span>
                                </div>
                            )}
                            {orderType === 'delivery' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                    <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                                    <span>{(deliveryFee || settings.deliveryFee || 0).toFixed(2)} {settings.currencySymbol}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#8B0000', fontWeight: 900, marginTop: '10px' }}>
                                <span>{isAr ? 'المجموع النهائي' : 'Grand Total'}</span>
                                <span>{(total || 0).toFixed(2)} {settings.currencySymbol}</span>
                            </div>
                        </div>
                    </div>

                    {/* 💳 PAYMENT */}
                    <div style={{ marginBottom: '40px' }}>
                        <h4 style={{ fontWeight: 800, marginBottom: '20px', textAlign: isAr ? 'right' : 'left' }}>{isAr ? 'اختر طريقة الدفع' : 'Choose Payment Method'}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div onClick={() => setPaymentMethod('cash')} className={`premium-choice-card ${paymentMethod === 'cash' ? 'active' : ''}`} style={{ padding: '25px' }}>
                                <Banknote size={36} />
                                <span style={{ fontSize: '14px', marginTop: '10px' }}>{isAr ? 'الدفع كاش' : 'Cash Payment'}</span>
                            </div>
                            <div onClick={() => setPaymentMethod('palpay')} className={`premium-choice-card ${paymentMethod === 'palpay' ? 'active' : ''}`} style={{ padding: '25px' }}>
                                <CreditCard size={36} />
                                <span style={{ fontSize: '14px', marginTop: '10px' }}>{isAr ? 'الدفع بالفيزا' : 'Visa Payment'}</span>
                            </div>
                        </div>
                    </div>

                    {paymentMethod === 'palpay' && (
                        <div style={{ background: '#fff', padding: '25px', borderRadius: '30px', border: '2px solid #EEE', marginBottom: '40px', textAlign: 'center' }}>
                            <p style={{ fontWeight: 600, color: '#666' }}>
                                {isAr ? "سيتم توجيهك إلى بوابة الدفع الآمنة لإتمام العملية." : "You will be redirected to our secure payment gateway to complete your request."}
                            </p>
                        </div>
                    )}

                    <div style={{ marginBottom: '30px', padding: '15px', background: '#fff', borderRadius: '15px', border: '1px solid #eee' }}>
                        <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                            <input type="checkbox" id="policy-accept" required style={{ width: '22px', height: '22px', marginTop: '3px', accentColor: '#8B0000' }} />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#444', lineHeight: '1.5' }}>
                                {isAr ? (
                                    <>
                                        أوافق على <a href="/policies/return" target="_blank" style={{ color: '#8B0000', textDecoration: 'underline' }}>سياسة الإرجاع والتبديل</a> و <a href="/policies/privacy" target="_blank" style={{ color: '#8B0000', textDecoration: 'underline' }}>سياسة الخصوصية</a>
                                    </>
                                ) : (
                                    <>
                                        I accept the <a href="/policies/return" target="_blank" style={{ color: '#8B0000', textDecoration: 'underline' }}>Return & Exchange Policy</a> and <a href="/policies/privacy" target="_blank" style={{ color: '#8B0000', textDecoration: 'underline' }}>Privacy Policy</a>
                                    </>
                                )}
                            </span>
                        </label>
                    </div>

                    {/* 🛡️ reCAPTCHA */}
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                onChange={(token) => setCaptchaToken(token)}
                                hl={isAr ? 'ar' : 'en'}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button 
                            type="submit" 
                            className="uptown-btn red-gradient" 
                            disabled={isPending || (!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken)} 
                            style={{ 
                                opacity: (isPending || (!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken)) ? 0.6 : 1, 
                                cursor: (isPending || (!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken)) ? 'not-allowed' : 'pointer' 
                            }}
                        >
                            <CheckCircle2 color="#fff" />
                            {!isOpen
                                ? (isAr ? 'إرسال الطلب (المطعم مغلق)' : 'Send Order (Closed Now)')
                                : (isPending
                                    ? (isAr ? 'جاري المعالجة...' : 'Processing...')
                                    : (paymentMethod === 'palpay'
                                        ? (isAr ? 'المتابعة للدفع الإلكتروني' : 'Continue to Online Payment')
                                        : (isAr ? 'إرسال الطلب' : 'Send Order')))}
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
                    background: #FDF4F4; border-color: #8B0000; color: #8B0000; box-shadow: 0 10px 30px rgba(139,0,0,0.1);
                }
                .premium-choice-card.sm { padding: 15px; border-radius: 18px; flex-direction: row; justify-content: center; }
                .premium-choice-card span { font-weight: 800; }
                
                .uptown-input-group { display: flex; flex-direction: column; gap: 8px; }
                .uptown-input-group label { font-size: 13px; font-weight: 800; color: #1a1a1a; padding-right: 5px; }
                .uptown-input { 
                    padding: 16px 20px; border-radius: 18px; border: 1px solid #ECEAE7; 
                    background: #fff; font-size: 15px; font-weight: 600; outline: none; transition: 0.3s;
                }
                .uptown-input:focus { border-color: #8B0000; box-shadow: 0 0 0 4px rgba(139,0,0,0.05); }
                
                .uptown-btn {
                    width: 100%; padding: 20px; border-radius: 25px; border: none; font-size: 18px; 
                    font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.3s;
                }
                .uptown-btn.red-gradient { 
                    background: linear-gradient(135deg, #8B0000 0%, #B91C1C 100%); 
                    color: #fff; box-shadow: 0 10px 30px rgba(139,0,0,0.3); 
                }
                .uptown-btn:hover { transform: scale(1.02); opacity: 0.95; }
                .uptown-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            ` }} />
            </div>
        </div>
    );
}
