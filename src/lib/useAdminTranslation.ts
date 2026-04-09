"use client";

import { adminTranslations, AdminLang } from "./admin-translations";

export function getAdminLang(): AdminLang {
  if (typeof document === "undefined") return "ar";
  const match = document.cookie.match(/language=(ar|en)/);
  return (match ? match[1] : "ar") as AdminLang;
}

export function useAdminTranslation() {
  const lang = getAdminLang();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = adminTranslations[lang];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Fallback to key name if not found
      }
    }
    
    return result;
  };

  return { t, lang, isAr: lang === "ar" };
}
