import type { Metadata } from "next";
import Script from "next/script";
import { getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";
  return {
    title: isAr ? (settings?.siteNameAr || "أبتاون") : (settings?.siteName || "UPTOWN"),
    description: isAr ? (settings?.metaDescriptionAr || "أبتاون - منصة المطاعم الفاخرة") : (settings?.metaDescriptionEn || "UPTOWN - Premium Dining Platform"),
  };
}

import HeaderLeftLang from "@/components/header-left-lang";
import LayoutSwitcher from "@/components/layout-switcher";
import FooterLangSwitcher from "@/components/footer-lang-switcher";
import ModalOverlays from "@/components/modal-overlays";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";
  const siteName = isAr ? (settings?.siteNameAr || "أبتاون") : (settings?.siteName || "UPTOWN");
  const logoUrl = settings?.logoUrl;
  const whatsapp = settings?.sitePhone || "970222951234";
  const phone = settings?.sitePhone || "+970 2 2295 1234";
  const email = settings?.siteEmail || "info@uptown.ps";
  const address = settings?.siteAddress || (isAr ? "رام الله، فلسطين" : "Ramallah, Palestine");

  const header = (
    <header className="premium-header" id="site-header" style={{ borderBottom: '1px solid #eee', background: '#fff', padding: '15px 0' }}>
      <div className="premium-header-inner" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr', 
        alignItems: 'center',
        padding: '0 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left: Lang Switcher */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
          <HeaderLeftLang isAr={isAr} />
        </div>

        {/* Center: Logo */}
        <div className="header-center" style={{ textAlign: 'center' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 900, 
              color: '#000', 
              margin: 0, 
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              UPTOWN
            </h1>
            <p style={{ fontSize: '10px', color: '#888', margin: '2px 0 0 0', fontWeight: 600 }}>
              {isAr ? "الإرسال" : "Al Irsal"}
            </p>
          </a>
        </div>

        {/* Right: Cart */}
        <div className="header-right" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button id="cart-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', position: 'relative' }}>
            <span id="cart-badge" style={{ 
              position: 'absolute', 
              top: '0', 
              right: '0', 
              background: '#cf1f28', 
              color: '#fff', 
              fontSize: '10px', 
              fontWeight: 900, 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              display: 'none', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(207,31,40,0.3)'
            }}>0</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );

  const footer = (
    <footer className="up-footer-section">
      <div className="up-footer-grid">
        <div className="up-footer-col">
          <div className="up-footer-brand">
            <span className="up-footer-logo">{siteName}</span>
            <p className="up-footer-tagline">{isAr ? "بساطة وهدوء في كل وجبة" : "Simple & Calm in every meal"}</p>
          </div>
          <div className="up-footer-socials">
            <a href={settings?.instagramUptownUrl || "https://www.instagram.com/uptownramallah"} target="_blank" className="up-social-link" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href={settings?.facebookUptownUrl || "https://www.facebook.com/uptownramallah"} target="_blank" className="up-social-link" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href={settings?.tiktokUrl || "https://www.tiktok.com/@uptownps"} target="_blank" className="up-social-link" title="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
            <a href={`https://wa.me/${whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" className="up-social-link" title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
            </a>
          </div>
        </div>

        <div className="up-footer-col">
          <h4 className="up-footer-title">{isAr ? "روابط سريعة" : "Quick Links"}</h4>
          <ul className="up-footer-links">
            <li><a href="/">{isAr ? "الرئيسية" : "Home"}</a></li>
            <li><a href="/Admin" className="admin-link">{isAr ? "لوحة التحكم" : "Admin Panel"}</a></li>
          </ul>
        </div>

        <div className="up-footer-col">
          <h4 className="up-footer-title">{isAr ? "تواصل معنا" : "Contact Us"}</h4>
          <ul className="up-footer-contact">
            <li>
                <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{phone}</span>
                </div>
            </li>
            <li>
                <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{email}</span>
                </div>
            </li>
            <li>
                <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{address}</span>
                </div>
            </li>
          </ul>
        </div>

        <div className="up-footer-col">
          <h4 className="up-footer-title">{isAr ? "اللغة والدفع" : "Language & Payment"}</h4>
          <FooterLangSwitcher isAr={isAr} />
          <div className="up-footer-payments">
             <div className="up-payment-badge" title="Visa/MasterCard">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
             </div>
             <div className="up-payment-badge" title="Cash">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
             </div>
          </div>
        </div>
      </div>
      <div className="up-footer-bottom">
        <p>© {new Date().getFullYear()} {siteName}. {isAr ? "جميع الحقوق محفوظة." : "All Rights Reserved."}</p>
      </div>
    </footer>
  );

  return (
    <html lang={lang} dir={isAr ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <Script src="https://unpkg.com/lucide@latest" strategy="beforeInteractive" />
        <style dangerouslySetInnerHTML={{
          __html: `
          /* 🏁 RESTORED PREMIUM UI CSS */
          .up-footer-section { background: #fff; border-top: 1px solid #f0f0f0; padding: 80px 40px; color: #1a1a1a; font-family: 'Tajawal', sans-serif; }
          .up-footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; max-width: 1400px; margin: 0 auto; }
          .up-footer-col h4 { font-weight: 900; font-size: 1.1rem; margin-bottom: 25px; color: #000; text-transform: uppercase; }
          .up-footer-links { list-style: none; padding: 0; margin: 0; }
          .up-footer-links li { margin-bottom: 12px; }
          .up-footer-links a { color: #555; text-decoration: none; font-size: 15px; transition: 0.3s; font-weight: 500; }
          .up-footer-links a:hover { color: #E31E24; padding-inline-start: 5px; }
          .up-footer-brand .up-footer-logo { font-size: 2.2rem; font-weight: 900; color: #E31E24; display: block; margin-bottom: 15px; letter-spacing: -1px; }
          .up-footer-tagline { color: #888; line-height: 1.6; font-size: 14px; margin-bottom: 25px; }
          .up-footer-bottom { border-top: 1px solid #f5f5f5; margin-top: 60px; padding-top: 30px; text-align: center; color: #aaa; font-size: 13px; }
          
          .up-footer-socials { display: flex; gap: 15px; }
          .up-social-link { width: 40px; height: 40px; background: #f0f0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #333 !important; transition: 0.3s; }
          .up-social-link:hover { background: #E31E24; color: #fff !important; transform: translateY(-3px); }
          .up-social-link i { width: 18px; height: 18px; }

          .up-footer-payments { display: flex; gap: 10px; margin-top: 20px; align-items: center; }
          .up-payment-badge { padding: 8px 12px; background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666; transition: 0.3s; }
          .up-payment-badge:hover { background: #000; color: #fff; border-color: #000; transform: translateY(-2px); }

          .up-footer-contact { list-style: none; padding: 0; margin: 0; }
          .up-footer-contact li { margin-bottom: 18px; }
          .contact-item { display: flex; align-items: center; gap: 12px; color: #555; font-size: 14px; font-weight: 500; }
          .contact-item svg { color: #E31E24; }

          .up-footer-lang-pill { background: #f0f0f0; border-radius: 50px; padding: 4px; display: inline-flex; gap: 4px; margin-top: 10px; }
          .lang-pill-item { border: none; background: transparent; padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.3s; color: #666; }
          .lang-pill-item.active { background: #fff; color: #E31E24; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .lang-pill-item:hover:not(.active) { color: #000; }

          .admin-link { color: #E31E24 !important; font-weight: 900 !important; }

          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(15px); z-index: 9999; display: none; cursor: pointer; transition: opacity 0.4s ease; }
          .modal-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 95%; max-width: 600px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(25px); border-radius: 35px; z-index: 10000; display: none; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 50px 100px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.4); }
          .side-panel { left: auto; right: 0; transform: translate(100%, -50%); height: 100vh; top: 50%; max-width: 450px; border-radius: 40px 0 0 40px; transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
          .side-panel.is-active { transform: translate(0, -50%); }

          .premium-mobile-overlay { position: fixed; inset: 0; background: #fff; z-index: 2000; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateY(-100%); transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .premium-mobile-overlay.is-active { transform: translateY(0); }

          @media (max-width: 992px) { .up-footer-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 576px) { .up-footer-grid { grid-template-columns: 1fr; } }
        `}} />
      </head>
      <body suppressHydrationWarning>
        <div className="ultra-app-container">
          <LayoutSwitcher header={header} footer={footer}>
            <div className="ultra-main">
              {children}
            </div>
          </LayoutSwitcher>
        </div>

        <Script src="/js/language.js" strategy="beforeInteractive" />
        <Script src="/js/cart.js" strategy="beforeInteractive" />
        <Script src="/js/ui.js" strategy="afterInteractive" />
        <Script id="layout-core-logic" strategy="afterInteractive">
          {`
            (() => {
              const header = document.getElementById('site-header');
              if (header) {
                window.addEventListener('scroll', () => {
                  header.classList.toggle('is-scrolled', window.scrollY > 50);
                });
              }
              const toggle = document.getElementById('mobile-menu-toggle');
              const menu = document.getElementById('ultra-mobile-menu');
              if (toggle && menu) toggle.onclick = () => menu.classList.add('is-active');
              
              if (typeof lucide !== 'undefined') lucide.createIcons();
            })();
          `}
        </Script>
        <ModalOverlays />
        <div id="cart-modal" className="modal-panel side-panel"></div>
        <div id="product-modal" className="modal-panel side-panel"></div>
      </body>
    </html>
  );
}
