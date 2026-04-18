export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getBranchBySlug, getSiteSettings } from "@/lib/data";
import CheckoutFormWrapper from "@/components/checkout-form-wrapper";
import { cookies } from "next/headers";

type CheckoutPageProps = {
  params: Promise<{
    branchSlug: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { branchSlug } = await params;

  const cookieStore = await cookies();
  // استخراج اللغة من الكوكيز أو اعتماد 'ar' كقيمة افتراضية
  const lang = cookieStore.get("language")?.value || "ar";

  const [branch, settings] = await Promise.all([
    getBranchBySlug(branchSlug),
    getSiteSettings()
  ]);

  if (!branch) {
    redirect("/");
  }

  return (
    <div className="ultra-checkout-shell" style={{ minHeight: '100vh', background: 'var(--luxury-cream)' }}>
      <style>{`
        .checkout-page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 5px 24px 100px;
        }
        @media (max-width: 768px) {
          .checkout-page-container {
            padding: 20px 15px 50px;
          }
        }
      `}</style>
      <div className="checkout-page-container">
        {/* التعديل هنا: مرر متغير lang بدلاً من القيمة الثابتة "ar" */}
        <CheckoutFormWrapper branch={branch} settings={settings as any} lang={lang} />
      </div>
    </div>
  );
}