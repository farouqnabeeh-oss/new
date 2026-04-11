"use client";

import { useEffect, useCallback } from "react";
import type { Category, Product, Branch } from "@/lib/types";

declare global {
  interface Window {
    UI: any;
    Cart: any;
    viewP: (id: string | number) => void;
  }
}

interface Props {
  categories: Category[];
  allProducts: Product[];
  branch: Branch;
  isAr: boolean;
  currency: string;
}

export default function MenuClient({ categories, allProducts, branch, isAr, currency }: Props) {
  
  const updateBadge = useCallback(() => {
    if (!window.UI || !window.Cart) return;
    window.UI.updateCartBadge(branch.slug);
  }, [branch.slug]);

  useEffect(() => {
    const start = () => {
      if (typeof window === 'undefined' || !window.UI || !window.Cart) {
        return setTimeout(start, 100);
      }

      // 1. Update Branch Header
      const branchNameElem = document.querySelector(".branch-header-name");
      if (branchNameElem) branchNameElem.textContent = isAr ? branch.nameAr : branch.nameEn;

      // 2. Setup Badge
      updateBadge();
      window.Cart.onChange(updateBadge);

      // 3. Render Product Grid
      let content = "";
      categories.forEach(cat => {
        const prods = allProducts.filter(p => String(p.categoryId) === String(cat.id));
        if (prods.length === 0) return;

        content += `<div class="up-sec" id="up-${cat.id}">
          <h2 class="up-sec-title">${isAr ? cat.nameAr : cat.nameEn}</h2>
          <div class="up-grid">`;
        
        prods.forEach(p => {
          const priceRaw = Number(p.basePrice || 0);
          const disc = Number(p.discount || 0);
          const finalPrice = priceRaw * (1 - disc / 100);
          const image = p.imagePath || '/images/classic-cheeseburger__0x1e3y1qv68eiip.jpg';
          
          content += `
            <div class="up-card" data-pid="${p.id}" onclick="window.viewP('${p.id}')">
              ${disc > 0 ? `<div class="up-fire-badge">🔥 -${disc}%</div>` : ''}
              <div class="up-img-wrap"><img src="${image}" class="up-img" loading="lazy" /></div>
              <div class="up-body">
                <div class="up-title">${isAr ? p.nameAr : p.nameEn}</div>
                <div class="up-footer">
                  <div class="up-price-box">
                    <span class="up-price-tag">${finalPrice.toFixed(0)}${currency}</span>
                    ${disc > 0 ? `<span class="up-price-old">${priceRaw.toFixed(0)}${currency}</span>` : ''}
                  </div>
                  <button class="up-add-pill">${isAr ? "أضف للسلة" : "Add to Cart"}</button>
                </div>
              </div>
            </div>`;
        });
        content += "</div></div>";
      });

      const renderArea = document.getElementById("uptown-render-area");
      if (renderArea) renderArea.innerHTML = content;

      // 4. Global viewP handler
      window.viewP = async (id: string | number) => {
        const card = document.querySelector(`[data-pid="${id}"]`);
        const btn = card?.querySelector('.up-add-pill');
        const originalText = btn ? btn.textContent : '';
        
        try {
          if (btn) btn.textContent = isAr ? 'جاري التحميل...' : 'Loading...';
          
          const res = await fetch(`/api/ProductsApi/${id}`);
          if (!res.ok) throw new Error("Product data fetch failed");
          
          const fullProduct = await res.json();
          window.UI.renderProductModal(fullProduct, fullProduct.addonGroups || [], branch.slug, currency, 0);
        } catch (e) {
          console.error(`[Product Modal] API Error for Product #${id}:`, e);
          const p = allProducts.find(x => String(x.id) === String(id));
          if (p) window.UI.renderProductModal(p, [], branch.slug, currency, 0);
        } finally {
          if (btn) btn.textContent = originalText;
        }
      };

      // 5. Hero Cycling
      let bannerIdx = 0;
      const banners = document.querySelectorAll(".banner-img");
      let bannerInterval: any;
      if (banners.length > 1) {
        bannerInterval = setInterval(() => {
          banners[bannerIdx].classList.remove("active");
          bannerIdx = (bannerIdx + 1) % banners.length;
          banners[bannerIdx].classList.add("active");
        }, 4000);
      }

      // 6. ScrollSpy & Pills
      const pills = document.querySelectorAll(".category-pill");
      pills.forEach((p: any) => {
        p.onclick = () => {
          const sec = document.getElementById("up-" + p.dataset.id);
          if (sec) window.scrollTo({ top: sec.offsetTop - 130, behavior: "smooth" });
        };
      });

      const scrollContainer = document.querySelector(".category-scroll") as HTMLElement;
      let isManualScroll = false;
      let lastActiveId = "";

      const handleScroll = () => {
        if (isManualScroll) return;
        
        const secs = document.querySelectorAll(".up-sec");
        let cur = "";
        const threshold = window.innerHeight * 0.3; // Detect section when it's 30% from the top

        secs.forEach((s: any) => {
          const rect = s.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom > 180) {
            cur = s.id.replace("up-", "");
          }
        });

        if (!cur && secs.length > 0) {
           // Fallback if top of page
           if (window.pageYOffset < 300) cur = (secs[0] as HTMLElement).id.replace("up-", "");
        }

        if (cur && cur !== lastActiveId) {
          lastActiveId = cur;
          pills.forEach((p: any) => {
            const active = p.dataset.id === cur;
            p.classList.toggle("active", active);
            if (active && scrollContainer) {
              // Center the active pill smoothly without scrollIntoView's jerky behavior
              const containerWidth = scrollContainer.offsetWidth;
              const pillOffset = p.offsetLeft;
              const pillWidth = p.offsetWidth;
              const targetScroll = pillOffset - (containerWidth / 2) + (pillWidth / 2);
              
              scrollContainer.scrollTo({
                left: targetScroll,
                behavior: "smooth"
              });
            }
          });
        }
      };

      // Disable ScrollSpy updates while user clicks a pill to prevent "fighting"
      pills.forEach((p: any) => {
        const originalOnClick = p.onclick;
        p.onclick = () => {
          isManualScroll = true;
          if (originalOnClick) originalOnClick();
          
          pills.forEach((pill: any) => pill.classList.toggle("active", pill === p));
          lastActiveId = p.dataset.id;
          
          // Re-enable scroll spy after smooth scroll finishes
          setTimeout(() => { isManualScroll = false; }, 800);
        };
      });

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.Cart.offChange(updateBadge);
        window.removeEventListener("scroll", handleScroll);
        if (bannerInterval) clearInterval(bannerInterval);
      };
    };

    const cleanup = start();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [categories, allProducts, branch, isAr, currency, updateBadge]);

  return null;
}
