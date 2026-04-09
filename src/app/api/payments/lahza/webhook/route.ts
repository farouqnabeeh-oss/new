import { NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeOrder } from "@/lib/order-actions";

const SECRET_KEY = process.env.LAHZA_WEBHOOK_SECRET || process.env.LAHZA_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-lahza-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha256", SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Lahza Webhook Signature Mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Lahza Webhook Event:", event.event);

    if (event.event === "charge.success" || event.event === "charge.captured") {
      const data = event.data;
      const orderId = data.metadata?.orderId || data.reference?.split("-")[1];

      // Use shared finalize logic (updates DB and sends email)
      const finalizeRes = await finalizeOrder(orderId);

      if (!finalizeRes.success) {
        console.error("Finalization failed for order:", orderId, finalizeRes.error);
        return NextResponse.json({ error: "Order finalization failed" }, { status: 500 });
      }

      console.log(`Order ${orderId} finalized via Webhook`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Lahza Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
