import { NextResponse } from "next/server";
import { markOrderFailed } from "@/lib/order-actions";

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();
        if (!orderId) return NextResponse.json({ error: "No orderId" }, { status: 400 });

        await markOrderFailed(orderId, "cancelled_by_user");
        console.log(`[cancel] Order #${orderId} marked as cancelled`);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}