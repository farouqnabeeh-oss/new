"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton, AdminDeleteButton } from "@/components/admin/AdminSubmitButton";
import {
  saveSettingsAction,
  saveMenuBannerAction,
  updateMenuBannerAction,
  deleteMenuBannerAction,
  type ActionResult
} from "@/lib/actions";
import type { SiteSettings, MenuBanner } from "@/lib/types";

type Props = {
  settings: SiteSettings | null;
  menuBanners: MenuBanner[];
};

export function AdminSettingsTab({ settings, menuBanners }: Props) {
  const { t } = useAdminTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const bannerFormRef = useRef<HTMLFormElement>(null);

  const handleSaveSettings = async (formData: FormData) => {
    const result: ActionResult = await saveSettingsAction(formData);
    if (result.success) {
      showToast("Settings saved successfully!");
      router.refresh();
    } else {
      showToast(result.error || "Failed to save settings.", "error");
    }
  };

  const handleSaveBanner = async (formData: FormData) => {
    const result: ActionResult = await saveMenuBannerAction(formData);
    if (result.success) {
      showToast("Banner added successfully!");
      bannerFormRef.current?.reset();
      router.refresh();
    } else {
      showToast(result.error || "Failed to add banner.", "error");
    }
  };

  const handleUpdateBanner = async (formData: FormData) => {
    const result: ActionResult = await updateMenuBannerAction(formData);
    if (result.success) {
      showToast("Banner updated!");
      router.refresh();
    } else {
      showToast(result.error || "Failed to update banner.", "error");
    }
  };

  const handleDeleteBanner = async (formData: FormData) => {
    const result: ActionResult = await deleteMenuBannerAction(formData);
    if (result.success) {
      showToast("Banner deleted!");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete banner.", "error");
    }
  };

  return (
    <>
      <div className="admin-card">
        <h3 className="admin-card-title mb-4">{t('siteSettings')}</h3>
        <form action={handleSaveSettings}>
          <input type="hidden" name="Id" value={settings?.id ?? 0} />
          <div className="form-row">
            <div className="form-group">
              <label>Site Name</label>
              <input name="SiteName" defaultValue={settings?.siteName ?? ""} />
            </div>
            <div className="form-group">
              <label>Site Name (Arabic)</label>
              <input name="SiteNameAr" defaultValue={settings?.siteNameAr ?? ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Logo URL</label>
              <input name="LogoUrl" defaultValue={settings?.logoUrl ?? ""} />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <input name="CurrencySymbol" defaultValue={settings?.currencySymbol ?? ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <input type="color" name="PrimaryColor" defaultValue={settings?.primaryColor ?? "#8B0000"} />
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <input type="color" name="SecondaryColor" defaultValue={settings?.secondaryColor ?? "#1a1a1a"} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Meta Description (Arabic)</label>
              <textarea name="MetaDescriptionAr" rows={2} defaultValue={settings?.metaDescriptionAr ?? ""} />
            </div>
            <div className="form-group">
              <label>Meta Description (English)</label>
              <textarea name="MetaDescriptionEn" rows={2} defaultValue={settings?.metaDescriptionEn ?? ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>TikTok URL</label>
              <input name="TiktokUrl" defaultValue={settings?.tiktokUrl ?? "https://www.tiktok.com/@uptownps"} />
            </div>
            <div className="form-group">
              <label>Instagram (Uptown)</label>
              <input name="InstagramUptownUrl" defaultValue={settings?.instagramUptownUrl ?? "https://www.instagram.com/uptownramallah"} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Facebook (Uptown)</label>
              <input name="FacebookUptownUrl" defaultValue={settings?.facebookUptownUrl ?? "https://www.facebook.com/uptownramallah"} />
            </div>
            <div className="form-group">
              <label>Facebook (Pasta Signature)</label>
              <input name="FacebookPastaUrl" defaultValue={settings?.facebookPastaUrl ?? "https://www.facebook.com/pastasignature"} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Instagram (Pasta Signature)</label>
              <input name="InstagramPastaUrl" defaultValue={settings?.instagramPastaUrl ?? ""} />
            </div>
            <div className="form-group">
              <label>Site Email</label>
              <input name="SiteEmail" defaultValue={settings?.siteEmail ?? ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Site Phone (WhatsApp)</label>
              <input name="SitePhone" defaultValue={settings?.sitePhone ?? ""} />
            </div>
            <div className="form-group">
              <label>Site Address</label>
              <input name="SiteAddress" defaultValue={settings?.siteAddress ?? ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
                <label>Footer Credit</label>
                <input value="By Jacqueline (fixed link to WhatsApp)" readOnly disabled />
            </div>
          </div>
          <AdminSubmitButton label={t('save')} pendingLabel={t('saving')} />
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 20 }}>
        <h3 className="admin-card-title mb-4">Menu Hero Banners</h3>
        <form ref={bannerFormRef} action={handleSaveBanner} style={{ marginBottom: 20 }}>
          <input type="hidden" name="Id" value="0" />
          <div className="form-row">
            <div className="form-group">
              <label>Banner Name</label>
              <input name="Name" required />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input type="number" name="SortOrder" defaultValue="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Banner Image</label>
              <input type="file" name="bannerImage" accept="image/*" required />
            </div>
            <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
              <label>
                <input type="checkbox" name="IsActive" value="true" defaultChecked /> Active
              </label>
            </div>
          </div>
          <AdminSubmitButton label="Add Banner" pendingLabel="Uploading…" />
        </form>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Name</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuBanners.map((banner) => (
              <tr key={banner.id}>
                <td>
                  <img src={banner.imagePath} alt={banner.name} style={{ width: 180, height: 72, objectFit: "cover", borderRadius: 12 }} />
                </td>
                <td>{banner.name}</td>
                <td>{banner.sortOrder}</td>
                <td>{banner.isActive ? "Active" : "Hidden"}</td>
                <td>
                  <BannerUpdateForm banner={banner} onUpdate={handleUpdateBanner} onDelete={handleDeleteBanner} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BannerUpdateForm({
  banner,
  onUpdate,
  onDelete
}: {
  banner: MenuBanner;
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
}) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <form action={onUpdate} style={{ display: "inline-flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input type="hidden" name="Id" value={banner.id} />
        <input type="hidden" name="ImagePath" value={banner.imagePath} />
        <input name="Name" defaultValue={banner.name} style={{ width: 160 }} />
        <input type="number" name="SortOrder" defaultValue={banner.sortOrder} style={{ width: 90 }} />
        <label>
          <input type="checkbox" name="IsActive" value="true" defaultChecked={banner.isActive} /> Active
        </label>
        <AdminSubmitButton label="Update" pendingLabel="…" variant="outline" size="sm" />
      </form>
      <form action={onDelete} style={{ display: "inline" }}>
        <input type="hidden" name="id" value={banner.id} />
        <AdminDeleteButton confirmMessage="Delete this banner?" />
      </form>
    </div>
  );
}
