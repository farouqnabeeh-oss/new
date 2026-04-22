import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.from("orders").delete().eq("id", params.id);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}