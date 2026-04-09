"use client";

import { useEffect, useState } from "react";
import { type Branch } from "@/lib/types";
import { calculateDistance } from "@/lib/location-utils";

type Props = {
  branches: Branch[];
  lang?: string;
};

export function BranchGrid({ branches, lang = "ar" }: Props) {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [nearestBranchId, setNearestBranchId] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [expandedDeliveryId, setExpandedDeliveryId] = useState<number | null>(null);
  const isAr = lang === "ar";

  useEffect(() => {
    const now = new Date();
    setCurrentMinutes(now.getHours() * 60 + now.getMinutes());

    const interval = setInterval(() => {
      const d = new Date();
      setCurrentMinutes(d.getHours() * 60 + d.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert(isAr ? "متصفحك لا يدعم تحديد الموقع" : "Geolocation is not supported by your browser");

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      let minDistance = Infinity;
      let closestId: number | null = null;

      branches.forEach(b => {
        if (b.latitude && b.longitude) {
          const dist = calculateDistance(latitude, longitude, b.latitude, b.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closestId = b.id;
          }
        }
      });

      if (closestId) {
        setNearestBranchId(closestId);
        const foundBranch = branches.find(b => b.id === closestId);
        const branchName = isAr ? foundBranch?.nameAr : (foundBranch?.nameEn || foundBranch?.nameAr);
        alert(`${isAr ? "الفرع الأقرب إليك هو" : "The nearest branch is"} ${branchName}`);
      }
      setIsLocating(false);
    }, () => {
      setIsLocating(false);
      alert(isAr ? "تعذر تحديد موقعك" : "Unable to retrieve your location");
    });
  };

  function getStatus(branch: Branch) {
    if (!branch.openingTime || !branch.closingTime) return { isOpen: true, label: isAr ? "مفتوح" : "Open" };

    const [openH, openM] = branch.openingTime.split(':').map(Number);
    const [closeH, closeM] = branch.closingTime.split(':').map(Number);

    const openTotal = openH * 60 + openM;
    let closeTotal = closeH * 60 + closeM;

    let isOpen = false;
    if (closeTotal < openTotal) {
      isOpen = currentMinutes >= openTotal || currentMinutes <= closeTotal;
    } else {
      isOpen = currentMinutes >= openTotal && currentMinutes <= closeTotal;
    }

    return {
      isOpen,
      label: isOpen
        ? (isAr ? "مفتوح الآن" : "Open Now")
        : (isAr ? "مغلق حالياً" : "Currently Closed"),
      time: `${branch.openingTime} - ${branch.closingTime}`
    };
  }

  const t = {
    city: isAr ? "رام الله" : "Ramallah",
    locateMe: isAr ? "تحديد الفرع الأقرب 📍" : "Locate Nearest Branch 📍",
    deliveryZones: isAr ? "مناطق التوصيل" : "Delivery Zones",
    freeDelivery: isAr ? "توصيل مجاني" : "Free Delivery",
    startsFrom: isAr ? "يبدأ من" : "Starts from",
    viewMenu: isAr ? "عرض المنيو" : "View Menu"
  };

  return (
    <div className="premium-branch-grid-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={handleLocateMe}
          className="ultra-action-btn"
          disabled={isLocating}
          style={{ 
            width: 'auto', 
            padding: '14px 60px', 
            borderRadius: '10px', 
            background: '#222', 
            color: '#fff', 
            fontSize: '15px',
            fontWeight: 900,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
          }}
        >
          {isLocating ? (isAr ? "جاري التحديد..." : "Locating...") : t.locateMe}
        </button>
        <p style={{ fontSize: '11px', color: '#999', fontWeight: 600 }}>
          {isAr ? "يمكنك أيضاً اختيار أي فرع يدوياً" : "You can also choose any branch manually"}
        </p>
      </div>

      <div className="simple-branch-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '30px', 
        padding: '20px 0' 
      }}>
        {branches.map((branch) => {
          const branchName = isAr ? branch.nameAr : (branch.nameEn || branch.nameAr);
          return (
            <div key={branch.id} className="simple-branch-card" style={{
              background: '#fff',
              borderRadius: '25px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              border: '1px solid #f2f2f2'
            }}>
              {/* Media Section */}
              <div className="branch-card-media" style={{ height: '240px', position: 'relative', overflow: 'hidden', margin: '12px', borderRadius: '15px' }}>
                <img
                  src={branch.bannerImagePath || "https://images.unsplash.com/photo-1543353071-09707a3f9d3d?q=80&w=1600&auto=format&fit=crop"}
                  alt={branchName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="branch-img"
                />
                
                {/* Promo Badge */}
                <div style={{
                  position: 'absolute', top: '15px', left: '15px',
                  background: '#fff',
                  color: '#cf1f28', 
                  padding: '6px 14px',
                  borderRadius: '100px', 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  zIndex: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  border: '1px solid #f0f0f0'
                }}>
                  OFF 10%
                </div>
              </div>

              {/* Content Section */}
              <div className="branch-card-content" style={{ padding: '0 25px 25px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '5px', fontWeight: 900, color: '#0a1d37' }}>{branchName}</h3>
                
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px', fontWeight: 600 }}>
                  {branch.phone || "+97259xxxxxxx"}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                  <a 
                    href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      color: '#000',
                      padding: '15px 0',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '13px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    {isAr ? "عرض الموقع على الخارطة" : "View on Map"}
                  </a>

                  <a href={`/menu/${branch.slug}`} style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#cf1f28', // Slightly more vibrant red
                    color: '#fff',
                    padding: '15px 0',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(207, 31, 40, 0.3)'
                  }} 
                  onClick={() => {
                    localStorage.setItem("uptown-preferred-branch", branch.slug);
                  }}>
                    {isAr ? "اطلب الآن" : "Order Now"}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes fadeInSimple {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .simple-branch-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-color: #ddd;
        }
        .simple-branch-card:hover .branch-img {
          transform: scale(1.03);
        }
        .minimal-btn:hover {
          opacity: 0.85;
        }
        .zone-btn-minimal:hover {
          color: #000;
          background: #f0f0f0;
        }
        @media (max-width: 768px) {
          .simple-branch-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
