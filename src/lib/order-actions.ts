"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOrderInvoiceEmail } from "./mail-actions";

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
 * Verifies the reCAPTCHA token with Google's API.
 */
async function verifyRecaptcha(token: string) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
        console.warn("[reCAPTCHA] ⚠️ RECAPTCHA_SECRET_KEY not set. Skipping verification.");
        return true;
    }

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secret}&response=${token}`
        });

        const data = await response.json();
        return data.success;
    } catch (err) {
        console.error("[reCAPTCHA] ❌ Verification error:", err);
        return false;
    }
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

        const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (itemsError) console.warn("[finalizeOrder] Failed to fetch items for email:", itemsError.message);

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

        // 3. Send Real Confirmation Email (Only for Visa/Card payments)
        if (order.payment_method === 'Card' || order.payment_method === 'palpay') {
            try {
                const { data: branchData } = await supabase
                    .from("branches")
                    .select("*")
                    .eq("id", order.branch_id)
                    .single();

                if (branchData) {
                    const branch = {
                        id: branchData.id,
                        nameAr: branchData.name_ar,
                        phone: branchData.phone,
                        whatsApp: branchData.whatsapp
                    } as any;

                    // Map Supabase snake_case to CamelCase expected by the email function
                    const mappedOrder = {
                        ...order,
                        id: order.id,
                        totalAmount: order.total_amount,
                        customerEmail: order.customer_email,
                        customerPhone: order.customer_phone,
                        orderType: order.order_type,
                        paymentMethod: order.payment_method,
                        createdAt: (order as any).created_at || new Date().toISOString()
                    };

                    const mappedItems = (items || []).map(item => ({
                        productNameAr: item.product_name_ar,
                        productNameEn: item.product_name_en,
                        quantity: item.quantity,
                        price: item.price
                    }));

                    await sendOrderInvoiceEmail(mappedOrder as any, mappedItems as any, branch);
                }
            } catch (emailErr: any) {
                console.error(`[finalizeOrder] 📧 Email failed but order is confirmed:`, emailErr.message);
            }
        } else {
            console.log(`[finalizeOrder] ℹ️ Skipping email for non-card payment: ${order.payment_method}`);
        }

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

export async function saveOrderAction(orderData: any, items: any[], captchaToken?: string) {
    console.log(`[saveOrderAction] Processing order for: ${orderData.customerName}`);

    // Verify Captcha if token provided (or if secret is set)
    if (process.env.RECAPTCHA_SECRET_KEY && !orderData.isDemo) {
        if (!captchaToken) {
            return { success: false, error: "Please complete the reCAPTCHA verification" };
        }
        const isValid = await verifyRecaptcha(captchaToken);
        if (!isValid) {
            return { success: false, error: "reCAPTCHA verification failed. Please try again." };
        }
    }

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
        console.log(`[saveOrderAction] 📦 Inserting order for customer ${customer.id}, amount ${totalAmount}...`);

        const { data: orderResponse, error: orderError } = await supabase
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
                payment_status: "Pending"
            })
            .select("id")
            .single();

        if (orderError) {
            console.error("[saveOrderAction] ❌ Supabase Order Insert Error:", orderError);
            throw new Error(`Order insertion failed: ${orderError.message}`);
        }

        if (!orderResponse || !orderResponse.id) {
            console.error("[saveOrderAction] ❌ No ID returned from order insert. Response:", orderResponse);
            throw new Error("Failed to retrieve order ID from database.");
        }

        const orderId = orderResponse.id;
        console.log(`[saveOrderAction] ✨ Order created with ID: ${orderId}`);

        // 3. Insert Order Items
        const orderItems = items.map(item => ({
            order_id: orderId,
            product_id: item.id ? Number(item.id) : null,
            product_name_ar: item.nameAr || "",
            product_name_en: item.nameEn || "",
            quantity: item.quantity,
            price: item.finalPrice ?? item.price ?? 0,
            addon_details: item.addonDetails || null
        }));

        if (orderItems.length > 0) {
            console.log(`[saveOrderAction] 🛒 Inserting ${orderItems.length} items...`);
            const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
            if (itemsError) {
                console.error("[saveOrderAction] ❌ Order Items Insert Error:", itemsError);
                throw itemsError;
            }
        }

        // 4. Finalize immediately for Cash/WhatsApp orders
        if (orderData.paymentMethod === 'Cash') {
            await finalizeOrder(orderId);
        }

        console.log(`[saveOrderAction] ✅ Order ${orderId} finalized and saved successfully.`);
        return { success: true, orderId: orderId };

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

/**
 * Sends a confirmation email to the customer (Mock implementation).
 * In production, this would use Resend, Nodemailer, or an AWS SES trigger.
 */
async function sendOrderConfirmationEmail(order: any, items: any[]) {
    const email = order.customer_email || order.email;
    if (!email || email.includes("customer@uptown.ps")) {
        console.log(`[Email] ⚠️ No valid customer email found for order #${order.id}. Skipping.`);
        return;
    }

    const date = new Date().toLocaleString('ar-PS', { timeZone: 'Asia/Gaza' });
    const itemsList = items.map(item => {
        const name = item.product_name_ar && item.product_name_en 
            ? `${item.product_name_ar} / ${item.product_name_en}`
            : (item.product_name_ar || item.product_name_en);
        return `   - ${item.quantity}x ${name} (${item.price} ₪)`;
    }).join('\n');
    
    const emailBody = `
========================================
        شكراً لتسوقكم من UPTOWN
        Thank you for choosing UPTOWN
========================================

تاجر / Merchant: مطاعم أبتاون - UPTOWN Restaurants
العنوان / Address: فلسطين، رام الله، شارع الإرسال
الرابط / Website: https://uptown.ps

تفاصيل الطلب / Order Details:
رقم الطلب / Order ID: #${order.id}
التاريخ / Date: ${date}
تاريخ التسليم المتوقع / Expected Delivery: ${order.order_type === 'Delivery' ? 'خلال 30-60 دقيقة / Within 30-60 mins' : 'فوراً / Immediately'}
العنوان / Delivery Address: ${order.address || 'لا يوجد / None'}

تفاصيل الدفع / Payment Info:
طريقة الدفع / Payment Method: ${order.payment_method === 'Card' ? 'بطاقة ائتمان / Credit Card' : 'نقدي / Cash'}
${order.payment_method === 'Card' ? `نوع البطاقة / Card Type: Visa / MasterCard
آخر ٤ أرقام / Last 4 Digits: ****
رمز التحقق / CVV: مخفي للأمان / Hidden for security` : ''}

قائمة المنتجات / Items:
${itemsList}

المبلغ الإجمالي / Total Amount: ${order.total_amount} ₪
(السعر يشمل تكاليف الشحن وضريبة القيمة المضافة إن وجدت)
الحالة / Status: ${order.payment_status === 'Paid' ? 'تم الدفع / Paid' : 'في انتظار الدفع / Pending Payment'}

----------------------------------------
* لسياسة الاسترجاع والإلغاء، يرجى زيارة: https://uptown.ps/policies/return

تواصل معنا / Contact: uptownramallah@gmail.com
الهاتف / Phone: 022950505
========================================
    `;

    console.log(`[Email Service] 📧 Sending email to ${email}...`);
    console.log(emailBody);
    
    return true;
}

export async function updateOrderStatus(orderId: number | string, newStatus: string, estimatedTime?: string) {
    if (!isDBConfigured()) return { success: false, error: "DB not configured" };
    try {
        const supabase = getSupabaseAdmin();
        const updateData: any = { status: newStatus, updated_at: new Date().toISOString() };
        if (estimatedTime) updateData.estimated_time = estimatedTime;

        const { error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", orderId);
        
        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error("[updateOrderStatus] Error:", err.message);
        return { success: false, error: err.message };
    }
}
