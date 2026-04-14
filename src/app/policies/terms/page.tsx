import { BodyClassName } from "@/components/body-class-name";
import { cookies } from "next/headers";

export default async function TermsPolicyPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  const content = {
    title: isAr ? "سياسات التشغيل والطلبات" : "Operational & Order Policies",
    tagline: isAr
      ? "التزامنا بالجودة يبدأ من الشفافية الكاملة مع عملائنا"
      : "Our commitment to quality starts with full transparency with our customers",
    sections: [
      {
        icon: "utensils",
        title: isAr ? "نظام الوجبة المجانية" : "Free Meal System",
        text: isAr
          ? "لا يمكن اختيار أكثر من وجبة ضمن مشروع الوجبة المجانية (مثل: كوكاكولا + ساندويش + بطاطا...). يتم اختيار وجبة واحدة فقط بعد تحديد الوجبة الأساسية. كما يُسمح بإضافة طلب جانبي مجاني واحد فقط ضمن العرض."
          : "You cannot select more than one meal within the free meal project (e.g., Coca-Cola + Sandwich + Fries...). Only one meal is selected after choosing the main meal. Only one free side order is allowed per offer."
      },
      {
        icon: "shopping-cart",
        title: isAr ? "قواعد الطلب" : "Order Rules",
        text: isAr
          ? "لا يُسمح بإضافة أكثر من منتج من نفس الفئة ضمن نفس الطلب (مثل: أكثر من برغر أو أكثر من مشروب). يُمنع تنفيذ الطلب في حال عدم توفر أحد مكوناته الأساسية (مثل: عدم توفر الخبز أو أي عنصر رئيسي). يجب تنبيه الزبون في حال كان الطلب 'حار' أو يحتاج وقت تجهيز إضافي."
          : "Adding more than one product from the same category within the same order is not allowed (e.g., more than one burger or more than one drink). Orders cannot be fulfilled if any essential component is unavailable (e.g., bread or any main ingredient). Customers must be notified if the order is 'spicy' or requires extra preparation time."
      },
      {
        icon: "user-check",
        title: isAr ? "بيانات العميل الإلزامية" : "Mandatory Customer Data",
        text: isAr
          ? "يجب إدخال بيانات العميل بشكل كامل ودقيق قبل إتمام الطلب، وتشمل: الاسم الكامل، رقم الهاتف، البريد الإلكتروني، وتاريخ الميلاد (إن لزم). سيتم رفض الطلب في حال إدخال رقم هاتف خاطئ أو ناقص، أو استخدام اسم غير صحيح أو وهمي. لا يمكن تنفيذ الطلب بدون إدخال جميع البيانات المطلوبة."
          : "Complete and accurate customer data must be entered before completing the order, including: full name, phone number, email, and date of birth (if required). The order will be rejected if an incorrect or incomplete phone number is entered, or if a fake or incorrect name is used. Orders cannot be processed without all required fields being filled."
      },
      {
        icon: "image",
        title: isAr ? "سياسة رفع الصور" : "Image Upload Policy",
        text: isAr
          ? "يجب رفع صورة البطاقة/الباستا بشكل واضح وكامل. الحد الأقصى لعدد الصور: 30 صورة. يجب أن تكون الصور كاملة وواضحة وغير مقصوصة. عند تجاوز عدد الصور الحد المسموح (30 صورة)، يجب وجود سبب واضح ومُبرر (مثل: حجم الطلب الكبير)."
          : "The card/pasta image must be uploaded clearly and completely. Maximum number of images: 30. Images must be complete, clear, and not cropped. If the image count exceeds the allowed limit (30 images), a clear and justified reason must be provided (e.g., large order size)."
      },
      {
        icon: "thermometer",
        title: isAr ? "تحديد درجة الحرارة" : "Temperature Specification",
        text: isAr
          ? "لا يُسمح باختيار درجة حرارة غير محددة. يجب تحديد درجة الحرارة بوضوح لكل طلب من الخيارات التالية: حار / عادي / بارد / شديد الحرارة. أي طلب غير محدد درجة حرارته سيتم إيقافه حتى التوضيح."
          : "Selecting an unspecified temperature is not allowed. Temperature must be clearly specified for each order from the following options: Hot / Normal / Cold / Very Hot. Any order with an unspecified temperature will be held until clarified."
      },
      {
        icon: "store",
        title: isAr ? "طرق الاستلام والتوصيل" : "Pickup & Delivery Methods",
        text: isAr
          ? "تم إلغاء نظام أرقام الطاولات. يقتصر الاستلام على: الاستلام داخل المطعم فقط. يجب مراجعة أسعار التوصيل بشكل دوري والتأكد من دقتها قبل عرضها على العملاء."
          : "The table number system has been discontinued. Pickup is limited to: in-restaurant pickup only. Delivery prices must be reviewed periodically and verified for accuracy before being displayed to customers."
      },
      {
        icon: "clock-3",
        title: isAr ? "إدارة الطلبات وأوقات التجهيز" : "Order Management & Preparation Times",
        text: isAr
          ? "يجب عدم ترك الطلب في حالة 'انتظار' بعد وصوله للنظام. يجب تأكيده أو رفضه مباشرة من قبل الموظف المختص. يجب تحديد وقت تجهيز الطلب بشكل واضح لكل طلب دون استثناء."
          : "Orders must not be left in a 'pending' state after arriving in the system. They must be confirmed or rejected immediately by the responsible staff member. The preparation time must be clearly specified for each and every order without exception."
      },
      {
        icon: "file-text",
        title: isAr ? "ملاحظات الطلبات" : "Order Notes",
        text: isAr
          ? "لا يُسمح بإضافة ملاحظات عشوائية أو غير منظمة داخل النظام. يجب أن تكون أي ملاحظة مرتبطة مباشرة بالطلب وواضحة وقابلة للتنفيذ. الملاحظات العشوائية أو غير الرسمية ستُحذف ولن تُؤخذ بعين الاعتبار."
          : "Adding random or unorganized notes inside the system is not allowed. Any note must be directly related to the order, clear, and actionable. Random or informal notes will be deleted and will not be considered."
      }
    ],
    footer: isAr ? "آخر تحديث: أبريل 2026" : "Last Updated: April 2026"
  };

  return (
    <div
      className="policy-premium-wrapper"
      style={{
        background: "#fff",
        color: "#000",
        minHeight: "100vh",
        fontFamily: "var(--font-outfit)",
      }}
    >
      <BodyClassName className="premium-policy" />

      {/* 📄 MINIMALIST HEADER */}
      <section
        style={{
          padding: "160px 24px 80px",
          textAlign: "center",
          background: "#fafafa",
          borderBottom: "1px solid #eee",
        }}
      >
        <div className="animate-fade-down">
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              fontSize: "12px",
              fontWeight: 900,
              color: "#999",
              display: "block",
              marginBottom: "15px",
            }}
          >
            {isAr ? "سياسات المطعم الرسمية" : "Official Restaurant Policies"}
          </span>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontFamily: "var(--font-playfair)",
              fontWeight: 900,
              marginBottom: "20px",
            }}
          >
            {content.title}
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {content.tagline}
          </p>
        </div>
      </section>

      {/* 🖋️ CONTENT SECTION */}
      <section style={{ padding: "100px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "80px" }}>
          {content.sections.map((section, idx) => (
            <div
              key={idx}
              className="animate-fade-up"
              style={{
                display: "flex",
                gap: "30px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "#000",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <i data-lucide={section.icon} style={{ width: "28px" }} />
              </div>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 900,
                    marginBottom: "20px",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    fontSize: "1.2rem",
                    lineHeight: 1.9,
                    color: "#444",
                    textAlign: "justify",
                  }}
                >
                  {section.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "120px",
            padding: "40px",
            borderTop: "1px solid #eee",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#aaa", fontSize: "14px" }}>{content.footer}</p>
          <p
            style={{
               color: "#000",
               fontWeight: 900,
               fontSize: "15px",
               marginTop: "10px",
            }}
          >
            Uptown &amp; Pasta Signature
          </p>
        </div>
      </section>
    </div>
  );
}
