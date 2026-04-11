import { redirect } from "next/navigation";
import { BodyClassName } from "@/components/body-class-name";
import { getBranchBySlug, getMenuBanners, getSiteSettings, getCategories, getProducts } from "@/lib/data";
import type { Category, Product, Branch, SiteSettings, MenuBanner } from "@/lib/types";
import { cookies } from "next/headers";
import MenuClient from "@/components/MenuClient";

type MenuPageProps = {
  params: Promise<{
    branchSlug: string;
  }>;
};

export default async function MenuPage({ params }: MenuPageProps) {
  const { branchSlug } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  let branch: Branch | null = null;
  let settings: SiteSettings | null = null;
  let menuBanners: MenuBanner[] = [];
  let categories: Category[] = [];
  let allProducts: Product[] = [];

  try {
    const responses = await Promise.all([
      getBranchBySlug(branchSlug),
      getSiteSettings(),
      getMenuBanners(),
      getCategories(branchSlug),
      getProducts(branchSlug)
    ]);
    branch = responses[0] as Branch | null;
    settings = responses[1] as SiteSettings | null;
    menuBanners = responses[2] as MenuBanner[];
    categories = responses[3] as Category[];
    allProducts = responses[4] as Product[];
  } catch (e) {
    console.error("[Menu] Failed to load data:", e);
  }

  if (!branch) {
    branch = { id: 0, slug: branchSlug, nameAr: "أبتاون", nameEn: "Uptown", discountPercent: 0, isActive: true, sortOrder: 0, deliveryFee: 0, deliveryZones: [], bannerImagePath: null, phone: "", whatsApp: "", latitude: null, longitude: null, openingTime: null, closingTime: null, createdAt: "", updatedAt: "" };
  }

  const currency = settings?.currencySymbol || "₪";

  // --- BANNER IMAGE LOGIC ---
  let branchBannerImages = [
    "/images/panar1.jpeg",
    "/images/panar2.jpeg"
  ];

  // --- PROMO VIDEO ---
  const promoVideo = "/images/video.mp4";

  return (
    <>
      <BodyClassName className="public-menu-uptown-restored" />
      <style dangerouslySetInnerHTML={{
        __html: `
        body { background: #fff; color: #000; margin:0; padding:0; overflow-x:hidden; font-family: 'Tajawal', sans-serif; }
        .hero-gap { display: none; }
        
        .hero-section { background: #8B0000; padding: 20px 0; }
        .full-banner { 
          width: calc(100% - 30px); margin: 0 auto 20px; 
          aspect-ratio: 2.5 / 1;
          position: relative; overflow: hidden; border-radius: 40px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
        }
        .banner-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; opacity: 1; transition: opacity 1s; }
        .banner-img:not(.active) { opacity: 0; }
        
        .full-video { 
          width: calc(100% - 30px); margin: 0 auto; 
          background: #000; aspect-ratio: 1 / 1; max-height: 550px; 
          position: relative; overflow: hidden; border-radius: 40px; 
          box-shadow: 0 15px 45px rgba(0,0,0,0.3);
        }
        .full-video video, .full-video iframe { width: 100%; height: 100%; object-fit: cover; display: block; }
        .full-video iframe { border: none; }

        /* 🚀 STICKY FILTER: PRECISE ALIGNMENT */
        .sticky-category-bar { 
          position: sticky; top: 90px; z-index: 1000; 
          padding: 15px 0; background: rgba(255, 255, 255, 1); border-bottom: 1px solid #f0f0f0; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .category-scroll { display: flex; gap: 10px; overflow-x: auto; padding: 0 15px; scrollbar-width: none; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-pill { 
          background: #f8f8f8; color: #333; border: 1px solid #eee; 
          padding: 10px 22px; border-radius: 50px; white-space: nowrap; 
          font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .category-pill.active { 
          background: linear-gradient(180deg, #e62b32 0, var(--primary) 100%); 
          color: #fff; border-color: transparent; font-weight: 800; 
          box-shadow: 0 6px 15px rgba(139, 0, 0, 0.3); transform: scale(1.05);
        }

        /* 🎨 THE RESTORED PREMIUM CARD DESIGN */
        .uptown-menu-container { background: #8B0000; padding: 10px 0 60px; }
        .up-sec-title { 
          display: block; font-size: 1.8rem; font-weight: 900; color: #fff; 
          text-align: center; padding: 30px 25px 10px; margin: 0;
        }
        
        .up-grid { 
          display: grid; grid-template-columns: repeat(2, 1fr); 
          gap: 15px; padding: 15px; max-width: 1400px; margin: 0 auto; 
        }
        @media (min-width: 768px) {
          .up-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        }

        .up-card { 
          background: #fff; border-radius: 30px; overflow: hidden; 
          display: flex; flex-direction: column; position: relative; 
          cursor: pointer; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        .up-card:active { transform: scale(0.96); }
        
        .up-img-wrap { width: 100%; height: 220px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: transparent; }
        .up-img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.4s; }
        .up-card:hover .up-img { transform: scale(1.05); }
        
        .up-body { padding: 20px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; }
        .up-title { font-size: 1.4rem; font-weight: 900; color: #09162A; margin: 0 0 8px 0; }
        .up-desc { color: #64748B; font-size: 11px; line-height: 1.6; font-weight: 600; margin: 0 0 15px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .up-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; }
        .up-price-box { display: flex; align-items: center; gap: 6px; }
        .up-price-tag { font-size: 1.4rem; font-weight: 900; color: #8B0000; }
        .up-price-old { font-size: 11px; color: #94a3b8; text-decoration: line-through; font-weight: 700; }
        
        .up-add-pill { 
          background: linear-gradient(135deg, #8B0000 0%, #B91C1C 100%); 
          color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 900; 
          font-size: 13px; cursor: pointer; transition: 0.3s; box-shadow: 0 6px 15px rgba(139, 0, 0, 0.4); 
        }

        .up-fire-badge { 
          position: absolute; top: 12px; left: 12px; background: #8B0000; 
          color: #fff; padding: 4px 10px; border-radius: 50px; 
          font-weight: 900; font-size: 10px; z-index: 10; 
          display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 10px rgba(139,0,0,0.3);
        }

        @media (max-width: 600px) {
          .up-grid { gap: 10px; padding: 10px; }
          .up-card { border-radius: 20px; }
          .up-img-wrap { height: 160px; }
          .up-body { padding: 12px; }
          .up-title { font-size: 1.1rem; }
          .up-price-tag { font-size: 1.2rem; }
          .up-desc { display: none; } 
          .up-add-pill { padding: 8px 14px; font-size: 11px; border-radius: 8px; }
        }

        .branch-header-name { display: block !important; }

        /* 📸 PRODUCT MODAL REFINEMENTS */
        .product-modal-image-wrap {
          width: 100%;
          height: 250px;
          background: #f8f8f8;
          border-radius: 25px;
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-modal-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .product-modal-desc {
          font-size: 14px;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 25px;
          font-weight: 500;
          text-align: center;
          padding: 0 10px;
        }

        /* 🔽 HIDE LIST ELEMENTS */
        .up-card .up-desc { display: none !important; }
      `}} />

      <div className="hero-gap" />

      <section className="hero-section">
        {branchBannerImages.length > 0 && (
          <section className="full-banner">
            {branchBannerImages.map((src, i) => <img key={i} src={src} className={`banner-img ${i === 0 ? 'active' : ''}`} alt="" />)}
          </section>
        )}

        {promoVideo && (
          <section className="full-video">
            {promoVideo.includes("youtube") || promoVideo.includes("vimeo")
              ? <iframe src={promoVideo} allowFullScreen />
              : <video src={promoVideo} autoPlay muted loop playsInline />}
          </section>
        )}
      </section>

      <div className="sticky-category-bar">
        <div className="category-scroll" id="cat-pills-area">
          {categories.map(c => <button key={c.id} className="category-pill" data-id={c.id}>{isAr ? c.nameAr : c.nameEn}</button>)}
        </div>
      </div>

      <div className="uptown-menu-container">
        <div id="uptown-render-area"></div>
      </div>

      <MenuClient 
        categories={categories} 
        allProducts={allProducts}
        branch={branch}
        isAr={isAr}
        currency={currency}
      />
    </>
  );
}