import { NextResponse } from "next/server";
import { initializeLahzaTransaction } from "@/lib/lahza";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, email, amount, currency, customerName, customerPhone } = body;

    console.log(`[Lahza] Initiation request for Order #${orderId}, Amount: ${amount} ${currency}`);

    // Guard: orderId must be present (order save must have succeeded)
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order was not saved correctly. Please try again." }, { status: 400 });
    }

    // Ensure amount is a number and valid
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error(`Invalid payment amount: ${amount}`);
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim();
    const paymentReference = `ORD-${orderId}-${Date.now()}`;

    // Amount needs to be in cents/agora (multiply by 100)
    const amountInCents = Math.round(numericAmount * 100);
    console.log(`[Lahza] Converting ${numericAmount} to ${amountInCents} cents/agora`);

    const result = await initializeLahzaTransaction({
      email,
      amount: amountInCents.toString(),
      currency,
      mobile: customerPhone,
      reference: paymentReference,
      // ✅ الصح — يمر على verify أولاً
      callback_url: `${appUrl}/api/payments/lahza/verify?reference=${paymentReference}`,
      metadata: {
        orderId,
        customerName,
        customerPhone,
        branchSlug: body.branchSlug,
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderId.toString()
          },
          {
            display_name: "Customer Phone",
            variable_name: "customer_phone",
            value: customerPhone
          },
          // {
          //   display_name: "Support Email",
          //   variable_name: "support_email",
          //   value: process.env.SUPPORT_EMAIL || "mutaz0101@gmail.com"
          // }
        ]
      }
    });

    if (result.status && result.data.authorization_url) {
      console.log("Lahza Authorization URL generated:", result.data.authorization_url);
      return NextResponse.json({
        success: true,
        authorizationUrl: result.data.authorization_url,
        reference: result.data.reference || paymentReference
      });
    } else {
      const msg = result.message || "Failed to get authorization URL from Lahza";
      if (msg.includes("Invalid Key") || msg.includes("Key")) {
        throw new Error("Invalid LAHZA_SECRET_KEY. Please verify your .env configuration.");
      }
      throw new Error(msg);
    }

  } catch (error: any) {
    console.error("Lahza Initiation Error Detail:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown initiation error",
      detail: error.cause ? error.cause.message : undefined
    }, { status: 500 });
  }
}
