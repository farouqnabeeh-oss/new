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
      <div ref={containerRef} style={{ display: "none", marginBottom: 20 }}>
        <form ref={formRef} action={handleSave}>
          <input type="hidden" name="Id" value={editId} readOnly />
          <div className="form-row">
            <div className="form-group">
              <label>{t('nameAr')}</label>
              <input name="NameAr" required />
            </div>
            <div className="form-group">
              <label>{t('nameEn')}</label>
              <input name="NameEn" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('category')}</label>
              <select name="CategoryId" required defaultValue="">
                <option value="">{t('category')}</option>
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>{cat.nameEn}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Product Scope</label>
              <select name="ProductId" defaultValue="">
                <option value="">Whole Category</option>
                {products.map((product) => (
                  <option value={product.id} key={product.id}>{product.nameEn}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Group Type</label>
              <select name="GroupType" defaultValue="Addon">
                <option value="Addon">Addon (+ price)</option>
                <option value="Without">Without (no price)</option>
                <option value="MealDrink">Meal Drink</option>
                <option value="MealDrinkUpgrade">Meal Drink Upgrade</option>
                <option value="MealFries">Meal Fries</option>
                <option value="Doneness">Doneness</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input type="number" name="SortOrder" defaultValue="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 20 }}>
              <label><input type="checkbox" name="IsRequired" value="true" /> Required</label>
              <label><input type="checkbox" name="AllowMultiple" value="true" defaultChecked /> Allow Multiple</label>
              <label><input type="checkbox" name="IsActive" value="true" defaultChecked /> Active</label>
            </div>
          </div>

          {/* Items */}
          <div className="admin-card" style={{ marginTop: 12 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Items</h4>
            <div>
              {items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-surface)", borderRadius: 8, marginBottom: 4 }}>
                  <span>{item.NameAr} / {item.NameEn} - {item.Price}</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
            <div className="form-row-3 mt-2">
              <input ref={itemArRef} placeholder="Arabic name" />
              <input ref={itemEnRef} placeholder="English name" />
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={itemPriceRef} type="number" step="0.01" placeholder="Price" defaultValue="0" />
                <button type="button" className="btn btn-outline" onClick={addItem}>+</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <AdminSubmitButton label={editId ? "Update Addon Group" : "Save Addon Group"} pendingLabel="Saving…" />
            <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('category')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {addonGroups.map((group) => (
            <tr key={group.id}>
              <td>{group.nameAr} / {group.nameEn}</td>
              <td>{group.category?.nameEn ?? "Unknown"}</td>
              <td>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => editAddonGroup(group)}>{t('edit')}</button>
                <form action={handleDelete} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={group.id} />
                  <AdminDeleteButton confirmMessage={t('confirmDelete')} />
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
