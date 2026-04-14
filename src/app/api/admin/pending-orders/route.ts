import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, customer_name, customer_phone, total_amount, order_type, created_at")
      .eq("status", "Pending")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({
      orders: (orders || []).map(o => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        totalAmount: o.total_amount,
        orderType: o.order_type,
        createdAt: o.created_at,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ orders: [], error: err.message }, { status: 200 });
  }
}
