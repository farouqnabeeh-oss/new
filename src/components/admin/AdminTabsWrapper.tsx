"use client";

import { useState, useEffect } from "react";
import { useAdminTranslation } from "@/lib/useAdminTranslation";


type Props = {
  children: Partial<Record<TabKey, React.ReactNode>>;
  role?: string;
};

type TabKey = "intelligence" | "branches" | "categories" | "products" | "addons" | "customers" | "settings" | "profile" | "deliveryDiscounts" | "invoiceDescounts";

// داخل مكون AdminTabsWrapper
export function AdminTabsWrapper({ children, role }: Props) {
  const { t } = useAdminTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("intelligence");

  let translatedTabs = [
    { key: "intelligence", label: t('intelligence') },
    { key: "branches", label: t('branches') },
    { key: "deliveryDiscounts", label: t('deliveryDiscounts') || 'خصومات التوصيل' }, // التاب الجديدة
    { key: "invoiceDescounts", label: t('invoiceDescounts') || 'خصومات الفواتير' }, 
    { key: "categories", label: t('categories') },
    { key: "products", label: t('products') },
    { key: "addons", label: t('addons') },
    { key: "customers", label: t('customers') },
    { key: "settings", label: t('settings') },
    { key: "profile", label: t('profile') }
  ];

  // تأكد من منع الكاشير من رؤيتها إذا أردت
  if (role?.toLowerCase() === "cashier") {
    translatedTabs = translatedTabs.filter(t => ["intelligence"].includes(t.key));
    const ordersTab = translatedTabs.find(t => t.key === "intelligence");
    if (ordersTab) ordersTab.label = t('orders') || 'الطلبات';
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as TabKey | null;
    if (tab && translatedTabs.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, []);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <>
      <div className="admin-tabs">
        {translatedTabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab${activeTab === tab.key ? " active" : ""}`}
            data-tab={tab.key}
            onClick={() => switchTab(tab.key as TabKey)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {translatedTabs.map((tab) => (
        <div
          key={tab.key}
          className={`admin-tab-content${activeTab === tab.key ? " active" : ""}`}
          id={`tab-${tab.key}`}
        >
          {children[tab.key as TabKey]}
        </div>
      ))}
    </>
  );
}
