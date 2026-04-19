"use client";
import { useState, useEffect } from "react"; // أضفنا useEffect
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { Truck, Info, Sparkles } from "lucide-react";

type Rule = {
    id: string;
    range: string;
    type: "none" | "fixed" | "percentage" | "free";
    value: number;
};

export default function InvoiceDiscountsManager() {
    const { t, isAr } = useAdminTranslation();
    const { showToast } = useToast();

    // إضافة حالات التحميل
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [rules, setRules] = useState<Rule[]>([
        { id: "tier1", range: t("invoiceDiscounts.ranges.tier1"), type: "none", value: 0 },
        { id: "tier2", range: t("invoiceDiscounts.ranges.tier2"), type: "fixed", value: 5 },
        { id: "tier3", range: t("invoiceDiscounts.ranges.tier3"), type: "fixed", value: 10 },
        { id: "tier4", range: t("invoiceDiscounts.ranges.tier4"), type: "free", value: 0 },
    ]);

    // 1. جلب البيانات من الداتابيز عند تحميل الصفحة
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/admin/invoice-discounts");
                const data = await res.json();
                if (data.rules && data.rules.length > 0) {
                    // حول من شكل الداتابيز لشكل الـ UI
                    const mapped = data.rules.map((r: any, i: number) => ({
                        id: `tier${i + 1}`,
                        range: t(`invoiceDiscounts.ranges.tier${i + 1}`),
                        type: r.type === "fixed" && r.value === 0 ? "none" : r.type,
                        value: r.value,
                    }));
                    setRules(mapped);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleUpdate = (id: string, field: keyof Rule, value: any) => {
        setRules((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, [field]: field === "value" ? Number(value) : value } : r
            )
        );
    };

    const TIER_RANGES = [
        { id: "tier1", min: 0, max: 50 },
        { id: "tier2", min: 50, max: 100 },
        { id: "tier3", min: 100, max: 250 },
        { id: "tier4", min: 250, max: null },
    ];

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // حول الـ rules لنفس شكل الداتابيز
            const formattedRules = rules.map((rule) => {
                const range = TIER_RANGES.find(r => r.id === rule.id);
                return {
                    min: range?.min ?? 0,
                    max: range?.max ?? null,
                    type: rule.type === "none" ? "fixed" : rule.type,
                    value: rule.type === "none" ? 0 : rule.value,
                };
            });

            const res = await fetch("/api/admin/invoice-discounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rules: formattedRules }),
            });

            const result = await res.json();

            if (result.success) {
                showToast(isAr ? "تم حفظ التعديلات في قاعدة البيانات" : "Changes saved to database!");
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            showToast(isAr ? "فشل الحفظ: " + error.message : "Save failed", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">{isAr ? "جاري جلب البيانات..." : "Loading Settings..."}</div>;
    }

    return (
        <form onSubmit={handleSave} className="admin-profile-container flex flex-col gap-6" dir={isAr ? "rtl" : "ltr"}>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 sm:p-7 rounded-[30px] border border-gray-100 shadow-sm overflow-hidden relative group">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#8B0000] text-white flex items-center justify-center rounded-[20px] shadow-lg shadow-red-50">
                        <Truck size={28} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-[900] text-gray-800 m-0 leading-tight">
                            {t("invoiceDiscounts.title")}
                        </h2>
                        <p className="text-[11px] text-gray-500 font-bold m-0 uppercase tracking-wider opacity-70">
                            {isAr ? "إدارة نظام التوصيل الذكي" : "Smart Delivery System"}
                        </p>
                    </div>
                </div>

                <div className="w-full sm:w-48">
                    <AdminSubmitButton
                        label={isAr ? "حفظ الإعدادات" : "Save Settings"}
                        pendingLabel={isAr ? "جاري الحفظ..." : "Saving..."}
                    />
                </div>
            </div>

            {/* Grid الكروت */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rules.map((rule, index) => (
                    <div key={rule.id} className="admin-card !m-0 flex flex-col justify-between hover:border-red-200 transition-colors group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[14px] font-black text-red-600 bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg">
                                    {index + 1}
                                </span>
                                <h3 className="admin-card-title !m-0 text-gray-800">{rule.range}</h3>
                            </div>
                            {rule.type === 'free' && (
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                                    <Sparkles size={12} />
                                    {isAr ? "مجاني" : "FREE"}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group !m-0">
                                <label className="text-[11px] font-black mb-1.5 block text-gray-400 uppercase tracking-wider">
                                    {isAr ? "نوع الخصم" : "Type"}
                                </label>
                                <select
                                    value={rule.type}
                                    onChange={(e) => handleUpdate(rule.id, "type", e.target.value)}
                                    className="w-full p-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500/10 transition-all cursor-pointer"
                                >
                                    <option value="none">{isAr ? "بدون خصم" : "No Discount"}</option>
                                    <option value="fixed">{isAr ? "مبلغ ثابت" : "Fixed Amount"}</option>
                                    <option value="percentage">{isAr ? "نسبة مئوية" : "Percentage"}</option>
                                    <option value="free">{isAr ? "توصيل مجاني" : "Free Delivery"}</option>
                                </select>
                            </div>

                            <div className="form-group !m-0">
                                <label className="text-[11px] font-black mb-1.5 block text-gray-400 uppercase tracking-wider">
                                    {isAr ? "قيمة الخصم" : "Value"}
                                </label>
                                {rule.type === "none" || rule.type === "free" ? (
                                    <div className="h-[48px] flex items-center justify-center bg-gray-50 rounded-2xl text-gray-300 font-bold text-sm border-2 border-dashed border-gray-100 italic">
                                        {rule.type === "free" ? "0.00" : "—"}
                                    </div>
                                ) : (
                                    <div className="relative group/input">
                                        <input
                                            type="number"
                                            value={rule.value}
                                            onChange={(e) => handleUpdate(rule.id, "value", e.target.value)}
                                            className="w-full p-3.5 rounded-2xl border border-gray-200 bg-white font-black text-sm outline-none focus:border-red-600 transition-all shadow-sm"
                                        />
                                        <span className={`absolute ${isAr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-xs font-black text-red-700 bg-red-50 px-2 py-1 rounded-md`}>
                                            {rule.type === "percentage" ? "%" : "₪"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ملاحظة التعليمات */}
            <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-[25px] flex gap-4 items-center max-w-3xl mx-auto shadow-sm">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 flex items-center justify-center rounded-full shrink-0">
                    <Info size={20} />
                </div>
                <p className="text-[12px] text-amber-900 font-[700] leading-relaxed m-0">
                    {isAr
                        ? "توضيح: النظام يقوم بخصم القيمة المحددة من سعر التوصيل لكل منطقة بناءً على إجمالي الفاتورة."
                        : "Note: The system deducts the specified value from the delivery fee based on the invoice total."}
                </p>
            </div>
        </form>
    );
}