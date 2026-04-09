"use client";

import React from "react";

export default function HeaderLangSwitcher({ isAr }: { isAr: boolean }) {
  const switchLang = (lang: string) => {
    document.cookie = `language=${lang};path=/`;
    window.location.reload();
  };

  return (
    <div className="header-lang-switcher">
      <button 
        className={`header-lang-btn ${isAr ? 'active' : ''}`} 
        onClick={() => switchLang('ar')}
      >
        AR
      </button>
      <span className="lang-divider"></span>
      <button 
        className={`header-lang-btn ${!isAr ? 'active' : ''}`} 
        onClick={() => switchLang('en')}
      >
        EN
      </button>
    </div>
  );
}
