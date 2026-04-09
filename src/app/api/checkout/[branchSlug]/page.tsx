"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createOrderAction } from "@/lib/actions";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── تايبات السلة ──────────────────────────────────────────────────────
type CartItem = {
    id: string;
    productId: number;
    nameAr: string;
    nameEn: string;
    quantity: number;
    finalPrice: number;
    selectedSize?: { nameAr: string; nameEn: string; price: number } | null;
    selectedType?: { nameAr: string; nameEn: string; price: number } | null;
    selectedAddOns?: { nameAr: string; price: number }[];
    note?: string;
    imagePath?: string | null;
};

// ── نموذج Stripe الداخلي ──────────────────────────────────────────────
function StripeForm({
    total,
    onSuccess,
    orderId,
}: {
    total: number;
    onSuccess: () => void;
    orderId: number | null;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePay = async () => {
        if (!stripe || !elements || !orderId) return;
        setLoading(true);
        setError("");

        try {
            // 1. اطلب clientSecret
            const res = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total, orderId }),
            });
            const { clientSecret, error: serverError } = await res.json();
            if (serverError) throw new Error(serverError);

            // 2. أكمل الدفع
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement)! },
            });

            if (stripeError) throw new Error(stripeError.message);
            if (paymentIntent?.status === "succeeded") onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }
        }>
            <div style={
                {
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "14px 16px",
                    background: "#fafafa",
                }
            }>
                <CardElement options={
                    {
                        style: {
                            base: { fontSize: "15px", color: "#1a1a1a", "::placeholder": { color: "#aaa" } },
                        },
                    }
                } />
            </div>
            {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}> {error} </p>}
            <button
                onClick={handlePay}
                disabled={loading || !stripe || !orderId}
                style={btnStyle("#16a34a")}
            >
                {loading ? "جاري الدفع..." : `ادفع الآن ₪${total.toFixed(2)}`}
            </button>
        </div>
    );
}

// ── الصفحة الرئيسية ───────────────────────────────────────────────────
export default function CheckoutPage() {
    const { branchSlug } = useParams<{ branchSlug: string }>();
    const router = useRouter();

    const [items, setItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card">("Cash");
    const [orderType, setOrderType] = useState<"Delivery" | "Pickup">("Delivery");
    const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
    const [orderId, setOrderId] = useState<number | null>(null);
    const [step, setStep] = useState<"form" | "pay" | "done">("form");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // اقرأ السلة من localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const carts = JSON.parse(localStorage.getItem("carts") || "{}");
        setItems(carts[branchSlug] || []);
    }, [branchSlug]);

    const total = items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // تأكيد الطلب (يحفظ في Supabase أولاً)
    const handleConfirm = async () => {
        if (!form.name || !form.phone) {
            setError("الاسم ورقم الهاتف مطلوبان");
            return;
        }
        if (orderType === "Delivery" && !form.address) {
            setError("عنوان التوصيل مطلوب");
            return;
        }
        if (items.length === 0) {
            setError("السلة فارغة");
            return;
        }

        setLoading(true);
        setError("");

        // ابحث عن branchId من الـ API
        const branchRes = await fetch(`/api/BranchesApi/${branchSlug}`);
        const branchData = await branchRes.json();
        const branchId: number = branchData?.id;

        const result = await createOrderAction({
            branchId,
            customerName: form.name,
            customerPhone: form.phone,
            customerEmail: form.email,
            orderType,
            address: form.address || undefined,
            totalAmount: total,
            paymentMethod,
            items: items.map((i) => ({
                productId: i.productId,
                productNameAr: i.nameAr,
                productNameEn: i.nameEn,
                quantity: i.quantity,
                price: i.finalPrice,
                addonDetails: i.selectedAddOns?.map((a) => a.nameAr).join(", ") || undefined,
            })),
        });

        setLoading(false);

        if (!result.success) {
            setError(result.error || "حدث خطأ");
            return;
        }

        setOrderId(result.orderId!);

        if (paymentMethod === "Cash") {
            clearCartAndDone();
        } else {
            setStep("pay");
        }
    };

    const clearCartAndDone = () => {
        const carts = JSON.parse(localStorage.getItem("carts") || "{}");
        delete carts[branchSlug];
        localStorage.setItem("carts", JSON.stringify(carts));
        setStep("done");
    };

    // ── شاشة النجاح ──────────────────────────────────────────────────
    if (step === "done") {
        return (
            <div style={pageStyle} >
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <div style={successCircle}>✓</div>
                    < h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }
                    }> تم استلام طلبك! </h2>
                    < p style={{ color: "#6b7280", marginBottom: 24 }
                    }>
                        {paymentMethod === "Cash"
                            ? "سيتم الدفع عند الاستلام. شكراً لك!"
                            : "تم الدفع بنجاح. شكراً لك!"}
                    </p>
                    < button onClick={() => router.push(`/menu/${branchSlug}`)} style={btnStyle("#f97316")} >
                        العودة للقائمة
                    </button>
                </div>
            </div>
        );
    }

    // ── شاشة الدفع بالكارد ───────────────────────────────────────────
    if (step === "pay") {
        return (
            <div style={pageStyle} >
                <h1 style={titleStyle}> الدفع الإلكتروني </h1>
                < div style={cardStyle} >
                    <p style={{ marginBottom: 16, fontWeight: 600 }}> المجموع: ₪{total.toFixed(2)} </p>
                    < Elements stripe={stripePromise} >
                        <StripeForm total={total} onSuccess={clearCartAndDone} orderId={orderId} />
                    </Elements>
                </div>
            </div>
        );
    }

    // ── صفحة تفاصيل الطلب ────────────────────────────────────────────
    return (
        <div style={pageStyle} >
            <h1 style={titleStyle}> إتمام الطلب </h1>

            {/* ملخص السلة */}
            <div style={cardStyle}>
                <h3 style={sectionTitle}>🛒 طلبك </h3>
                {
                    items.length === 0 ? (
                        <p style={{ color: "#9ca3af" }
                        }> السلة فارغة </p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} style={rowStyle} >
                                <span>{item.nameAr} × {item.quantity} </span>
                                < span style={{ fontWeight: 600 }}>₪{(item.finalPrice * item.quantity).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                <div style={{ ...rowStyle, borderTop: "1px solid #f3f4f6", paddingTop: 10, fontWeight: 700, fontSize: 16 }}>
                    <span>المجموع </span>
                    <span>₪{total.toFixed(2)} </span>
                </div>
            </div>

            {/* نوع الطلب */}
            <div style={cardStyle}>
                <h3 style={sectionTitle}>📦 نوع الطلب </h3>
                < div style={{ display: "flex", gap: 10 }}>
                    {(["Delivery", "Pickup"] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setOrderType(type)}
                            style={orderType === type ? tabActiveStyle : tabStyle}
                        >
                            {type === "Delivery" ? "🛵 توصيل" : "🏪 استلام من الفرع"}
                        </button>
                    ))}
                </div>
            </div>

            {/* معلومات العميل */}
            <div style={cardStyle}>
                <h3 style={sectionTitle}>👤 معلوماتك </h3>
                < input name="name" placeholder="الاسم الكامل *" value={form.name} onChange={handleChange} style={inputStyle} />
                <input name="phone" placeholder="رقم الهاتف *" value={form.phone} onChange={handleChange} style={inputStyle} />
                <input name="email" placeholder="البريد الإلكتروني (اختياري)" value={form.email} onChange={handleChange} style={inputStyle} />
                {orderType === "Delivery" && (
                    <input name="address" placeholder="عنوان التوصيل *" value={form.address} onChange={handleChange} style={inputStyle} />
                )}
            </div>

            {/* طريقة الدفع */}
            <div style={cardStyle}>
                <h3 style={sectionTitle}>💳 طريقة الدفع </h3>
                < div style={{ display: "flex", gap: 10 }}>
                    {(["Cash", "Card"] as const).map((method) => (
                        <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            style={paymentMethod === method ? tabActiveStyle : tabStyle}
                        >
                            {method === "Cash" ? "💵 عند الاستلام" : "💳 دفع أونلاين"}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 14, textAlign: "center" }}> {error} </p>}

            <button onClick={handleConfirm} disabled={loading} style={btnStyle("#f97316")} >
                {loading ? "جاري التأكيد..." : paymentMethod === "Cash" ? "تأكيد الطلب" : "المتابعة للدفع →"}
            </button>
        </div>
    );
}

// ── الستايل ───────────────────────────────────────────────────────────
const pageStyle: React.CSSProperties = {
    maxWidth: 560, margin: "0 auto", padding: "2rem 1rem",
    fontFamily: "sans-serif", direction: "rtl",
};
const titleStyle: React.CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 20 };
const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #f3f4f6",
    borderRadius: 14, padding: 20, marginBottom: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};
const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 600, marginBottom: 14, color: "#374151" };
const rowStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 };
const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: "1px solid #e5e7eb",
    borderRadius: 9, marginBottom: 10, fontSize: 14, boxSizing: "border-box",
};
const tabStyle: React.CSSProperties = {
    flex: 1, padding: "10px 0", border: "1px solid #e5e7eb",
    borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 14,
};
const tabActiveStyle: React.CSSProperties = {
    ...tabStyle, border: "2px solid #f97316",
    background: "#fff7ed", fontWeight: 600, color: "#c2410c",
};
const successCircle: React.CSSProperties = {
    width: 64, height: 64, background: "#16a34a", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, color: "#fff", margin: "0 auto 20px",
};
const btnStyle = (bg: string): React.CSSProperties => ({
    width: "100%", padding: "14px 0", background: bg, color: "#fff",
    border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700,
    cursor: "pointer", marginTop: 8,
});