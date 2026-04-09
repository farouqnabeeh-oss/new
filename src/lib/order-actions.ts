"use server";

import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Checks if the database is configured (non-placeholder URL).
 */
function isDBConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    return (
        url.length > 0 &&
        !url.includes("your-project") &&
        !url.includes("your-supabase") &&
        url.startsWith("https://") &&
        url.includes(".supabase.co")
    );
}

/** 
 * Finalizes an order after payment (Cash or Online).
 * Sets status to Paid.
 */
export async function finalizeOrder(orderId: string | number) {
    if (!isDBConfigured()) {
        console.warn(`[finalizeOrder] ⚠️ DB not configured. Skipping finalization for order: ${orderId}`);
        return { success: true, isSimulated: true };
    }

    console.log(`[finalizeOrder] Starting finalization for order: ${orderId}`);

    try {
        const supabase = getSupabaseAdmin();

        // 1. Get Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("id, branch_id, total_amount, customer_email, customer_phone, order_type, payment_method")
            .eq("id", orderId)
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error("Order not found");

        // 2. Update status to Paid
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                payment_status: "Paid",
                status: "Confirmed",
                updated_at: new Date().toISOString()
            })
            .eq("id", orderId);

        if (updateError) throw updateError;

        console.log(`[finalizeOrder] ✅ Order ${orderId} finalized successfully.`);
        return { success: true };

    } catch (err: any) {
        console.error(`[finalizeOrder] ❌ Error:`, err.message);
        // Don't crash the payment redirect for notification failures
        if (err.message?.includes("fetch failed")) {
            return { success: true, isSimulated: true };
        }
        return { success: false, error: err.message || "Failed to finalize order" };
    }
}

export async function saveOrderAction(orderData: any, items: any[]) {
    console.log(`[saveOrderAction] Processing order for: ${orderData.customerName}`);

    if (!isDBConfigured()) {
        console.warn("[saveOrderAction] ⚠️ DB not configured. Running in demo mode.");
        const demoOrderId = Math.floor(10000 + Math.random() * 90000);
        return { success: true, orderId: demoOrderId, isDemo: true };
    }

    try {
        const supabase = getSupabaseAdmin();

        // 1. Upsert Customer
        const { data: customer, error: customerError } = await supabase
            .from("customers")
            .upsert({
                phone: orderData.customerPhone,
                name: orderData.customerName,
                email: orderData.customerEmail,
                last_order_at: new Date().toISOString()
            }, { onConflict: 'phone' })
            .select("id")
            .single();

        if (customerError) throw customerError;

        // 2. Insert Order
        const totalAmount = orderData.totalAmount ?? orderData.total_amount ?? 0;
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                branch_id: orderData.branchId,
                customer_id: customer.id,
                customer_name: orderData.customerName,
                customer_phone: orderData.customerPhone,
                customer_email: orderData.customerEmail,
                order_type: orderData.orderType,
                address: orderData.address || null,
                table_number: orderData.tableNumber || null,
                total_amount: totalAmount,
                status: "Pending",
                payment_method: orderData.paymentMethod,
                payment_status: "Pending",
                notes: orderData.notes || null
            })
            .select("id")
            .single();

        if (orderError) throw orderError;

        // 3. Insert Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id || null,
            product_name_ar: item.nameAr || "",
            product_name_en: item.nameEn || "",
            quantity: item.quantity,
            price: item.finalPrice ?? item.price ?? 0,
            addon_details: item.addonDetails || null
        }));

        if (orderItems.length > 0) {
            const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
            if (itemsError) throw itemsError;
        }

        // 4. Finalize immediately for Cash/WhatsApp orders
        if (orderData.paymentMethod === 'Cash') {
            await finalizeOrder(order.id);
        }

        console.log(`[saveOrderAction] ✅ Order ${order.id} saved successfully.`);
        return { success: true, orderId: order.id };

    } catch (err: any) {
        console.error(`[saveOrderAction] ❌ Error:`, err.message);
        return { success: false, error: err.message || "Unknown error during save" };
    }
}

export async function getOrderSummary(orderId: string | number) {
    if (!isDBConfigured()) {
        // In demo mode: return generic receipt structure with the given orderId
        console.warn(`[getOrderSummary] ⚠️ DB not configured. Returning demo receipt for #${orderId}`);
        return {
            success: true,
            order: {
                id: orderId,
                customer_name: null,
                order_type: null,
                total_amount: null,
                branches: null,
                order_items: []
            },
            isDemo: true
        };
    }

    try {
        const supabase = getSupabaseAdmin();
        const { data: order, error } = await supabase
            .from("orders")
            .select("*, order_items(*), branches(*)")
            .eq("id", orderId)
            .single();

        if (error) throw error;
        return { success: true, order };

    } catch (err: any) {
        console.error(`[getOrderSummary] ❌ Error:`, err.message);
        return {
            success: false,
            error: err.message,
            order: null
        };
    }
}
