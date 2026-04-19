import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// 1. جلب الخصومات من العمود الجديد
export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("site_settings")
            .select("invoice_discounts")
            .single(); // جلب الصف الوحيد للإعدادات

        if (error) throw error;

        return NextResponse.json({
            rules: data?.invoice_discounts || []
        });
    } catch (err: any) {
        return NextResponse.json({ rules: [], error: err.message }, { status: 200 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseAdmin();
        const { rules } = await req.json();

        console.log("البيانات الواصلة للسيرفر:", rules);

        const { data, error, status } = await supabase
            .from("site_settings")
            .update({ invoice_discounts: rules, updated_at: new Date() })
            .eq("id", 1) // تأكد من هذا الرقم
            .select(); // نطلب إرجاع البيانات للتأكد من التحديث

        if (error) {
            console.error("خطأ من Supabase:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        if (!data || data.length === 0) {
            console.warn("تحذير: لم يتم العثور على صف برقم ID 1 لتحديثه");
            return NextResponse.json({ success: false, error: "No settings row found with ID 1" }, { status: 404 });
        }

        console.log("تم التحديث بنجاح في قاعدة البيانات:", data);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("خطأ داخلي:", err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}