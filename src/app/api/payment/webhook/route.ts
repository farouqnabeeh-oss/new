import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOrderInvoiceEmail } from "@/lib/mail-actions";
import { Order, OrderItem, Branch } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-01-27" as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      event = JSON.parse(body);
    } else {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      // 1. Mark Order as Paid
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .update({ payment_status: "Paid" })
        .eq("id", orderId)
        .select("*, branches(*), order_items(*)")
        .single();

      if (orderError) {
        console.error("Order status update failed:", orderError);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 2. Fetch required details and send Email
      try {
        const rawBranch = orderData.branches;
        const branch: Branch = {
          id: rawBranch.id,
          nameAr: rawBranch.name_ar,
          nameEn: rawBranch.name_en,
          phone: rawBranch.phone,
          whatsApp: rawBranch.whatsapp,
          slug: rawBranch.slug,
          bannerImagePath: rawBranch.banner_image_path,
          discountPercent: rawBranch.discount_percent,
          isActive: rawBranch.is_active,
          sortOrder: rawBranch.sort_order,
          latitude: rawBranch.latitude,
          longitude: rawBranch.longitude,
          openingTime: rawBranch.opening_time,
          closingTime: rawBranch.closing_time,
          deliveryFee: rawBranch.delivery_fee,
          createdAt: rawBranch.created_at,
          updatedAt: rawBranch.updated_at
        };

        const order: Order = {
          ...orderData,
          createdAt: orderData.created_at,
          totalAmount: orderData.total_amount,
          paymentMethod: orderData.payment_method,
          customerEmail: orderData.customer_email
        } as any;

        const items: OrderItem[] = (orderData.order_items || []).map((oi: any) => ({
          id: oi.id,
          orderId: oi.order_id,
          productId: oi.product_id,
          productNameAr: oi.product_name_ar,
          productNameEn: oi.product_name_en,
          quantity: oi.quantity,
          price: oi.price,
          addonDetails: oi.addon_details
        }));

        await sendOrderInvoiceEmail(order, items, branch);
      } catch (mailErr) {
        console.error("Webhook email triggering failed:", mailErr);
      }

      console.log(`Order ${orderId} marked as Paid and Email sent.`);
    }
  }

  return NextResponse.json({ received: true });
}
