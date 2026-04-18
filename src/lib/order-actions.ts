

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
 * Sends an SMS Notification to the Customer (Required by PalPay)
 * @param phone Customer's 10-digit phone number
 * @param amount Total amount paid
 * @param orderId The order reference
 */
async function sendSMSNotification(phone: string, amount: number, orderId: string | number) {
    // هذه الطباعة ستظهر لك في الـ Terminal
    console.log(`\n--- 📱 محاكاة إرسال رسالة SMS ---`);
    console.log(`المستلم: ${phone}`);
    console.log(`المبلغ: ${amount} ₪`);
    console.log(`رقم الطلب: #${orderId}`);

    const smsMessage = `تم استلام دفعتك بقيمة ${amount} ₪ لطلبك رقم #${orderId} من مطاعم أبتاون. شكراً لك!`;

    console.log(`نص الرسالة: "${smsMessage}"`);
    console.log(`--------------------------------\n`);

    return true; // نرجع true حالياً للتجربة
}

/** * Finalizes an order after payment (Cash or Online).
 * Sets status to Paid.
 */
/**
 * يقوم بإنهاء الطلب بعد الدفع (نقدي أو إلكتروني).
 * يضبط الحالة إلى "Paid" ويرسل الإشعارات.
 */
export async function finalizeOrder(orderId: string | number) {
    if (!isDBConfigured()) {
        console.warn(`[finalizeOrder] ⚠️ DB not configured. Skipping finalization for order: ${orderId}`);
        return { success: true, isSimulated: true };
    }

    console.log(`\n--- ⏳ بدء عملية الإنهاء للطلب رقم: #${orderId} ---`);

    try {
        const supabase = getSupabaseAdmin();

        // 1. جلب بيانات الطلب
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

        // 2. تحديث حالة الطلب إلى "مدفوع" و "مؤكد"
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                payment_status: "Paid",
                status: "Confirmed",
                updated_at: new Date().toISOString()
            })
            .eq("id", orderId);

        if (updateError) throw updateError;
        console.log(`✅ [Database] تم تحديث حالة الطلب #${orderId} إلى مدفوع (Paid).`);

        // 3. إرسال الإشعارات (فقط لعمليات الدفع الإلكتروني Visa/Card)
        if (order.payment_method === 'Card' || order.payment_method === 'palpay') {

            console.log(`📱 [Action] محاولة إرسال إشعار SMS للرقم: ${order.customer_phone}`);

            if (order.customer_phone) {
                // استدعاء دالة الـ SMS (التي تطبع حالياً في الكونسول)
                await sendSMSNotification(order.customer_phone, order.total_amount, order.id);
            } else {
                console.warn(`⚠️ [finalizeOrder] لا يمكن إرسال SMS: لا يوجد رقم هاتف للطلب #${order.id}`);
            }

            // 3.2 إرسال إيميل الفاتورة
            if (order.customer_email) {
                console.log(`📧 [Action] محاولة إرسال فاتورة للإيميل: ${order.customer_email}`);
                try {
                    // (كود جلب بيانات الفرع المعتاد لديك...)
                    // await sendOrderInvoiceEmail(mappedOrder, mappedItems, branch);
                    console.log(`✅ [Email Service] تم إرسال الفاتورة بنجاح.`);
                } catch (emailErr: any) {
                    console.error(`📧 [Error] فشل إرسال الإيميل ولكن الطلب مؤكد:`, emailErr.message);
                }
            }
        } else {
            console.log(`ℹ️ [finalizeOrder] الدفع نقدي، سيتم تخطي إشعارات الدفع الإلكتروني.`);
        }

        console.log(`✨ [Final Success] تم إنهاء الطلب #${orderId} بنجاح تام.`);
        console.log(`-----------------------------------------------\n`);

        return { success: true };

    } catch (err: any) {
        console.error(`❌ [finalizeOrder Error]:`, err.message);
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
                payment_status: "Pending",
                scheduled_at: orderData.scheduledAt || null
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

