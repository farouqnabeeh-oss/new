import { NextResponse } from "next/server";
import Stripe from "stripe";

// Using the provided sk_test_... key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27" as any,
});

export async function POST(req: Request) {
  try {
    const { amount, orderId, customerName, customerPhone } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "ils",
      metadata: {
        orderId: String(orderId),
        customerName,
        customerPhone,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ 
        clientSecret: paymentIntent.client_secret,
        orderId: orderId
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}