import { BodyClassName } from "@/components/body-class-name";
import { cookies } from "next/headers";

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  const content = {
    title: isAr ? "سياسة الخصوصية" : "Privacy Policy",
    tagline: isAr ? "نحن نولى أهمية قصوى لخصوصية بياناتكم" : "We prioritize the privacy of your data",
    sections: [
      {
        icon: "eye",
        title: isAr ? "نظرة عامة" : "Overview",
        text: isAr
          ? "توضح هذه السياسة كيفية تعامل مطعم أبتون مع بياناتكم الشخصية. نحن نلتزم بحماية خصوصيتك وضمان تجربة تسوق آمنة تماماً."
          : "This policy explains how Uptown Restaurant handles your personal data. We are committed to protecting your privacy and ensuring a completely secure shopping experience."
      },
      {
        icon: "database",
        title: isAr ? "البيانات التي نجمعها" : "Data We Collect",
        text: isAr
          ? "نقوم بجمع البيانات الضرورية فقط لإتمام طلباتكم، بما في ذلك الاسم، رقم الهاتف، وعنوان التوصيل. لا نقوم بتخزين تفاصيل بطاقاتكم الائتمانية بشكل مباشر."
          : "We collect only the data necessary to complete your orders, including name, phone number, and delivery address. We do not store your credit card details directly."
      },
      {
        icon: "lock",
        title: isAr ? "كيفية حماية بياناتك" : "Data Protection",
        text: isAr
          ? "نستخدم تقنيات تشفير متطورة (SSL) لضمان سرية المعلومات. يتم الوصول إلى بياناتك فقط من قبل الموظفين المخولين لإتمام عملية التوصيل."
          : "We use advanced encryption technologies (SSL) to ensure information confidentiality. Your data is only accessed by authorized staff to complete the delivery process."
      },
      {
        icon: "share-2",
        title: isAr ? "مشاركة البيانات" : "Data Sharing",
        text: isAr
          ? "لا نقوم ببيع أو مشاركة بياناتك مع أي أطراف ثالثة لأغراض تسويقية. يتم مشاركة معلومات العنوان فقط مع فريق التوصيل الخاص بنا."
          : "We do not sell or share your data with any third parties for marketing purposes. Address information is only shared with our delivery team."
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
