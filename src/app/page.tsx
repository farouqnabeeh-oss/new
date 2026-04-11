import { getActiveBranches, getActiveBanners } from "@/lib/data";
import { BodyClassName } from "@/components/body-class-name";
import { LocationInitializer } from "@/components/location-initializer";
import { BranchGrid } from "@/components/branch-grid";
import { ContinueOrdering } from "@/components/continue-ordering";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  const [branches, banners] = await Promise.all([
    getActiveBranches(),
    getActiveBanners()
  ]);

  const t = {
    destinations: isAr ? "اختر وجهتك" : "Our Destinations",
    welcome: isAr ? "نصنع السعادة في كل لقمة" : "Crafting Happiness in Every Bite",
    tagline: isAr ? "اكتشف الفخامة والمذاق الأصيل في كل فرع من فروعنا." : "Discover luxury and authentic taste in every branch.",
  };

  // Fallback banners if none in DB
  const displayBanners = banners.length > 0 ? banners : [
    { imagePath: "/images/panar1.jpeg" },
    { imagePath: "/images/panar2.jpeg" }
  ];

  return (
    <div className="premium-home-shell">
      <BodyClassName className="public-home" />
      <LocationInitializer branches={branches} lang={lang} />

      {/* 🌟 BRANCHES SECTION (Main Focus) */}
      <section id="branches" className="premium-section" style={{ padding: '0 20px 20px', maxWidth: '1400px', margin: '0 auto' }}>

        <div className="premium-section-header" style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 className="premium-title" style={{
            fontSize: 'max(1.8rem, 3.5vw)',
            color: '#0a1d37',
            fontWeight: 900,
            marginBottom: '5px'
          }}>
            {isAr ? "مرحباً بكم في UPTOWN" : "Welcome to UPTOWN"}
          </h1>
          <p style={{ color: '#888', fontSize: '1rem', fontWeight: 600 }}>
            {isAr ? "اختر الفرع" : "Choose the branch"}
          </p>
        </div>

        <BranchGrid branches={branches} lang={lang} />
      </section>
    </div>
  );
}
