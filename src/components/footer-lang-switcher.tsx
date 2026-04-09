"use client";

import React from "react";

export default function FooterLangSwitcher({ isAr }: { isAr: boolean }) {
  const switchLang = (lang: string) => {
    document.cookie = `language=${lang};path=/`;
    window.location.reload();
  };

  return (
    <div className="up-footer-lang-pill">
      <button 
        className={`lang-pill-item ${isAr ? 'active' : ''}`} 
        onClick={() => switchLang('ar')}
      >
        العربية
      </button>
      <button 
        className={`lang-pill-item ${!isAr ? 'active' : ''}`} 
        onClick={() => switchLang('en')}
      >
        English
      </button>
    </div>
  );
}
