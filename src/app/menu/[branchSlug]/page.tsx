import Script from "next/script";
import { redirect } from "next/navigation";
import { BodyClassName } from "@/components/body-class-name";
import { getBranchBySlug, getMenuBanners, getSiteSettings, getCategories, getProducts } from "@/lib/data";
import type { Category, Product, Branch, SiteSettings, MenuBanner } from "@/lib/types";
import { cookies } from "next/headers";

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
  let branchBannerImages: string[] = [
    ...(menuBanners.filter(b => b.imagePath).map(b => b.imagePath)),
    ...(branch.bannerImagePath ? [branch.bannerImagePath] : [])
  ];

  // Fallback to two stunning images if none in DB
  if (branchBannerImages.length === 0) {
    branchBannerImages = [
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1600&auto=format&fit=crop"
    ];
  }

  // --- PROMO VIDEO ---
  const promoVideo = branch?.promoVideoUrl || "https://videos.pexels.com/video-files/3206478/3206478-uhd_2560_1440_25fps.mp4";

  return (
    <>
      <BodyClassName className="public-menu-uptown-restored" />
      <style dangerouslySetInnerHTML={{
        __html: `
        body { background: #8B0000; color: #fff; margin:0; padding:0; overflow-x:hidden; font-family: 'Tajawal', sans-serif; }
        .hero-gap { height: 100px; background: #8B0000; }
        .full-banner { width: 100%; height: 450px; position: relative; overflow: hidden; background: #222; margin-bottom: 20px; border-radius: 0 0 40px 40px; }
        .banner-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; opacity: 1; transition: opacity 1s; }
        .banner-img:not(.active) { opacity: 0; }
        .full-video { width: 100%; background: #000; aspect-ratio: 16/9; max-height: 70vh; overflow:hidden; border-bottom: 5px solid #E31E24; margin-bottom: 40px; border-radius: 40px; }
        .full-video video { width: 100%; height: 100%; object-fit: cover; display: block; }
        
        /* 🚀 STICKY FILTER: PRECISE ALIGNMENT */
        .sticky-category-bar { position: sticky; top: 80px; z-index: 1000; padding: 18px 0; background: rgba(139, 0, 0, 0.96); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .category-scroll { display: flex; gap: 12px; overflow-x: auto; padding: 0 40px; scrollbar-width: none; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-pill { background: #fff; color: #333; border: none; padding: 12px 28px; border-radius: 50px; white-space: nowrap; font-weight: 800; font-size: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .category-pill.active { background: #E31E24; color: #fff; transform: scale(1.05); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

        /* 🎨 THE RESTORED PREMIUM CARD DESIGN */
        .up-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 40px; padding: 40px; max-width: 1400px; margin: 0 auto; }
        .up-card { background: #fff; border-radius: 40px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 20px 50px rgba(0,0,0,0.3); position: relative; cursor: pointer; }
        .up-card:hover { transform: translateY(-10px); box-shadow: 0 40px 90px rgba(0,0,0,0.5); }
        
        .up-img-wrap { width: 100%; height: 260px; overflow: hidden; border-bottom: 1px solid #f0f0f0; }
        .up-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .up-card:hover .up-img { transform: scale(1.1); }
        
        .up-body { padding: 30px; text-align: center; flex-grow: 1; }
        .up-title { font-size: 1.7rem; font-weight: 900; color: #000; margin-bottom: 10px; }
        .up-desc { font-size: 14px; color: #777; line-height: 1.6; margin-bottom: 25px; height: 3.2em; overflow: hidden; font-weight: 500; }
        
        .up-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f5f5f5; padding-top: 25px; }
        .up-price-tag { font-size: 1.9rem; font-weight: 900; color: #E31E24; }
        .up-price-old { font-size: 15px; color: #bbb; text-decoration: line-through; margin-right: 8px; font-weight: 700; }
        .up-add-pill { background: #E31E24; color: #fff; border: none; padding: 14px 35px; border-radius: 25px; font-weight: 900; font-size: 1rem; cursor: pointer; transition: 0.3s; }
        .up-add-pill:hover { background: #000; transform: scale(1.05); }

        .up-fire-badge { position: absolute; top: 25px; left: 25px; background: #000; color: #FFD700; padding: 8px 18px; border-radius: 50px; font-weight: 900; font-size: 13px; z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .up-sec-title { font-size: 3.8rem; font-weight: 900; color: #fff; margin: 120px 0 60px; text-align: center; text-transform: uppercase; letter-spacing: 2px; }
      `}} />

      <div className="hero-gap" />

      {branchBannerImages.length > 0 && (
        <section className="full-banner">
          {branchBannerImages.map((src, i) => <img key={i} src={src} className={`banner-img ${i === 0 ? 'active' : ''}`} alt="" />)}
        </section>
      )}

      {promoVideo && (
        <section className="full-video">
          {promoVideo.includes("youtube") 
            ? <iframe src={`https://www.youtube.com/embed/${promoVideo.split("v=")[1] || promoVideo.split("/").pop()}?autoplay=1&mute=1&loop=1`} allowFullScreen />
            : <video src={promoVideo} autoPlay muted loop playsInline />}
        </section>
      )}

      <div className="sticky-category-bar">
        <div className="category-scroll" id="cat-pills-area">
          {categories.map(c => <button key={c.id} className="category-pill" data-id={c.id}>{isAr ? c.nameAr : c.nameEn}</button>)}
        </div>
      </div>

      <div id="uptown-render-area"></div>

      <script id="uptown-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ categories, allProducts, branch, currency, isAr }) }} />

      <Script id="uptown-core" strategy="afterInteractive">
        {`
          (() => {
            const start = () => {
              if (typeof window === 'undefined' || !window.UI || !window.Cart) return setTimeout(start, 50);
              const { categories, allProducts, branch, currency, isAr } = JSON.parse(document.getElementById("uptown-data").textContent);
              
              // 🛒 HEADER CART: ICON ONLY (FIXED)
              const cartBtn = document.getElementById("cart-btn");
              if (cartBtn) {
                 cartBtn.style.display = "flex";
                 cartBtn.className = "premium-cart-trigger";
                 const updateBadge = () => {
                   const count = window.Cart.getItems(branch.slug).length;
                   cartBtn.innerHTML = '<div class="cart-icon-wrapper" style="background:#fff;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,0.1);position:relative;border:1.5px solid #eee;cursor:pointer">' +
                     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E31E24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>' +
                     (count > 0 ? '<div id="cart-badge" style="position:absolute;top:-8px;right:-8px;background:#E31E24;color:#fff;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;border:2px solid #fff">' + count + '</div>' : '') +
                   '</div>';
                 };
                 updateBadge();
                 window.Cart.onChange(() => {
                    updateBadge();
                    cartBtn.classList.add('cart-pulse');
                    setTimeout(() => cartBtn.classList.remove('cart-pulse'), 500);
                 });
                 cartBtn.onclick = () => { window.UI.renderCartModal(branch.slug, currency); window.UI.showModal("cart-modal-overlay", "cart-modal"); };
              }

              // Render Grid
              let content = "";
              categories.forEach(cat => {
                const prods = allProducts.filter(p => p.categoryId === cat.id);
                content += '<div class="up-sec" id="up-' + cat.id + '"><h2 class="up-sec-title">' + (isAr ? cat.nameAr : cat.nameEn) + '</h2><div class="up-grid">';
                prods.forEach(p => {
                    const price = p.basePrice * (1 - (p.discount || 0) / 100);
                    content += '<div class="up-card" onclick="window.viewP(' + p.id + ')">' +
                        (p.discount > 0 ? '<div class="up-fire-badge">🔥 ' + p.discount + '%</div>' : '') +
                        '<div class="up-img-wrap"><img src="' + (p.imagePath || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop') + '" class="up-img" /></div>' +
                        '<div class="up-body"><div class="up-title">' + (isAr ? p.nameAr : p.nameEn) + '</div><div class="up-desc">' + (isAr ? p.descriptionAr : p.descriptionEn) + '</div>' +
                        '<div class="up-footer"><div class="up-price-box"><span class="up-price-tag">' + price.toFixed(0) + currency + '</span>' + (p.discount > 0 ? '<span class="up-price-old">' + p.basePrice + currency + '</span>' : '') + '</div><button class="up-add-pill">' + (isAr ? "أضف" : "Add") + '</button></div>' +
                        '</div></div>';
                });
                content += "</div></div>";
              });
              document.getElementById("uptown-render-area").innerHTML = content;

              window.viewP = async (id) => {
                const p = allProducts.find(x => x.id === id);
                let ads = []; try { ads = await (await fetch("/api/AddonsApi?productId=" + id)).json(); } catch(e){}
                if (!ads.length) {
                    ads = [{ id: 1, nameAr: "إضافات مميزة", nameEn: "Special Addons", items: [{ id: 1, nameAr: "جبنة إضافية", nameEn: "Cheese", price: 3 }, { id: 2, nameAr: "صوص خاص", nameEn: "Special Sauce", price: 0 }] }];
                }
                window.UI.renderProductModal(p, ads, branch.slug, currency, 0);
              };

              // 🎬 Hero Cycling
              let bannerIdx = 0; const banners = document.querySelectorAll(".banner-img");
              if (banners.length > 1) {
                setInterval(() => {
                    banners[bannerIdx].classList.remove("active");
                    bannerIdx = (bannerIdx + 1) % banners.length;
                    banners[bannerIdx].classList.add("active");
                }, 2000);
              } else if (banners.length === 1) {
                banners[0].classList.add("active");
              }

              // ScrollSpy & Sticky Logic
              const pills = document.querySelectorAll(".category-pill"); const secs = document.querySelectorAll(".up-sec");
              pills.forEach(p => p.onclick = () => window.scrollTo({ top: document.getElementById("up-" + p.dataset.id).offsetTop - 142, behavior: "smooth" }));
              window.onscroll = () => {
                let cur = ""; secs.forEach(s => { if (window.pageYOffset >= s.offsetTop - 220) cur = s.id.replace("up-", ""); });
                pills.forEach(p => { p.classList.toggle("active", p.dataset.id === cur); if (p.classList.contains("active")) p.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); });
              };
            };
            start();
          })();
        `}
      </Script>
    </>
  );
}
