import { NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeOrder } from "@/lib/order-actions";

const SECRET_KEY = process.env.LAHZA_WEBHOOK_SECRET || process.env.LAHZA_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    
    // 💡 جلب التوقيع بالاسم الدقيق الذي اكتشفناه
    const signature = req.headers.get("x_lahza_signature") || req.headers.get("x-lahza-signature");

    // 🛡️ إعادة تفعيل نظام الحماية
    if (!signature) {
      console.error("⚠️ Webhook received without signature");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const hash = crypto.createHmac("sha256", SECRET_KEY!).update(body).digest("hex");
    if (hash !== signature) {
      console.error("❌ Lahza Webhook Signature Mismatch!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    
    if (event.event === "charge.success" || event.event === "charge.captured") {
      const data = event.data;
      const orderId = data.metadata?.orderId || data.reference?.split("-")[1];
      
      console.log(`✅ [Verified] Payment successful for Order ID: ${orderId}`);

      const finalizeRes = await finalizeOrder(orderId);

      if (!finalizeRes.success) {
        console.error(`❌ [Finalization Error] Order: ${orderId}`, finalizeRes.error);
        return NextResponse.json({ error: "Order finalization failed" }, { status: 500 });
      }

      console.log(`✨ [Success] Order #${orderId} is now marked as PAID.`);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("🚨 [Critical Error] Lahza Webhook:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}