"use client";

import React from "react";

export default function HeaderLeftLang({ isAr }: { isAr: boolean }) {
  const switchLang = (lang: string) => {
    document.cookie = `language=${lang};path=/`;
    window.location.reload();
  };

  return (
    <button 
      onClick={() => switchLang(isAr ? 'en' : 'ar')}
      style={{ 
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px', 
        fontWeight: 700, 
        color: '#333', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: 0
      }}>
      {isAr ? "English" : "العربية"} 
      <span style={{ fontSize: '16px' }}>{isAr ? "🇬🇧" : "🇵🇸"}</span>
    </button>
  );
}
