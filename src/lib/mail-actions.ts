"use server";

import { Resend } from "resend";
import type { Order, OrderItem, Branch } from "@/lib/types";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_EidYBZd7_Mu9PHHi7wBpWiiSiMsPEF2oG');

export async function sendOrderInvoiceEmail(order: any, items: any[], branch: any) {
    // 1. معالجة البيانات لتجنب الـ undefined (دعم الحالتين snake_case و camelCase)
    const o = {
        id: order.id,
        customerEmail: order.customerEmail || order.customer_email || order.email,
        customerName: order.customerName || order.customer_name || "زبون أبتاون",
        totalAmount: order.totalAmount || order.total_amount,
        paymentMethod: order.paymentMethod || order.payment_method,
        createdAt: order.createdAt || order.created_at,
    };

    const b = {
        nameAr: branch?.nameAr || branch?.name_ar || "أبتاون - Uptown",
        phone: branch?.phone || "غير متوفر",
        whatsApp: branch?.whatsApp || branch?.whatsapp || branch?.phone,
    };

    const transactionDate = o.createdAt ? new Date(o.createdAt).toLocaleString('ar-EG') : new Date().toLocaleString('ar-EG');
    const paymentMethodText = (o.paymentMethod === 'Card' || o.paymentMethod === 'palpay') ? 'بطاقة ائتمان' : 'نقداً';

    // 2. معالجة المنتجات
    const itemsHtml = items.map(item => {
        const name = item.productNameAr || item.product_name_ar || "منتج";
        const qty = item.quantity || 1;
        const price = item.price || 0;
        return `
            <tr>
                <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: right;">${name} x ${qty}</td>
                <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left;">${price} ₪</td>
            </tr>
        `;
    }).join('');

    const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden; background: #fff;">
            <div style="background: #8B0000; color: #fff; padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">فاتورة شراء</h1>
                <p style="margin: 10px 0 0; opacity: 0.8; font-size: 16px;">${b.nameAr}</p>
            </div>
            <div style="padding: 30px;">
                <div style="text-align: right; margin-bottom: 30px;">
                    <p style="font-size: 16px; color: #333;">شكراً لطلبك من <strong>${b.nameAr}</strong>، يا <strong>${o.customerName}</strong>.</p>
                </div>
                <table style="width: 100%; margin-bottom: 30px; font-size: 14px; border-collapse: collapse; background: #fdfdfd; border-radius: 12px; overflow: hidden;">
                    <tr>
                        <td style="padding: 15px; border: 1px solid #f0f0f0;"><strong>رقم الطلب:</strong><br> #${o.id}</td>
                        <td style="padding: 15px; border: 1px solid #f0f0f0; text-align: left;"><strong>التاريخ:</strong><br> ${transactionDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px; border: 1px solid #f0f0f0;"><strong>رقم العملية:</strong><br> TXN-${o.id}</td>
                        <td style="padding: 15px; border: 1px solid #f0f0f0; text-align: left;"><strong>طريقة الدفع:</strong><br> ${paymentMethodText}</td>
                    </tr>
                </table>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="background: #f9f9f9; color: #666; font-size: 13px;">
                            <th style="padding: 12px 10px; text-align: right; border-bottom: 2px solid #eee;">المنتج</th>
                            <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #eee;">السعر</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 25px 10px 10px; font-weight: 900; font-size: 20px;">المجموع الإجمالي</td>
                            <td style="padding: 25px 10px 10px; font-weight: 900; font-size: 20px; text-align: left; color: #8B0000;">${o.totalAmount} ₪</td>
                        </tr>
                    </tfoot>
                </table>
                <div style="background: #fff8f8; padding: 25px; border-radius: 12px; border: 1px solid #ffebeb; font-size: 14px; color: #444;">
                    <p style="margin: 0 0 12px; color: #8B0000;"><strong>📍 معلومات الفرع:</strong></p>
                    <p style="margin: 0; font-weight: 700;">${b.nameAr}</p>
                    <p style="margin: 4px 0 0;">الهاتف: ${b.phone}</p>
                    ${b.whatsApp ? `<p style="margin: 4px 0 0;">واتساب: ${b.whatsApp}</p>` : ''}
                </div>
                <div style="margin-top: 30px; text-align: center;">
                    <a href="https://uptownps.com/order-status?orderId=${o.id}" style="background: #8B0000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">تتبع حالة الطلب</a>
                </div>
            </div>
            <div style="background: #f4f4f4; padding: 25px; text-align: center; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} ${b.nameAr}
            </div>
        </div>
    `;

    try {
        if (!o.customerEmail || o.customerEmail.includes('customer@uptownps.com')) {
             console.warn("[Email] ⚠️ No valid customer email found.");
             return { success: false };
        }

        const { data, error } = await resend.emails.send({
            from: 'أبتاون - UPTOWN <orders@uptownps.com>', 
            to: [o.customerEmail],
            subject: `فاتورة طلبك من ${b.nameAr} (#${o.id})`,
            html: emailHtml,
        });

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        console.error("Email Error:", err.message);
        return { success: false };
    }
}