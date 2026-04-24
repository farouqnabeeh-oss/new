import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("site_settings")
            .select("invoice_item_discounts")
            .single();

        if (error) throw error;

        return NextResponse.json({
            rules: data?.invoice_item_discounts || []
        });
    } catch (err: any) {
        return NextResponse.json({ rules: [], error: err.message }, { status: 200 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseAdmin();
        const { rules } = await req.json();

        console.log("invoice-item-discounts: البيانات الواصلة:", rules);

        const { data, error } = await supabase
            .from("site_settings")
            .update({ invoice_item_discounts: rules, updated_at: new Date() })
            .eq("id", 1)
            .select();

        if (error) {
            console.error("خطأ من Supabase:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ success: false, error: "No settings row found with ID 1" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}