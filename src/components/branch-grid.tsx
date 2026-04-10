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
          disabled={isLocating}
          style={{ 
            width: 'auto', 
            padding: '10px 30px', 
            borderRadius: '8px', 
            background: '#1a1a1a', 
            color: '#fff', 
            fontSize: '13px',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isLocating ? (isAr ? "جاري التحديد..." : "Locating...") : t.locateMe}
        </button>
        <p style={{ fontSize: '11px', color: '#a0aec0', fontWeight: 500, margin: 0 }}>
          {isAr ? "يمكنك أيضاً اختيار أي فرع يدوياً" : "You can also choose any branch manually"}
        </p>
      </div>

      <div className="simple-branch-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
        gap: '20px', 
        padding: '10px 0' 
      }}>
        {branches.map((branch) => {
          const branchName = isAr ? branch.nameAr : (branch.nameEn || branch.nameAr);
          return (
            <div key={branch.id} className="simple-branch-card" style={{
              background: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              border: 'none',
              margin: '5px'
            }}>
              {/* Media Section */}
              <div className="branch-card-media-shell" style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <a href={`/menu/${branch.slug}`} onClick={() => localStorage.setItem("uptown-preferred-branch", branch.slug)}>
                    <img
                        src={branch.bannerImagePath || "/images/panar2.jpeg"}
                        alt={branchName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="branch-img"
                    />
                  </a>
                  
                  {/* Promo Badge */}
                  <div style={{
                      position: 'absolute', top: '20px', left: '20px',
                      background: '#fff',
                      color: '#991b1b', 
                      padding: '8px 16px',
                      borderRadius: '50px', 
                      fontSize: '11px', 
                      fontWeight: 900, 
                      zIndex: 2,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                      OFF {branch.discountPercent || '10'}%
                  </div>
              </div>

              {/* Content Section */}
              <div className="branch-card-content" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>{branchName}</h3>
                    <p style={{ color: '#475569', fontSize: '15px', fontWeight: 500, margin: 0, direction: 'ltr' }}>{branch.slug === 'al-irsal' ? '+970597101010' : branch.slug === 'al-tira' ? '+972593667711' : (branch.phone || branch.whatsApp)}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '15px', alignItems: 'center' }}>
                  <a href={branch.slug === 'al-irsal' ? "https://www.google.com/maps/place/Uptown+Burger+%26+Wings/@31.9066554,35.1557243,14z/data=!4m14!1m7!3m6!1s0x151d2bb8c84d9847:0x354589acab67e291!2sUptown+Burger+%26+Wings!8m2!3d31.9204864!4d35.2092704!16s%2Fg%2F11nwwvx95t!3m5!1s0x151d2bb8c84d9847:0x354589acab67e291!8m2!3d31.9204864!4d35.2092704!16s%2Fg%2F11nwwvx95t?entry=ttu&g_ep=EgoyMDI2MDMyOS4wIKXMDSoASAFQAw%3D%3D" : branch.slug === 'al-tira' ? "https://www.google.com/maps/place/Uptown+Burger+%26+Wings/@31.9066554,35.1557243,14z/data=!4m10!1m2!2m1!1sUptown+Burger+%26+Wings,+Ein+Ajoz,+behind+sarreyar,+Al-tira+St,+Ramallah!3m6!1s0x151d2ab6097574eb:0xd93318b7f41be802!8m2!3d31.9066554!4d35.1938331!15sCkZVcHRvd24gQnVyZ2VyICYgV2luZ3MsIEVpbiBBam96LCBiZWhpbmQgc2FycmV5YXIsIEFsLXRpcmEgU3QsIFJhbWFsbGFoWkQiQnVwdG93biBidXJnZXIgJiB3aW5ncyBlaW4gYWpveiBiZWhpbmQgc2FycmV5YXIgYWwgdGlyYSBzdCByYW1hbGxhaJIBCnJlc3RhdXJhbnTgAQA!16s%2Fg%2F11yqkyt7rd?entry=ttu&g_ep=EgoyMDI2MDQwNy4wIKXMDSoASAFQAw%3D%3D" : "#"} target="_blank" rel="noopener noreferrer" style={{ 
                    background: '#fff',
                    border: '1.5px solid #e2e8f0', 
                    color: '#0f172a', 
                    padding: '14px 10px', 
                    borderRadius: '16px', 
                    fontSize: '13px', 
                    fontWeight: 900, 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} className="map-btn">
                    {isAr ? "عرض الموقع على الخارطة" : "View Map"}
                  </a>

                  <a href={`/menu/${branch.slug}`} onClick={() => localStorage.setItem("uptown-preferred-branch", branch.slug)} style={{ 
                    background: 'linear-gradient(to bottom, #d92228, #b91c1c)', 
                    color: '#fff', 
                    padding: '14px 10px', 
                    borderRadius: '16px', 
                    fontSize: '14px', 
                    fontWeight: 900, 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(185, 28, 28, 0.4)'
                  }} className="order-btn">
                    {isAr ? "اطلب الآن" : "Order Now"}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .simple-branch-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
