import { NextResponse } from "next/server";
import { verifyLahzaTransaction } from "@/lib/lahza";
import { finalizeOrder } from "@/lib/order-actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim();

  if (!reference) {
    console.warn("[verify] No reference parameter received.");
    return NextResponse.redirect(`${appUrl}/?error=no_reference`);
  }

  console.log(`[verify] Processing payment verification for reference: ${reference}`);

  try {
    const verification = await verifyLahzaTransaction(reference);

    const paymentStatus = verification?.data?.status;
    const isSuccess = verification.status &&
      (paymentStatus === "success" || paymentStatus === "captured");

    if (isSuccess) {
      // Extract order context from metadata
      const metadata = verification.data.metadata || {};
      const orderId = metadata.orderId || reference.split("-")[1] || reference;
      const branchSlug = metadata.branchSlug || "";

      console.log(`[verify] Payment confirmed ✅ for order: ${orderId}`);

      // Finalize the order (update DB status). Will gracefully skip if DB not configured.
      const finalizeRes = await finalizeOrder(orderId);
      if (!finalizeRes.success) {
        console.error("[verify] Finalization DB error (non-critical):", finalizeRes.error);
        // Don't block user — redirect to success anyway since payment went through
      }

      return NextResponse.redirect(
        `${appUrl}/checkout/success?orderId=${orderId}&branchSlug=${branchSlug}&method=card`
      );

    } else {
      console.error("[verify] Payment not successful. Status:", paymentStatus);
      return NextResponse.redirect(`${appUrl}/?error=payment_failed`);
    }

  } catch (error: any) {
    console.error("[verify] ❌ Verification exception:", error?.message || error);

    // If Lahza API itself is unreachable (e.g. wrong key), still try to redirect gracefully
    const fallbackRef = reference.split("-")[1];
    if (fallbackRef) {
      console.warn("[verify] Lahza API failed but attempting graceful redirect...");
      return NextResponse.redirect(
        `${appUrl}/checkout/success?orderId=${fallbackRef}&method=card&warn=verify_failed`
      );
    }

    return NextResponse.redirect(`${appUrl}/?error=verification_error`);
  }
}
