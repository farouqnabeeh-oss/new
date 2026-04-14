import { BodyClassName } from "@/components/body-class-name";
import { cookies } from "next/headers";

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  const content = {
    title: isAr ? "سياسة الخصوصية" : "Privacy Policy",
    tagline: isAr ? "نحن نولي أهمية قصوى لخصوصية بياناتكم وأمانها" : "We prioritize the privacy and security of your data",
    sections: [
      {
        icon: "eye",
        title: isAr ? "جمع المعلومات" : "Information Collection",
        text: isAr
          ? "نقوم بجمع الحد الأدنى من البيانات اللازمة لإتمام طلباتكم، مثل الاسم، رقم الهاتف، وعنوان التوصيل. نستخدم هذه البيانات فقط لضمان وصول طلبكم بأفضل جودة."
          : "We collect the minimum data necessary to complete your orders, such as name, phone number, and delivery address. We use this data only to ensure your order reaches you with the best quality."
      },
      {
        icon: "shield",
        title: isAr ? "تشفير SSL وأمان البيانات" : "SSL Encryption & Data Security",
        text: isAr
          ? "موقعنا مؤمن بشهادة SSL (Secure Sockets Layer) صالحة ومحدثة، مما يعني أن جميع البيانات التي تدخلونها مشفرة بالكامل قبل إرسالها إلى خوادمنا. نحن نضمن حماية معلوماتكم الشخصية من أي وصول غير مصرح به."
          : "Our website is secured with a valid and updated SSL (Secure Sockets Layer) certificate, meaning all data you enter is fully encrypted before being sent to our servers. We guarantee the protection of your personal information from unauthorized access."
      },
      {
        icon: "database",
        title: isAr ? "استخدام البيانات" : "Data Usage",
        text: isAr
          ? "تُستخدم بياناتكم لتحسين تجربة المستخدم، إدارة حساباتكم، والتواصل معكم بخصوص الطلبات. لا نقوم ببيع بياناتكم لأي جهة خارجية إطلاقاً."
          : "Your data is used to improve user experience, manage your accounts, and communicate with you regarding orders. We never sell your data to any third party."
      },
      {
        icon: "lock",
        title: isAr ? "أمان المدفوعات" : "Payment Security",
        text: isAr
          ? "نحن نستخدم بوابات دفع مشفرة وآمنة (مثل Lahza/PalPay). تخضع جميع عمليات الدفع لمعايير PCI-DSS. لا نقوم بتخزين تفاصيل بطاقاتكم الائتمانية في خوادمنا؛ حيث تتم جميع العمليات عبر قنوات بنكية آمنة تابعة لمزود الخدمة."
          : "We use encrypted and secure payment gateways (like Lahza/PalPay). All payments comply with PCI-DSS standards. We do not store your credit card details on our servers; all transactions are processed through secure banking channels provided by the service provider."
      },
      {
        icon: "briefcase",
        title: isAr ? "هوية المتجر" : "Merchant Identity",
        text: isAr
          ? "هذا الموقع مملوك ومدار من قبل مطاعم أبتاون (Uptown)، العنوان: فلسطين، رام الله، شارع الإرسال. نحن ملتزمون بكافة القوانين المحلية والدولية المتعلقة بحماية بيانات المستهلك."
          : "This website is owned and operated by Uptown Restaurants, Address: Palestine, Ramallah, Al-Irsal St. We are committed to all local and international laws regarding consumer data protection."
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
            {isAr ? "المستند الرسمي" : "Official Document"}
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
