import { redirect } from "next/navigation";
import { getBranchBySlug, getSiteSettings } from "@/lib/data";
import CheckoutFormWrapper from "@/components/checkout-form-wrapper";

type CheckoutPageProps = {
  params: Promise<{
    branchSlug: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { branchSlug } = await params;
  const [branch, settings] = await Promise.all([getBranchBySlug(branchSlug), getSiteSettings()]);

  if (!branch) {
    redirect("/");
  }

  return (
    <div className="ultra-checkout-shell" style={{ minHeight: '100vh', background: 'var(--luxury-cream)', paddingBottom: '100px' }}>
      <div className="checkout-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 24px' }}>
        
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, gap: 20 }}>
          <a href={`/menu/${branch.slug}`} className="ultra-action-btn" style={{ width: 'auto', padding: '0 24px', borderRadius: '12px', height: '50px', display: 'flex', alignItems: 'center', gap: '10px', background: '#000', color: '#fff' }}>
            <span style={{ fontWeight: 800 }}>الرجوع للمنيو</span>
          </a>
          <h1 className="ultra-title" style={{ margin: 0, fontSize: "2.5rem", color: '#000' }}>إتمام الطلب</h1>
        </div>

        <CheckoutFormWrapper branch={branch} settings={settings as any} lang="ar" />

      </div>
    </div>
  );
}
