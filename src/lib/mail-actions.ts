"use server";

import type { Order, OrderItem, Branch } from "@/lib/types";

/**
 * Sends an invoice email to the buyer after a successful purchase.
 * Currently simulates sending by logging to console.
 * Integrators: Connect this to Resend, SendGrid, or Nodemailer.
 */
export async function sendOrderInvoiceEmail(order: Order, items: OrderItem[], branch: Branch) {
    const isAr = order.customerEmail.includes(".ar") || true; // Simplistic locale detection or pass it

    const storeName = branch.nameAr;
    const transactionDate = new Date(order.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US');
    const orderNumber = order.id;
    const transactionNumber = `TXN-${order.id}-${Date.now().toString().slice(-4)}`;
    const paymentMethod = order.paymentMethod === 'Card' ? (isAr ? 'بطاقة ائتمان' : 'Credit Card') : (isAr ? 'نقداً' : 'Cash');

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productNameAr} x ${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} ₪</td>
        </tr>
    `).join('');

    const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
            <div style="background: #8B0000; color: #fff; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">فاتورة شراء - ${storeName}</h1>
            </div>
            <div style="padding: 30px;">
                <p>شكراً لطلبك من <strong>${storeName}</strong>. إليك تفاصيل طلبك:</p>
                
                <table style="width: 100%; margin-bottom: 20px; font-size: 14px;">
                    <tr>
                        <td><strong>رقم الطلب:</strong> #${orderNumber}</td>
                        <td style="text-align: left;"><strong>التاريخ:</strong> ${transactionDate}</td>
                    </tr>
                    <tr>
                        <td><strong>رقم العملية:</strong> ${transactionNumber}</td>
                        <td style="text-align: left;"><strong>طريقة الدفع:</strong> ${paymentMethod}</td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f9f9f9;">
                            <th style="padding: 10px; text-align: right;">المنتج</th>
                            <th style="padding: 10px; text-align: left;">السعر</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 20px 10px; font-weight: 900; font-size: 18px;">المجموع الإجمالي</td>
                            <td style="padding: 20px 10px; font-weight: 900; font-size: 18px; text-align: left; color: #8B0000;">${order.totalAmount} ₪</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="background: #fdfdfd; padding: 20px; border-radius: 8px; border: 1px dashed #ddd; font-size: 13px; color: #666;">
                    <p style="margin: 0 0 10px;"><strong>معلومات الفرع:</strong></p>
                    <p style="margin: 0;">${branch.nameAr}</p>
                    <p style="margin: 0;">${branch.phone}</p>
                </div>
            </div>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                هذا البريد مرسل تلقائياً، يرجى عدم الرد عليه.
                <br> © ${new Date().getFullYear()} ${storeName}
            </div>
        </div>
    `;

    console.log("--- SIMULATED INVOICE EMAIL START ---");
    console.log(`To: ${order.customerEmail}`);
    console.log(`Subject: فاتورة طلبك من ${storeName} (#${orderNumber})`);
    console.log("Body Snippet:", emailHtml.slice(0, 200) + "...");
    console.log("--- SIMULATED INVOICE EMAIL END ---");

    return { success: true };
}

/**
 * Sends a WhatsApp notification to the buyer (Simulated).
 * In production, this would call a WhatsApp API provider.
 */
export async function sendOrderWhatsAppNotification(order: Order, items: OrderItem[], branch: Branch) {
    const isAr = true;
    const message = isAr
        ? `*طلب جديد من ${branch.nameAr}*\n\n` +
        `رقم الطلب: #${order.id}\n` +
        `المجموع: ${order.totalAmount} ₪\n\n` +
        `شكراً لثقتك بنا!`
        : `*New Order from ${branch.nameEn}*\n\n` +
        `Order ID: #${order.id}\n` +
        `Total: ${order.totalAmount} ₪\n\n` +
        `Thank you for choosing us!`;

    console.log("--- SIMULATED WHATSAPP START ---");
    console.log(`To: ${order.customerPhone}`);
    console.log(`Message: ${message}`);
    console.log("--- SIMULATED WHATSAPP END ---");

    return { success: true, message };
}
