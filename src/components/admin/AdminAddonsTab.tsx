"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton, AdminDeleteButton } from "@/components/admin/AdminSubmitButton";
import { saveAddonGroupAction, deleteAddonGroupAction, type ActionResult } from "@/lib/actions";
import type { Branch, Category, Product, AddonGroup, AddonGroupItem } from "@/lib/types";

type ItemEntry = { NameAr: string; NameEn: string; Price: number };

type AdminAddonGroup = AddonGroup & { category?: Category | null; product?: Product | null };

type Props = {
  addonGroups: AdminAddonGroup[];
  categories: (Category & { branch?: Branch | null })[];
  products: (Product & { category: Category })[];
};

export function AdminAddonsTab({ addonGroups, categories, products }: Props) {
  const { t } = useAdminTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editId, setEditId] = useState(0);

  const [items, setItems] = useState<ItemEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const itemArRef = useRef<HTMLInputElement>(null);
  const itemEnRef = useRef<HTMLInputElement>(null);
  const itemPriceRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
    setEditId(0);
    if (containerRef.current) containerRef.current.style.display = "none";
    setItems([]);
  }, []);

  const handleSave = async (formData: FormData) => {
    formData.set("Id", String(editId));
    formData.set("itemsJson", JSON.stringify(items));
    const result: ActionResult = await saveAddonGroupAction(formData);
    if (result.success) {
      showToast(editId === 0 ? "Addon group created!" : "Addon group updated!");
      resetForm();
      router.refresh();
    } else {
      showToast(result.error || "Failed to save addon group.", "error");
    }
  };

  const handleDelete = async (formData: FormData) => {
    const result: ActionResult = await deleteAddonGroupAction(formData);
    if (result.success) {
      showToast("Addon group deleted!");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete addon group.", "error");
    }
  };

  const editAddonGroup = useCallback((group: AdminAddonGroup) => {
    if (!containerRef.current || !formRef.current) return;
    containerRef.current.style.display = "block";
    setEditId(group.id);
    const form = formRef.current;
    (form.elements.namedItem("NameAr") as HTMLInputElement).value = group.nameAr;
    (form.elements.namedItem("NameEn") as HTMLInputElement).value = group.nameEn;
    (form.elements.namedItem("CategoryId") as HTMLSelectElement).value = String(group.categoryId);
    (form.elements.namedItem("ProductId") as HTMLSelectElement).value = group.productId != null ? String(group.productId) : "";
    (form.elements.namedItem("GroupType") as HTMLSelectElement).value = group.groupType;
    (form.elements.namedItem("IsRequired") as HTMLInputElement).checked = group.isRequired;
    (form.elements.namedItem("AllowMultiple") as HTMLInputElement).checked = group.allowMultiple;
    (form.elements.namedItem("SortOrder") as HTMLInputElement).value = String(group.sortOrder);
    (form.elements.namedItem("IsActive") as HTMLInputElement).checked = group.isActive;

    setItems(group.items.map((item: AddonGroupItem) => ({
      NameAr: item.nameAr, NameEn: item.nameEn, Price: item.price
    })));

    containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleForm = useCallback(() => {
    if (!containerRef.current) return;
    const isHidden = containerRef.current.style.display === "none";
    if (isHidden) {
      formRef.current?.reset();
      setEditId(0);
      setItems([]);
      const form = formRef.current;
      if (form) {
        (form.elements.namedItem("GroupType") as HTMLSelectElement).value = "Addon";
        (form.elements.namedItem("IsRequired") as HTMLInputElement).checked = false;
        (form.elements.namedItem("AllowMultiple") as HTMLInputElement).checked = true;
        (form.elements.namedItem("IsActive") as HTMLInputElement).checked = true;
      }
      containerRef.current.style.display = "block";
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      containerRef.current.style.display = "none";
    }
  }, []);

  const addItem = () => {
    const nameAr = itemArRef.current?.value.trim() || "";
    const nameEn = itemEnRef.current?.value.trim() || "";
    const price = parseFloat(itemPriceRef.current?.value || "") || 0;
    if (!nameAr && !nameEn) return;
    setItems((prev) => [...prev, { NameAr: nameAr, NameEn: nameEn, Price: price }]);
    if (itemArRef.current) itemArRef.current.value = "";
    if (itemEnRef.current) itemEnRef.current.value = "";
    if (itemPriceRef.current) itemPriceRef.current.value = "0";
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">{t('manageAddons')}</h3>
        <button className="btn btn-primary" type="button" onClick={toggleForm}>{t('addAddon')}</button>
      </div>
      <div ref={containerRef} style={{ display: "none", marginBottom: 30 }}>
        <div className="admin-form-container premium-addon-form">
          <form ref={formRef} action={handleSave}>
            <input type="hidden" name="Id" value={editId} readOnly />

            <div className="form-section">
              <div className="form-section-title">📂 {t('groupIdentity') || 'Group Identity'}</div>
              <div className="form-row">
                <div className="premium-input-group">
                  <label>{t('nameAr')}</label>
                  <input name="NameAr" className="premium-input" required />
                </div>
                <div className="premium-input-group">
                  <label>{t('nameEn')}</label>
                  <input name="NameEn" className="premium-input" required />
                </div>
              </div>
            </div>

            <div className="form-row-3" style={{ marginTop: '20px' }}>
              <div className="premium-input-group">
                <label>{t('category')}</label>
                <select name="CategoryId" className="premium-select" required defaultValue="">
                  <option value="">{t('selectCategory') || 'Select Category'}</option>
                  {categories.map((cat) => (
                    <option value={cat.id} key={cat.id}>{cat.nameEn} ({cat.branch?.nameEn || 'Global'})</option>
                  ))}
                </select>
              </div>
              <div className="premium-input-group">
                <label>Group Type</label>
                <select name="GroupType" className="premium-select" defaultValue="Addon">
                  <option value="Addon">Addon (+ price)</option>
                  <option value="Without">Without (no price)</option>
                  <option value="MealDrink">Meal Drink</option>
                  <option value="MealDrinkUpgrade">Meal Drink Upgrade</option>
                  <option value="MealFries">Meal Fries</option>
                  <option value="Doneness">Doneness</option>
                </select>
              </div>
              <div className="premium-input-group">
                <label>Sort Order</label>
                <input type="number" name="SortOrder" className="premium-input" defaultValue="0" />
              </div>
            </div>

            <div className="logic-toggles" style={{ marginTop: '20px' }}>
              <label className="logic-chip">
                <input type="checkbox" name="IsRequired" value="true" />
                <span>Required</span>
              </label>
              <label className="logic-chip">
                <input type="checkbox" name="AllowMultiple" value="true" defaultChecked />
                <span>Allow Multiple</span>
              </label>
              <label className="logic-chip">
                <input type="checkbox" name="IsActive" value="true" defaultChecked />
                <span>Is Active</span>
              </label>
            </div>

            {/* Items Section */}
            <div className="form-section" style={{ marginTop: '30px' }}>
              <div className="form-section-title">🥗 {t('groupItems') || 'Items in this group'}</div>
              <div className="items-grid-admin">
                {items.map((item, i) => (
                  <div key={i} className="item-card-admin">
                    <div className="item-info-admin">
                      <span className="item-name-admin">{item.NameAr}</span>
                      <span className="item-price-admin">{item.Price} {t('currency') || '$'}</span>
                    </div>
                    <button type="button" className="item-remove-admin" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}>&times;</button>
                  </div>
                ))}
              </div>

              <div className="quick-add-item-bar">
                <input ref={itemArRef} placeholder="Arabic Name" className="premium-input-sm" />
                <input ref={itemEnRef} placeholder="English Name" className="premium-input-sm" />
                <input ref={itemPriceRef} type="number" step="0.01" placeholder="Price" defaultValue="0" className="premium-input-sm" style={{ width: '80px' }} />
                <button type="button" className="btn-add-item" onClick={addItem}>{t('addItem') || 'Add Item'}</button>
              </div>
            </div>

            <div className="save-bar-premium">
              <div className="save-bar-info">
                <span className="synced-indicator">✨ {editId ? 'Editing Group' : 'New Group'}</span>
              </div>
              <div className="save-bar-actions">
                <button type="button" className="btn-discard" onClick={resetForm}>{t('cancel') || 'Cancel'}</button>
                <AdminSubmitButton label={editId ? "Update Group" : "Create Group"} pendingLabel="Saving…" className="btn-save-large" />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="table-controls" style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
        <input
          type="text"
          placeholder="Search groups..."
          className="premium-input"
          style={{ maxWidth: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('type')}</th>
              <th>{t('category')}</th>
              <th>{t('items')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {addonGroups.filter(g =>
              (g.nameAr || '').includes(searchTerm) ||
              (g.nameEn || '').toLowerCase().includes(searchTerm.toLowerCase())
            ).map((group) => (
              <tr key={group.id} className={!group.isActive ? 'row-inactive' : ''}>
                <td>
                  <div style={{ fontWeight: 800 }}>{group.nameAr}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{group.nameEn}</div>
                </td>
                <td><span className={`type-tag type-${group.groupType.toLowerCase()}`}>{group.groupType}</span></td>
                <td><span className="category-tag">{group.category?.nameEn ?? "Global"}</span></td>
                <td><span className="items-count-tag">{group.items?.length || 0} items</span></td>
                <td>
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-outline btn-sm" style={{ border: 'none', background: '#f5f5f5' }} onClick={() => editAddonGroup(group)}>{t('edit')}</button>
                    <form action={handleDelete} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={group.id} />
                      <AdminDeleteButton confirmMessage={t('confirmDelete')} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .premium-addon-form { animation: slideDown 0.4s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        .items-grid-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .item-card-admin { display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; border: 1px solid #eee; border-radius: 12px; padding: 10px 15px; }
        .item-info-admin { display: flex; flexDirection: column; gap: 2px; }
        .item-name-admin { font-size: 13px; font-weight: 800; color: #333; }
        .item-price-admin { font-size: 11px; font-weight: 700; color: var(--primary); }
        .item-remove-admin { background: #fff; color: #ff4d4d; border: 1px solid #eee; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: 0.2s; }
        .item-remove-admin:hover { background: #ff4d4d; color: #fff; }

        .quick-add-item-bar { display: flex; gap: 10px; background: #fff; padding: 15px; border-radius: 16px; border: 1px solid #eee; border-bottom: 3px solid #eee; }
        .btn-add-item { background: #000; color: #fff; border: none; padding: 0 20px; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .btn-add-item:hover { transform: translateY(-2px); }

        .type-tag { font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; }
        .type-without { background: #fff1f1; color: #f84f4f; }
        .type-addon { background: #f0fdf4; color: #16a34a; }
        .type-mealdrink { background: #eff6ff; color: #2563eb; }
        .category-tag { font-size: 11px; font-weight: 800; background: #f3f4f6; color: #4b5563; padding: 4px 10px; border-radius: 10px; }
        .items-count-tag { font-size: 11px; font-weight: 800; color: #9ca3af; }
        .row-inactive { opacity: 0.5; filter: grayscale(1); }

        .save-bar-premium { position: sticky; bottom: -2px; width: calc(100% + 60px); margin: 0 -30px -30px; padding: 20px 40px; background: #1a1a1a; display: flex; justify-content: space-between; align-items: center; border-radius: 0 0 24px 24px; box-shadow: 0 -10px 30px rgba(0,0,0,0.1); }
        .save-bar-info { color: #fff; font-weight: 700; font-size: 14px; }
        .save-bar-actions { display: flex; gap: 15px; }
        .btn-discard { background: transparent; border: 1px solid #444; color: #aaa; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .btn-discard:hover { border-color: #666; color: #fff; }

        .logic-toggles { display: flex; gap: 10px; flex-wrap: wrap; }
        .logic-chip { flex: 1; min-width: 140px; display: flex; alignItems: center; gap: 8px; padding: 12px; background: #fff; border: 1px solid #eee; border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 700; transition: 0.2s; }
        .logic-chip input { width: 18px; height: 18px; accent-color: var(--primary); }
        
        .premium-input, .premium-select { width: 100%; padding: 12px 16px; background: #fdfdfd; border: 2px solid #f0f0f0; border-radius: 14px; font-size: 15px; outline: none; transition: 0.3s; }
        .premium-input:focus, .premium-select:focus { border-color: var(--primary); background: #fff; }
        .premium-input-group { display: flex; flexDirection: column; gap: 6px; flex: 1; }
        .premium-input-group label { font-size: 13px; font-weight: 800; color: #555; margin-inline-start: 4px; }
        .form-section-title { font-size: 13px; font-weight: 900; color: #aaa; text-transform: uppercase; margin-bottom: 15px; display: flex; alignItems: center; gap: 10px; }
        .form-section-title::after { content: ""; flex: 1; height: 1px; background: #eee; }
      `}</style>
    </div>
  );
}
