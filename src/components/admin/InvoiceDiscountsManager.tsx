"use client";

import { useState, useEffect } from "react";
import { Save, Percent, DollarSign } from "lucide-react";

const CATEGORIES = [
    { label: "0 — 50 ₪", min: 0, max: 50 },
    { label: "50 — 100 ₪", min: 50, max: 100 },
    { label: "100 — 250 ₪", min: 100, max: 250 },
    { label: "250+ ₪", min: 250, max: null },
];

type Rule = {
    min: number;
    max: number | null;
    type: "fixed" | "percentage";
    value: number;
};

const defaultRules = (): Rule[] =>
    CATEGORIES.map((c) => ({ min: c.min, max: c.max, type: "fixed", value: 0 }));

export default function InvoiceDiscountsManager() {
    const [rules, setRules] = useState<Rule[]>(defaultRules());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/admin/invoice-item-discounts")
            .then((r) => r.json())
            .then((data) => {
                if (data.rules && data.rules.length === 4) {
                    setRules(data.rules);
                } else {
                    setRules(defaultRules());
                }
            })
            .catch(() => setRules(defaultRules()))
            .finally(() => setLoading(false));
    }, []);

    const updateRule = (index: number, field: keyof Rule, value: any) => {
        setRules((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/invoice-item-discounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rules }),
            });
            const data = await res.json();
            if (data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert("فشل الحفظ: " + (data.error || "خطأ غير معروف"));
            }
        } catch (err) {
            alert("خطأ في الاتصال بالسيرفر");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                جاري التحميل...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "30px 20px", direction: "rtl" }}>
            {/* Header */}
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a1a", margin: 0 }}>
                    خصومات الفاتورة
                </h2>
                <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
                    خصم يُطبَّق على مجموع الأصناف (subtotal) حسب قيمة الفاتورة — مستقل عن خصم الفرع وخصم التوصيل
                </p>
            </div>

            {/* Rules */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                {rules.map((rule, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#fff",
                            border: "1.5px solid #ECEAE7",
                            borderRadius: "20px",
                            padding: "20px 24px",
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Category Label */}
                        <div style={{ minWidth: "110px" }}>
                            <span style={{
                                fontSize: "13px",
                                fontWeight: 800,
                                color: "#8B0000",
                                background: "#FDF4F4",
                                padding: "6px 14px",
                                borderRadius: "30px",
                                display: "inline-block",
                            }}>
                                {CATEGORIES[index].label}
                            </span>
                        </div>

                        {/* Type Toggle */}
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                onClick={() => updateRule(index, "type", "fixed")}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    border: "1.5px solid",
                                    borderColor: rule.type === "fixed" ? "#8B0000" : "#ECEAE7",
                                    background: rule.type === "fixed" ? "#FDF4F4" : "#fff",
                                    color: rule.type === "fixed" ? "#8B0000" : "#888",
                                    fontWeight: 800,
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    transition: "all 0.2s",
                                }}
                            >
                                <DollarSign size={14} />
                                قيمة ثابتة
                            </button>
                            <button
                                onClick={() => updateRule(index, "type", "percentage")}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    border: "1.5px solid",
                                    borderColor: rule.type === "percentage" ? "#8B0000" : "#ECEAE7",
                                    background: rule.type === "percentage" ? "#FDF4F4" : "#fff",
                                    color: rule.type === "percentage" ? "#8B0000" : "#888",
                                    fontWeight: 800,
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    transition: "all 0.2s",
                                }}
                            >
                                <Percent size={14} />
                                نسبة مئوية
                            </button>
                        </div>

                        {/* Value Input */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "auto" }}>
                            <input
                                type="number"
                                min={0}
                                max={rule.type === "percentage" ? 100 : undefined}
                                value={rule.value}
                                onChange={(e) => updateRule(index, "value", parseFloat(e.target.value) || 0)}
                                style={{
                                    width: "90px",
                                    padding: "10px 14px",
                                    borderRadius: "12px",
                                    border: "1.5px solid #ECEAE7",
                                    fontSize: "16px",
                                    fontWeight: 800,
                                    textAlign: "center",
                                    outline: "none",
                                    color: "#1a1a1a",
                                }}
                            />
                            <span style={{ fontWeight: 800, color: "#666", fontSize: "14px", minWidth: "24px" }}>
                                {rule.type === "percentage" ? "%" : "₪"}
                            </span>
                        </div>

                        {/* Preview */}
                        <div style={{ fontSize: "12px", color: "#aaa", width: "100%", marginTop: "4px" }}>
                            {rule.value === 0 ? (
                                <span>لا يوجد خصم لهذه الفئة</span>
                            ) : rule.type === "fixed" ? (
                                <span>فاتورة بين {CATEGORIES[index].label} → خصم ثابت <strong style={{ color: "#059669" }}>{rule.value} ₪</strong></span>
                            ) : (
                                <span>فاتورة بين {CATEGORIES[index].label} → خصم <strong style={{ color: "#059669" }}>{rule.value}%</strong> من مجموع الأصناف</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                style={{
                    width: "100%",
                    padding: "18px",
                    borderRadius: "18px",
                    border: "none",
                    background: saved
                        ? "linear-gradient(135deg, #059669, #10b981)"
                        : "linear-gradient(135deg, #8B0000, #B91C1C)",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 900,
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    opacity: saving ? 0.7 : 1,
                    transition: "all 0.3s",
                }}
            >
                <Save size={20} />
                {saving ? "جاري الحفظ..." : saved ? "✓ تم الحفظ بنجاح" : "حفظ الإعدادات"}
            </button>
        </div>
    );
}