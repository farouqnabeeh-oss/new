"use client";
import { useState, useEffect } from "react";
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { Receipt, Info, Save } from "lucide-react";

type Rule = {
    id: string;
    range: string;
    type: "none" | "fixed" | "percentage";
    value: number;
};

const TIER_RANGES = [
    { id: "tier1", min: 0, max: 50 },
    { id: "tier2", min: 50, max: 100 },
    { id: "tier3", min: 100, max: 250 },
    { id: "tier4", min: 250, max: null },
];

const TIER_LABELS = ["0 — 50 ₪", "50 — 100 ₪", "100 — 250 ₪", "250+ ₪"];

export default function InvoiceDiscountsManager() {
    const { t, isAr } = useAdminTranslation();
    const { showToast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [rules, setRules] = useState<Rule[]>(
        TIER_RANGES.map((r, i) => ({ id: r.id, range: TIER_LABELS[i], type: "none", value: 0 }))
    );

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/admin/invoice-item-discounts");
                const data = await res.json();
                if (data.rules && data.rules.length > 0) {
                    const mapped = data.rules.map((r: any, i: number) => ({
                        id: `tier${i + 1}`,
                        range: TIER_LABELS[i],
                        type: r.type === "fixed" && r.value === 0 ? "none" : r.type,
                        value: r.value,
                    }));
                    setRules(mapped);
                }
            } catch (error) {
                console.error("Failed to load invoice discounts:", error);
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formattedRules = rules.map((rule) => {
                const range = TIER_RANGES.find(r => r.id === rule.id);
                return {
                    min: range?.min ?? 0,
                    max: range?.max ?? null,
                    type: rule.type === "none" ? "fixed" : rule.type,
                    value: rule.type === "none" ? 0 : rule.value,
                };
            });

            const res = await fetch("/api/admin/invoice-item-discounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rules: formattedRules }),
            });

            const result = await res.json();
            if (result.success) {
                showToast(isAr ? "تم حفظ التعديلات بنجاح" : "Changes saved successfully!");
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
        return (
            <div className="p-10 text-center font-bold text-gray-400 animate-pulse">
                {isAr ? "جاري جلب البيانات..." : "Loading Settings..."}
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="admin-profile-container flex flex-col gap-6" dir={isAr ? "rtl" : "ltr"}>

            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-5 sm:p-7 rounded-[30px] border border-gray-100 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#8B0000] text-white flex items-center justify-center rounded-[20px] shadow-lg shadow-red-50 shrink-0">
                    <Receipt size={28} />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-[900] text-gray-800 m-0 leading-tight">
                        {isAr ? "خصومات الفاتورة" : "Invoice Discounts"}
                    </h2>
                    <p className="text-[12px] text-gray-500 font-semibold m-0 mt-1">
                        {isAr
                            ? "خصم على مجموع الأصناف حسب قيمة الفاتورة"
                            : "Discount on subtotal based on invoice total"}
                    </p>
                </div>
            </div>

            {/* Grid الكروت — 2 في كل سطر */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {rules.map((rule, index) => (
                    <div key={rule.id} className="admin-card !m-0 flex flex-col gap-5 hover:border-red-200 transition-colors">

                        {/* عنوان الكارت */}
                        <div className="flex items-center gap-3">
                            <span className="text-[13px] font-black text-red-600 bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg shrink-0">
                                {index + 1}
                            </span>
                            <h3 className="font-black text-gray-800 text-[15px] m-0">{rule.range}</h3>
                        </div>

                        {/* نوع الخصم */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                {isAr ? "نوع الخصم" : "Discount Type"}
                            </label>
                            <select
                                value={rule.type}
                                onChange={(e) => handleUpdate(rule.id, "type", e.target.value)}
                                className="w-full p-3.5 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500/10 transition-all cursor-pointer"
                            >
                                <option value="none">{isAr ? "بدون خصم" : "No Discount"}</option>
                                <option value="fixed">{isAr ? "مبلغ ثابت" : "Fixed Amount"}</option>
                                <option value="percentage">{isAr ? "نسبة مئوية" : "Percentage"}</option>
                            </select>
                        </div>

                        {/* قيمة الخصم */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                {isAr ? "قيمة الخصم" : "Discount Value"}
                            </label>
                            {rule.type === "none" ? (
                                <div className="h-[48px] flex items-center justify-center bg-gray-50 rounded-2xl text-gray-300 font-bold text-sm border-2 border-dashed border-gray-100 italic">
                                    —
                                </div>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={0}
                                        max={rule.type === "percentage" ? 100 : undefined}
                                        value={rule.value}
                                        onChange={(e) => handleUpdate(rule.id, "value", e.target.value)}
                                        className="w-full p-3.5 rounded-2xl border border-gray-200 bg-white font-black text-sm outline-none focus:border-red-600 transition-all shadow-sm"
                                    />
                                    <span className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-xs font-black text-red-700 bg-red-50 px-2 py-1 rounded-md`}>
                                        {rule.type === "percentage" ? "%" : "₪"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ملاحظة */}
            <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-[25px] flex gap-4 items-center shadow-sm">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 flex items-center justify-center rounded-full shrink-0">
                    <Info size={20} />
                </div>
                <p className="text-[12px] text-amber-900 font-[700] leading-relaxed m-0">
                    {isAr
                        ? "يُطبَّق الخصم على مجموع الأصناف فقط — مستقل عن خصم الفرع وخصم التوصيل، وينجمعوا مع بعض في الفاتورة."
                        : "Discount applies to items subtotal only — independent of branch and delivery discounts, all shown separately on the invoice."}
                </p>
            </div>

            {/* زر الحفظ */}
            <button
                type="submit"
                disabled={isSaving}
                className="w-full py-5 rounded-[20px] bg-[#8B0000] hover:bg-[#a00000] text-white font-black text-[16px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <Save size={20} />
                {isSaving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ الإعدادات" : "Save Settings")}
            </button>

        </form>
    );
}