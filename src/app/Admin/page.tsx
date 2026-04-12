import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getAdminData } from "@/lib/data";
import { logoutAction } from "@/lib/actions";
import { AdminToastProvider } from "@/components/admin/AdminToast";
import { AdminTabsWrapper } from "@/components/admin/AdminTabsWrapper";
import FooterLangSwitcher from "@/components/footer-lang-switcher";
import { cookies } from "next/headers";
import { AdminBranchesTab } from "@/components/admin/AdminBranchesTab";
import { AdminCategoriesTab } from "@/components/admin/AdminCategoriesTab";
import { AdminProductsTab } from "@/components/admin/AdminProductsTab";
import { AdminAddonsTab } from "@/components/admin/AdminAddonsTab";
import { AdminSettingsTab } from "@/components/admin/AdminSettingsTab";
import { AdminProfileTab } from "@/components/admin/AdminProfileTab";
import { AdminIntelligenceTab } from "@/components/admin/AdminIntelligenceTab";
import { AdminCustomersTab } from "@/components/admin/AdminCustomersTab";
import { AdminLangSwitcher } from "@/components/admin/AdminLangSwitcher";

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/Account/Login?returnUrl=%2FAdmin");

  const {
    branches,
    categories,
    products,
    addonGroups,
    menuBanners,
    settings,
    orders,
    customers
  } = await getAdminData();

  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "ar";
  const isAr = lang === "ar";

  return (
    <AdminToastProvider>
      <div className="admin-page">
        <div className="admin-header">
          <h1 className="admin-title">{isAr ? "⚙️ لوحة التحكم" : "⚙️ Admin Panel"}</h1>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <AdminLangSwitcher currentLang={lang} />
            <form action={logoutAction} style={{ display: "inline" }}>
              <button type="submit" className="btn btn-outline" style={{ padding: '8px 20px' }}>
                {isAr ? "تسجيل الخروج" : "Logout"}
              </button>
            </form>
          </div>
        </div>

        <AdminTabsWrapper role={session.role}>
          {session.role === "cashier" ? {
            intelligence: <AdminIntelligenceTab orders={orders} branches={branches} />,
            customers: <AdminCustomersTab customers={customers} />,
            profile: <AdminProfileTab user={{ email: session.email, displayName: session.displayName }} />
          } : {
            intelligence: <AdminIntelligenceTab orders={orders} branches={branches} />,
            branches: <AdminBranchesTab branches={branches} />,
            categories: <AdminCategoriesTab categories={categories} branches={branches} />,
            products: <AdminProductsTab products={products as any} categories={categories} branches={branches} settings={settings as any} addonGroups={addonGroups as any} />,
            addons: <AdminAddonsTab addonGroups={addonGroups as any} categories={categories} products={products as any} />,
            customers: <AdminCustomersTab customers={customers} />,
            settings: <AdminSettingsTab settings={settings as any} menuBanners={menuBanners} />,
            profile: <AdminProfileTab user={{ email: session.email, displayName: session.displayName }} />
          }}
        </AdminTabsWrapper>
      </div>
    </AdminToastProvider>
  );
}
