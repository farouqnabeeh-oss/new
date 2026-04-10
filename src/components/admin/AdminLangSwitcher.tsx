"use client";

import { useRouter } from "next/navigation";

interface AdminLangSwitcherProps {
  currentLang: string;
}

export function AdminLangSwitcher({ currentLang }: AdminLangSwitcherProps) {
  const router = useRouter();
  const isAr = currentLang === "ar";

  const handleToggle = (lang: string) => {
    document.cookie = `language=${lang};path=/;max-age=31536000`; // 1 year
    window.location.reload();
  };

  return (
    <div className="admin-lang-toggle" style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '6px',
      display: 'flex',
      gap: '6px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      position: 'relative'
    }}>
      <button 
        onClick={() => handleToggle('ar')}
        style={{
          padding: '10px 24px',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 800,
          transition: 'all 0.3s cubic-[0.23,1,0.32,1]',
          background: isAr ? '#E31E24' : 'transparent',
          color: isAr ? '#fff' : '#444',
          boxShadow: isAr ? '0 8px 16px rgba(227,30,36,0.25)' : 'none',
          fontFamily: "'Tajawal', sans-serif"
        }}
      >
        العربية
      </button>
      <button 
        onClick={() => handleToggle('en')}
        style={{
          padding: '10px 24px',
          border: 'none',
          borderRadius: '14px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 800,
          transition: 'all 0.3s cubic-[0.23,1,0.32,1]',
          background: !isAr ? '#E31E24' : 'transparent',
          color: !isAr ? '#fff' : '#444',
          boxShadow: !isAr ? '0 8px 16px rgba(227,30,36,0.25)' : 'none'
        }}
      >
        ENG
      </button>
    </div>
  );
}
