"use client";

import { useEffect, useState } from "react";
import { type Branch } from "@/lib/types";

export function ContinueOrdering({ branches, lang = "ar" }: { branches: Branch[], lang?: string }) {
  const [preferredBranch, setPreferredBranch] = useState<Branch | null>(null);
  const isAr = lang === "ar";

  useEffect(() => {
    const slug = localStorage.getItem("uptown-preferred-branch");
    if (slug) {
      const branch = branches.find(b => b.slug === slug);
      if (branch) setPreferredBranch(branch);
    }
  }, [branches]);

  if (!preferredBranch) return null;

  return (
    <div style={{ 
      background: 'var(--primary)', 
      color: '#fff', 
      padding: '20px', 
      borderRadius: '24px', 
      marginBottom: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 20px 40px var(--primary-glow)',
      animation: 'slideIn 0.5s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.2)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🍔
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
            {isAr ? "مرحباً بعودتك!" : "Welcome back!"}
          </h4>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            {isAr ? `نحن جاهزون في فرع ${preferredBranch.nameAr}` : `Ready to order from ${preferredBranch.nameEn || preferredBranch.nameAr}?`}
          </p>
        </div>
      </div>
      
      <a href={`/menu/${preferredBranch.slug}`} style={{ 
        background: '#fff', 
        color: 'var(--primary)', 
        padding: '12px 25px', 
        borderRadius: '50px', 
        fontWeight: 900, 
        fontSize: '14px',
        textDecoration: 'none',
        textTransform: 'uppercase',
        transition: 'transform 0.2s'
      }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
         onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        {isAr ? "أكمل طلبك الآن" : "Continue Ordering"}
      </a>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
