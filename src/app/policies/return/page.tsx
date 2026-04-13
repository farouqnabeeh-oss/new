import { BodyClassName } from "@/components/body-class-name";
import { cookies } from "next/headers";

export default async function ReturnPolicyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  const content = {
    title: isAr ? "سياسة الإرجاع والتبديل" : "Return & Exchange Policy",
    tagline: isAr ? "نحن مهتمون برضاكم التام عن كل وجبة" : "Your satisfaction is our top priority",
    sections: [
      {
        icon: "clock",
        title: isAr ? "إلغاء الطلب" : "Order Cancellation",
        text: isAr 
          ? "يمكنكم إلغاء الطلب واسترداد كامل المبلغ في حال لم يتم البدء في تحضير الوجبة بعد. نظراً لطبيعة الوجبات السريعة، لا يمكن إلغاء الطلب بعد دخوله مرحلة التحضير أو بعد خروج مندوب التوصيل."
          : "You can cancel your order and get a full refund if the meal preparation has not started yet. Due to the nature of fast food, orders cannot be canceled after they enter the preparation stage or after the delivery driver has departed."
      },
      {
        icon: "refresh-cw",
        title: isAr ? "سياسة الإرجاع والتبديل" : "Return & Exchange Policy",
        text: isAr 
          ? "إذا استلمت منتجاً تالفاً أو مختلفاً عن طلبك، يرجى إبلاغنا خلال 15 دقيقة من الاستلام. سنقوم بتبديل المنتج فوراً دون تكاليف إضافية، أو سنقوم برد القيمة المالية إذا ثبت وجود خطأ من طرفنا."
          : "If you receive a damaged product or one that differs from your order, please inform us within 15 minutes of receipt. We will replace the product immediately at no extra cost, or refund the amount if an error on our part is confirmed."
      },
      {
        icon: "credit-card",
        title: isAr ? "آلية استرداد الأموال" : "Refund Method",
        text: isAr 
          ? "في حال الدفع الإلكتروني، سيتم استرداد المبالغ المالية إلى نفس البطاقة المستخدمة في عملية الشراء. قد تستغرق العملية من 5 إلى 10 أيام عمل حسب سياسة البنك المصدر للبطاقة. لا يمكن استبدال المبالغ النقدية للمشتريات التي تمت بالبطاقة."
          : "For online payments, refunds will be processed back to the same card used for the purchase. The process may take 5 to 10 business days depending on the issuing bank's policy. Cash refunds are not available for card transactions."
      },
      {
        icon: "truck",
        title: isAr ? "شحن وتوصيل البضائع" : "Delivery & Shipping",
        text: isAr 
          ? "نحن نلتزم بتوصيل الوجبات ساخنة وفي أفضل حالة. تستغرق عملية التوصيل عادةً ما بين 30 إلى 60 دقيقة حسب المسافة والضغط. سيتم إرسال إشعار لك فور خروج الطلب للتوصيل."
          : "We are committed to delivering meals hot and in the best condition. Delivery usually takes 30 to 60 minutes depending on distance and order volume. You will receive a notification as soon as your order is dispatched for delivery."
      }
    ],
    footer: isAr ? "آخر تحديث: أبريل 2026" : "Last Updated: April 2026"
  };

  return (
    <div className="policy-premium-wrapper" style={{ background: '#fff', color: '#000', minHeight: '100vh', fontFamily: 'var(--font-outfit)' }}>
      <BodyClassName className="premium-policy" />
      
      {/* 📄 MINIMALIST HEADER */}
      <section style={{ padding: '160px 24px 80px', textAlign: 'center', background: '#fafafa', borderBottom: '1px solid #eee' }}>
        <div className="animate-fade-down">
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '12px', fontWeight: 900, color: '#999', display: 'block', marginBottom: '15px' }}>
            {isAr ? "سياسة مطاعمنا" : "Our Terms"}
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: 'var(--font-playfair)', fontWeight: 900, marginBottom: '20px' }}>
            {content.title}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>{content.tagline}</p>
        </div>
      </section>

      {/* 🖋️ CONTENT SECTION */}
      <section style={{ padding: '100px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '80px' }}>
          {content.sections.map((section, idx) => (
            <div key={idx} className="animate-fade-up" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: '60px', height: '60px', background: '#000', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <i data-lucide={section.icon} style={{ width: '28px' }} />
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '20px', fontFamily: 'var(--font-playfair)' }}>{section.title}</h2>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.9, color: '#444', textAlign: 'justify' }}>{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '120px', padding: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '14px' }}>{content.footer}</p>
          <p style={{ color: '#000', fontWeight: 900, fontSize: '15px', marginTop: '10px' }}>Uptown & Pasta Signature</p>
        </div>
      </section>
    </div>
  );
}
