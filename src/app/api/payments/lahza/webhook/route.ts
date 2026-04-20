import { NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeOrder, markOrderFailed } from "@/lib/order-actions";

const SECRET_KEY = process.env.LAHZA_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // ✅ تحقق من وجود الـ secret أولاً
  if (!SECRET_KEY) {
    console.error("❌ LAHZA_WEBHOOK_SECRET غير موجود في .env");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x_lahza_signature") || req.headers.get("x-lahza-signature");

    if (!signature) {
      console.error("⚠️ Webhook received without signature");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const hash = crypto.createHmac("sha256", SECRET_KEY).update(body).digest("hex");
    if (hash !== signature) {
      console.error("❌ Lahza Webhook Signature Mismatch!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const orderId = event.data?.metadata?.orderId || event.data?.reference?.split("-")[1];

    if (event.event === "charge.success" || event.event === "charge.captured") {
      console.log(`✅ [Verified] Payment successful for Order ID: ${orderId}`);

      const finalizeRes = await finalizeOrder(orderId);
      if (!finalizeRes.success) {
        console.error(`❌ [Finalization Error] Order: ${orderId}`, finalizeRes.error);
        return NextResponse.json({ error: "Order finalization failed" }, { status: 500 });
      }

      console.log(`✨ [Success] Order #${orderId} is now marked as PAID.`);

    } else if (event.event === "charge.failed" || event.event === "charge.cancelled") {
      // ✅ سجّل الفشل والإلغاء في DB
      console.log(`❌ [Webhook] Payment ${event.event} for Order ID: ${orderId}`);
      if (orderId) await markOrderFailed(orderId, event.event);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 [Critical Error] Lahza Webhook:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}