/**
 * PalPay Payment Integration Utility
 * This module handles the generation of payment requests and hash verification.
 */

const PALPAY_API_URL = process.env.PALPAY_API_URL || "https://checkout.palpay.ps/api/v1/checkout";
const MERCHANT_ID = process.env.PALPAY_MERCHANT_ID || "YOUR_MERCHANT_ID";
const SECRET_KEY = process.env.PALPAY_SECRET_KEY || "YOUR_SECRET_KEY";

export async function generatePalPayUrl(orderId: number, amount: number, customerInfo: { name: string, phone: string }) {
    // Note: This is an illustrative implementation based on standard PalPay REST flows.
    // In a real environment, you would use CryptoJS or similar to sign the request.

    const payload = {
        merchant_id: MERCHANT_ID,
        order_id: String(orderId),
        amount: amount.toFixed(2),
        currency: "ILS",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel?orderId=${orderId}`,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        support_email: process.env.PALPAY_SUPPORT_EMAIL || "mutaz0101@gmail.com", // ← هاد السطر

        // hash: generateHash(orderId, amount) // Signature logic
    };

    // For this demonstration, we'll simulate a fetch to the PalPay API
    /*
    const response = await fetch(PALPAY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SECRET_KEY}` },
        body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data.redirect_url;
    */
    console.log("PalPay Payload:", JSON.stringify(payload, null, 2));

    // Simulated redirect URL for now
    return `https://checkout.palpay.ps/portal/pay?id=${orderId}&token=demo_token`;
}
