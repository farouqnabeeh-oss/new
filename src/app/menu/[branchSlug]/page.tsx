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
        
        .full-banner { 
          width: calc(100% - 30px); margin: 15px auto; height: 160px; 
          position: relative; overflow: hidden; border-radius: 30px; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.08); 
        }
        .banner-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; opacity: 1; transition: opacity 1s; }
        .banner-img:not(.active) { opacity: 0; }
        
        .full-video { 
          width: calc(100% - 30px); margin: 0 auto 20px; 
          background: #000; aspect-ratio: 1/1; max-height: 450px; 
          position: relative; overflow: hidden; border-radius: 40px; 
          box-shadow: 0 15px 45px rgba(0,0,0,0.15);
        }
        .full-video video, .full-video iframe { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* 🚀 STICKY FILTER: PRECISE ALIGNMENT */
        .sticky-category-bar { 
          position: sticky; top: 78px; z-index: 1000; 
          padding: 12px 0; background: #fff; border-bottom: 1px solid #f0f0f0; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .category-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 0 12px; scrollbar-width: none; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .category-pill { 
          background: #f8f8f8; color: #444; border: 1px solid #eee; 
          padding: 8px 20px; border-radius: 50px; white-space: nowrap; 
          font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; 
        }
        .category-pill.active { 
          background: linear-gradient(135deg, #8B0000 0%, #B91C1C 100%); 
          color: #fff; border-color: transparent; font-weight: 800; 
          box-shadow: 0 5px 12px rgba(139, 0, 0, 0.25); transform: scale(1.03);
        }

        /* 🎨 THE RESTORED PREMIUM CARD DESIGN */
        .uptown-menu-container { background: #8B0000; padding: 10px 0 60px; }
        .up-sec-title { 
          display: block; font-size: 1.6rem; font-weight: 900; color: #fff; 
          text-align: right; padding: 25px 20px 5px; margin: 0;
        }
        
        .up-grid { 
          display: grid; grid-template-columns: repeat(2, 1fr); 
          gap: 12px; padding: 12px; max-width: 1400px; margin: 0 auto; 
        }
        @media (min-width: 768px) {
          .up-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .up-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .up-card { 
          background: #fff; border-radius: 25px; overflow: hidden; 
          display: flex; flex-direction: column; position: relative; 
          cursor: pointer; transition: transform 0.2s ease; 
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }
        .up-card:active { transform: scale(0.97); }
        
        .up-img-wrap { width: 100%; aspect-ratio: 1/1; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #fff; }
        .up-img { width: 85%; height: 85%; object-fit: contain; mix-blend-mode: multiply; }
        
        .up-body { padding: 10px; text-align: center; flex-grow: 1; display: flex; flex-direction: column; gap: 2px; }
        .up-title { font-size: 13px; font-weight: 900; color: #000; margin: 0; line-height: 1.3; }
        .up-desc { color: #888; font-size: 9px; line-height: 1.4; font-weight: 600; margin: 0 0 5px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.8em; }
        
        .up-footer { margin-top: auto; padding-top: 5px; }
        .up-price-tag { font-size: 14px; font-weight: 900; color: #8B0000; display: block; margin-bottom: 5px; }
        
        .up-add-pill { 
          background: linear-gradient(135deg, #8B0000 0%, #B91C1C 100%); 
          color: #fff; border: none; width: 100%; padding: 8px; 
          border-radius: 12px; font-weight: 900; font-size: 11px; 
          cursor: pointer; transition: 0.2s; 
        }

        .up-fire-badge { 
          position: absolute; top: 10px; right: 10px; background: #E31E24; 
          color: #fff; padding: 3px 8px; border-radius: 10px; 
          font-weight: 900; font-size: 9px; z-index: 10; 
        }
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

      <div className="uptown-menu-container">
        <div id="uptown-render-area"></div>
      </div>

      <script id="uptown-data" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ categories, allProducts, branch, currency, isAr }) }} />

      <Script id="uptown-core" strategy="afterInteractive">
        {`
          (() => {
            const start = () => {
              if (typeof window === 'undefined' || !window.UI || !window.Cart) return setTimeout(start, 50);
              const { categories, allProducts, branch, currency, isAr } = JSON.parse(document.getElementById("uptown-data").textContent);
              
              const updateBadge = () => {
                const count = window.Cart.getItems(branch.slug).length;
                const cartBtn = document.getElementById("cart-btn");
                if (cartBtn) {
                   cartBtn.style.display = "flex";
                   cartBtn.innerHTML = '<div class="cart-icon-wrapper" style="display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer">' +
                      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>' +
                      (count > 0 ? '<div style="position:absolute;top:-5px;right:-5px;background:#8B0000;color:#fff;min-width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;box-shadow:0 4px-10px rgba(0,0,0,0.2)">' + count + '</div>' : '') +
                    '</div>';
                   cartBtn.onclick = () => { window.UI.renderCartModal(branch.slug, currency); window.UI.showModal("cart-modal-overlay", "cart-modal"); };
                }
              };

              updateBadge();
              window.Cart.onChange(updateBadge);

              let content = "";
              categories.forEach(cat => {
                const prods = allProducts.filter(p => p.categoryId === cat.id);
                if (prods.length === 0) return;

                content += '<div class="up-sec" id="up-' + cat.id + '">' +
                  '<h2 class="up-sec-title">' + (isAr ? cat.nameAr : cat.nameEn) + '</h2><div class="up-grid">';
                prods.forEach(p => {
                    const price = Number(p.basePrice || 0) * (1 - (p.discount || 0) / 100);
                    content += '<div class="up-card" onclick="window.viewP(' + p.id + ')">' +
                        (p.discount > 0 ? '<div class="up-fire-badge">-' + p.discount + '%</div>' : '') +
                        '<div class="up-img-wrap"><img src="' + (p.image_path || p.imagePath || '/images/classic-cheeseburger__0x1e3y1qv68eiip.jpg') + '" class="up-img" /></div>' +
                        '<div class="up-body"><div class="up-title">' + (isAr ? p.nameAr : p.nameEn) + '</div><div class="up-desc">' + (p.descriptionAr || p.descriptionEn || '') + '</div>' +
                        '<div class="up-footer"><span class="up-price-tag">' + price.toFixed(0) + currency + '</span><button class="up-add-pill">' + (isAr ? "أضف للسلة" : "Add to Cart") + '</button></div>' +
                        '</div></div>';
                });
                content += "</div></div>";
              });
              document.getElementById("uptown-render-area").innerHTML = content;

              window.viewP = async (id) => {
                const p = allProducts.find(x => x.id === id);
                let ads = []; try { ads = await (await fetch("/api/AddonsApi?productId=" + id)).json(); } catch(e){}
                if (!ads.length) {
                    ads = [{ id: 1, nameAr: "إضافات", nameEn: "Addons", items: [{ id: 1, nameAr: "جبنة إضافية", nameEn: "Cheese", price: 3 }, { id: 2, nameAr: "صوص خاص", nameEn: "Special Sauce", price: 0 }] }];
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
                }, 3000);
              }

              // Throttled ScrollSpy
              const pills = document.querySelectorAll(".category-pill"); const secs = document.querySelectorAll(".up-sec");
              let isScrolling = false;
              pills.forEach(p => p.onclick = () => { 
                isScrolling = true;
                window.scrollTo({ top: document.getElementById("up-" + p.dataset.id).offsetTop - 130, behavior: "smooth" });
                setTimeout(() => isScrolling = false, 800);
              });

              window.addEventListener("scroll", () => {
                if (isScrolling) return;
                let cur = "";
                secs.forEach(s => { if (window.pageYOffset >= s.offsetTop - 180) cur = s.id.replace("up-", ""); });
                pills.forEach(p => { 
                  const active = p.dataset.id === cur;
                  p.classList.toggle("active", active);
                  if (active) p.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                });
              }, { passive: true });
            };
            start();
          })();
        `}
      </Script>
    </>
  );
}
