export const dynamic = "force-dynamic";

import Script from "next/script";
import { getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";
import "./globals.css";

import HeaderLeftLang from "@/components/header-left-lang";
import LayoutSwitcher from "@/components/layout-switcher";
import ModalOverlays from "@/components/modal-overlays";
import { Phone, Mail, MapPin } from "lucide-react";

import type { Metadata } from "next";



export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";
  return {
    title: isAr ? (settings?.siteNameAr || "أبتاون") : (settings?.siteName || "UPTOWN"),
    description: isAr ? (settings?.metaDescriptionAr || "أبتاون - منصة المطاعم الفاخرة") : (settings?.metaDescriptionEn || "UPTOWN - Premium Dining Platform"),
    icons: {
      icon: "/logo.jpeg",
      apple: "/logo.jpeg",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";
  const siteName = isAr ? (settings?.siteNameAr || "أبتاون") : (settings?.siteName || "UPTOWN");
  const logoUrl = settings?.logoUrl;
  const whatsapp = "970222950505";
  const phone = "022950505";
  const email = "uptownramallah@gmail.com";
  const address = isAr ? "فلسطين - رام الله" : "Palestine - Ramallah";

  const header = (
    <header className="premium-header" id="site-header" style={{ borderBottom: '1px solid #eee', background: '#fff', padding: '2px 0', position: 'sticky', top: 0, zIndex: 2000 }}>
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

        {/* Center: Logo & Branch */}
        <div className="header-center" style={{ textAlign: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src="/logo.jpeg"
              alt="Uptown Logo"
              style={{ height: '60px', width: 'auto', marginBottom: '4px' }}
            />
            <h1 style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#000',
              margin: 0,
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'none'
            }}>
              UPTOWN
            </h1>
            <p className="branch-header-name" style={{
              fontSize: '14px',
              color: '#000',
              margin: '0',
              fontWeight: 800,
              display: 'none' /* Hidden by default, shown on menu pages via CSS */
            }}>
              {/* Dynamic branch name will be handled via CSS/Scripts or Context later, 
                  but for now we provide the hook */}
            </p>
          </a>
        </div>

        <div className="header-right" id="header-cart-container" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <button id="cart-btn" className="header-icon-btn cart-btn" style={{ display: 'none' }} aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <span id="cart-badge" className="cart-badge" style={{ display: 'none' }}>0</span>
          </button>
        </div>
      </div>
    </header>
  );

  const footer = (
    <footer className="up-footer-section" style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '60px 0 30px' }}>
      <div className="up-footer-grid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
        <div className="up-footer-col">
          <div className="up-footer-brand">
            <img src="/logo.jpeg" alt={siteName} style={{ height: '70px', width: 'auto', marginBottom: '15px' }} />
          </div>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', maxWidth: '300px', fontWeight: 600 }}>
            {isAr ? "ساعات العمل:" : "Working Hours:"}<br />
            <span style={{ color: '#8b0000', fontWeight: 800 }}>{isAr ? "١٠:٠٠ صباحاً - ١٢:٠٠ منتصف الليل" : "10:00 AM - 12:00 AM"}</span>
          </p>
          <div style={{ marginTop: '20px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#000', marginBottom: '10px' }}>Uptown Ramallah</h5>
            <div className="up-social-hub" style={{ display: 'flex', gap: '15px' }}>
              <a href={settings?.facebookUptownUrl || "https://www.facebook.com/uptownramallah"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                style={{
                  color: '#8b0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff5f5',
                  transition: '0.3s',
                  border: '1px solid rgba(139, 0, 0, 0.1)'
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={settings?.instagramUptownUrl || "https://www.instagram.com/uptownramallah"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                style={{
                  color: '#8b0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff5f5',
                  transition: '0.3s',
                  border: '1px solid rgba(139, 0, 0, 0.1)'
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={settings?.tiktokUrl || "https://www.tiktok.com/@uptownps"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                style={{
                  color: '#8b0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff5f5',
                  transition: '0.3s',
                  border: '1px solid rgba(139, 0, 0, 0.1)'
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#000', marginBottom: '10px' }}>Pasta Signature</h5>
            <div className="up-social-hub" style={{ display: 'flex', gap: '15px' }}>
              <a href="https://www.facebook.com/pastasignature"
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                title="Pasta Signature - Facebook"
                style={{
                  color: '#8b0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff5f5',
                  transition: '0.3s',
                  border: '1px solid rgba(139, 0, 0, 0.1)'
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/pastasignature"
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                title="Pasta Signature - Instagram"
                style={{
                  color: '#8b0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff5f5',
                  transition: '0.3s',
                  border: '1px solid rgba(139, 0, 0, 0.1)'
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="up-footer-col">
          <h4 className="up-footer-title" style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', color: '#000' }}>{isAr ? "تواصل معنا" : "Contact Us"}</h4>
          <ul className="up-footer-contact" style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
              <Phone size={18} />
              <span style={{ fontWeight: 700 }}>{phone}</span>
            </li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
              <Mail size={18} />
              <span style={{ fontWeight: 700 }}>{email}</span>
            </li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#555' }}>
              <MapPin size={18} />
              <span style={{ fontWeight: 700 }}>{address}</span>
            </li>
          </ul>
        </div>



        {/* Payment */}
        <div className="up-footer-col">
          <h4 className="up-footer-title" style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', color: '#000' }}>{isAr ? "طرق الدفع والأمان" : "Payment & Security"}</h4>
          <div className="up-footer-payments" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <img src="/images/visa.png" alt="Visa" style={{ height: '30px', width: 'auto' }} />
              <p style={{ fontSize: '9px', marginTop: '5px', fontWeight: 700, color: '#0033a0' }}>Verified by VISA</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src="/images/Mastercard-logo.svg" alt="MasterCard" style={{ height: '35px', width: 'auto' }} />
              <p style={{ fontSize: '9px', marginTop: '5px', fontWeight: 700, color: '#eb001b' }}>Mastercard. ID Check</p>
            </div>
          </div>
        </div>
      </div >

      <div className="up-footer-bottom" style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #f5f5f5' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '25px', fontSize: '14px', fontWeight: 800 }}>
          <a href="/policies/privacy" style={{ color: '#8b0000', textDecoration: 'none' }}>{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</a>
          <a href="/policies/return" style={{ color: '#8b0000', textDecoration: 'none' }}>{isAr ? "سياسة الإرجاع" : "Refund Policy"}</a>
        </div>

        <p style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>
          © {new Date().getFullYear()} {siteName}. {isAr ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px', gap: '4px' }}>
          <a href="/Admin" style={{ color: '#000', fontWeight: 900, textDecoration: 'none', fontSize: '16px', letterSpacing: '2px' }}>
            UPTOWN
          </a>
          <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Developed by <span style={{ color: '#8b0000' }}>Menuna</span>
          </span>
        </div>
      </div>
    </footer >
  );

  return (
    <html lang={lang} dir={isAr ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
          /* 🏁 RESTORED PREMIUM UI CSS */
          .premium-header { transition: 0.3s; }
          .public-home #header-cart-container { display: none !important; }
          
          .social-footer-link:hover {
            transform: translateY(-3px);
            background: #8b0000 !important;
            color: #fff !important;
          }

          .up-footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 0.5fr; gap: 40px; }
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

        <Script src="/js/language.js?v=15" strategy="beforeInteractive" />
        <Script src="/js/cart.js?v=15" strategy="beforeInteractive" />
        <Script src="/js/ui.js?v=15" strategy="lazyOnload" />
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

              if (toggle && menu) {
                toggle.onclick = () => menu.classList.add('is-active');
              }

              if (typeof lucide !== 'undefined') {
                lucide.createIcons();
              }
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
