import { NextResponse } from "next/server";
import { verifyLahzaTransaction } from "@/lib/lahza";
import { finalizeOrder, markOrderFailed } from "@/lib/order-actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim();

  if (!reference) {
    console.warn("[verify] No reference parameter received.");
    return NextResponse.redirect(`${appUrl}/?error=no_reference`);
  }

  console.log(`[verify] Processing payment verification for reference: ${reference}`);

  // استخرج orderId من الـ reference مبكراً — الصيغة: ORD-{orderId}-{timestamp}
  const orderId = reference.split("-")[1];

  try {
    const verification = await verifyLahzaTransaction(reference);

    console.log("[verify] Full response:", JSON.stringify(verification, null, 2));


    const paymentStatus = verification?.data?.status;
    const isSuccess = verification.status &&
      (paymentStatus === "success" || paymentStatus === "captured");

    if (isSuccess) {
      const metadata = verification.data.metadata || {};
      const resolvedOrderId = metadata.orderId || orderId || reference;
      const branchSlug = metadata.branchSlug || "";

      console.log(`[verify] ✅ Payment confirmed for order: ${resolvedOrderId}`);

      const finalizeRes = await finalizeOrder(resolvedOrderId);
      if (!finalizeRes.success) {
        console.error("[verify] Finalization DB error:", finalizeRes.error);
      }

      return NextResponse.redirect(
        `${appUrl}/checkout/success?orderId=${resolvedOrderId}&branchSlug=${branchSlug}&method=card`
      );

    } else {
      // ✅ سجّل الفشل في DB
      console.error("[verify] ❌ Payment not successful. Status:", paymentStatus);
      if (orderId) await markOrderFailed(orderId, paymentStatus || "failed");
      return NextResponse.redirect(`${appUrl}/?error=payment_failed`);
    }

  } catch (error: any) {
    console.error("[verify] ❌ Verification exception:", error?.message || error);

    // ✅ لا fallback — سجّل الخطأ وأعد توجيه لصفحة الخطأ فقط
    if (orderId) await markOrderFailed(orderId, "verification_error").catch(() => { });
    return NextResponse.redirect(`${appUrl}/?error=verification_error`);
  }
}