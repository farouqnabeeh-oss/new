"use server";

import { Resend } from "resend";
import type { Order, OrderItem, Branch } from "@/lib/types";

// Initialize Resend with the provided API Key
const resend = new Resend(process.env.RESEND_API_KEY || 're_EidYBZd7_Mu9PHHi7wBpWiiSiMsPEF2oG');

/**
 * Sends an invoice email to the buyer after a successful purchase.
 */
export async function sendOrderInvoiceEmail(order: Order, items: OrderItem[], branch: Branch) {
    const isAr = true; // Defaulting to Arabic for this restaurant

    const storeName = branch.nameAr || "أبتاون - Uptown";
    const transactionDate = new Date(order.createdAt).toLocaleString('ar-EG');
    const orderNumber = order.id;
    const transactionNumber = `TXN-${order.id}-${Date.now().toString().slice(-4)}`;
    const paymentMethod = (order.paymentMethod === 'Card' || order.paymentMethod === 'palpay') ? 'بطاقة ائتمان' : 'نقداً';

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: right;">${item.productNameAr} x ${item.quantity}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left;">${item.price} ₪</td>
        </tr>
    `).join('');

    const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden; background: #fff;">
            <div style="background: #8B0000; color: #fff; padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">فاتورة شراء</h1>
                <p style="margin: 10px 0 0; opacity: 0.8; font-size: 16px;">${storeName}</p>
            </div>
            
            <div style="padding: 30px;">
                <div style="text-align: right; margin-bottom: 30px;">
                    <p style="font-size: 16px; color: #333;">شكراً لطلبك من <strong>${storeName}</strong>. يسعدنا دائماً خدمتك.</p>
                </div>

                <table style="width: 100%; margin-bottom: 30px; font-size: 14px; border-collapse: collapse; background: #fdfdfd; border-radius: 12px; overflow: hidden;">
                    <tr>
                        <td style="padding: 15px; border: 1px solid #f0f0f0;"><strong>رقم الطلب:</strong><br> #${orderNumber}</td>
                        <td style="padding: 15px; border: 1px solid #f0f0f0; text-align: left;"><strong>التاريخ:</strong><br> ${transactionDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px; border: 1px solid #f0f0f0;"><strong>رقم العملية:</strong><br> ${transactionNumber}</td>
                        <td style="padding: 15px; border: 1px solid #f0f0f0; text-align: left;"><strong>طريقة الدفع:</strong><br> ${paymentMethod}</td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f9f9f9; color: #666; font-size: 13px;">
                            <th style="padding: 12px 10px; text-align: right; border-bottom: 2px solid #eee;">المنتج</th>
                            <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #eee;">السعر</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 25px 10px 10px; font-weight: 900; font-size: 20px;">المجموع الإجمالي</td>
                            <td style="padding: 25px 10px 10px; font-weight: 900; font-size: 20px; text-align: left; color: #8B0000;">${order.totalAmount} ₪</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="background: #fff8f8; padding: 25px; border-radius: 12px; border: 1px solid #ffebeb; font-size: 14px; color: #444;">
                    <p style="margin: 0 0 12px; color: #8B0000;"><strong>📍 معلومات الفرع:</strong></p>
                    <p style="margin: 0; font-weight: 700;">${branch.nameAr}</p>
                    <p style="margin: 4px 0 0;">الهاتف: ${branch.phone}</p>
                    ${branch.whatsApp ? `<p style="margin: 4px 0 0;">واتساب: ${branch.whatsApp}</p>` : ''}
                </div>
                
                <div style="margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                    <a href="https://uptown.ps/order-status?id=${order.id}" style="background: #8B0000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">تتبع حالة الطلب</a>
                </div>
            </div>

            <div style="background: #f4f4f4; padding: 25px; text-align: center; font-size: 12px; color: #888; line-height: 1.6;">
                هذا البريد مرسل تلقائياً كنظام فوترة، يرجى عدم الرد عليه.
                <br> © ${new Date().getFullYear()} ${storeName} - جميع الحقوق محفوظة.
            </div>
        </div>
    `;

    try {
        if (!order.customerEmail || order.customerEmail.includes('customer@uptown.ps')) {
             console.warn("[Email] ⚠️ No valid customer email found. Skipping send.");
             return { success: false, error: "No valid email" };
        }

        const { data, error } = await resend.emails.send({
            from: 'أبتاون - UPTOWN <orders@uptownps.com>', 
            to: [order.customerEmail],
            replyTo: 'uptownramallah@gmail.com',
            subject: `فاتورة طلبك من ${storeName} (#${orderNumber})`,
            html: emailHtml,
        });

        if (error) {
            console.error("Resend API Error:", error);
            // If it's a domain verification issue, log a helpful message
            if (error.message.includes('domain')) {
                console.log("TIP: Verify your domain on Resend.com to send from a custom address.");
            }
            return { success: false, error: error.message };
        }

        console.log("Email sent successfully:", data);
        return { success: true, id: data?.id };
    } catch (err: any) {
        console.error("Email sending exception:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Sends a WhatsApp notification to the buyer (Simulated).
 */
export async function sendOrderWhatsAppNotification(order: Order, items: OrderItem[], branch: Branch) {
    const isAr = true;
    const message = `*طلب جديد من ${branch.nameAr}*\n\n` +
        `رقم الطلب: #${order.id}\n` +
        `المجموع: ${order.totalAmount} ₪\n\n` +
        `شكراً لثقتك بنا!`;

    console.log("--- SIMULATED WHATSAPP START ---");
    console.log(`To: ${order.customerPhone}`);
    console.log(`Message: ${message}`);
    console.log("--- SIMULATED WHATSAPP END ---");

    return { success: true, message };
}
