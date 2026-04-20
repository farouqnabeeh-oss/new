import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*, branch:branches(id, name_ar, name_en)")
            .order("created_at", { ascending: false })
            .limit(200);

        if (error) throw error;

        return NextResponse.json({ orders: orders || [] });
    } catch (err: any) {
        return NextResponse.json({ orders: [], error: err.message }, { status: 200 });
    }
}