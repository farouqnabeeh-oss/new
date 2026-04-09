import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, orderDetails, total, branchName } = body;

    // In a real production environment, you would use a service like Resend, SendGrid, or nodemailer here.
    // Example with a mock log:
    console.log("--- ORDER EMAIL SIMULATION ---");
    console.log(`To: ${customerEmail || "Customer"}`);
    console.log(`Subject: Your Order from ${branchName}`);
    console.log(`Body: 
      Hello ${customerName},
      
      Thank you for your order at ${branchName}!
      
      Order Details:
      ${orderDetails}
      
      Total: ${total}
      
      We are preparing your food now.
    `);
    console.log("------------------------------");

    // Success response
    return NextResponse.json({ success: true, message: "Email sent successfully (Simulated)" });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
