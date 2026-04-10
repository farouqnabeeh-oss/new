"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton, AdminDeleteButton } from "@/components/admin/AdminSubmitButton";
import { saveProductAction, deleteProductAction, type ActionResult } from "@/lib/actions";
import type { Branch, Category, Product, SiteSettings } from "@/lib/types";

type SizeEntry = { NameAr: string; NameEn: string; Price: number };
type TypeEntry = { NameAr: string; NameEn: string; Price: number; Description: string | null };

type AdminProduct = Product & { category: Category; branch?: Branch | null };

type Props = {
  products: AdminProduct[];
  categories: (Category & { branch?: Branch | null })[];
  branches: Branch[];
  settings: SiteSettings | null;
};

export function AdminProductsTab({ products, categories, branches, settings }: Props) {
  const { t } = useAdminTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editId, setEditId] = useState(0);

  const [sizes, setSizes] = useState<SizeEntry[]>([]);
  const [types, setTypes] = useState<TypeEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const sizeArRef = useRef<HTMLInputElement>(null);
  const sizeEnRef = useRef<HTMLInputElement>(null);
  const sizePriceRef = useRef<HTMLInputElement>(null);
  const typeArRef = useRef<HTMLInputElement>(null);
  const typeEnRef = useRef<HTMLInputElement>(null);
  const typePriceRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
    setEditId(0);
    if (containerRef.current) containerRef.current.style.display = "none";
    setSizes([]);
    setTypes([]);
  }, []);

  const handleSave = async (formData: FormData) => {
    formData.set("Id", String(editId));
    formData.set("sizesJson", JSON.stringify(sizes));
    formData.set("typesJson", JSON.stringify(types));
    const result: ActionResult = await saveProductAction(formData);
    if (result.success) {
      showToast(editId === 0 ? "Product created successfully!" : "Product updated successfully!");
      resetForm();
      router.refresh();
    } else {
      showToast(result.error || "Failed to save product.", "error");
    }
  };

  const handleDelete = async (formData: FormData) => {
    const result: ActionResult = await deleteProductAction(formData);
    if (result.success) {
      showToast("Product deleted successfully!");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete product.", "error");
    }
  };

  const editProduct = useCallback(async (product: AdminProduct) => {
    if (!containerRef.current || !formRef.current) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/ProductsApi/${product.id}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("Failed to load product");
      const data = await res.json();

      containerRef.current.style.display = "block";
      setEditId(data.id);
      const form = formRef.current;
      (form.elements.namedItem("NameAr") as HTMLInputElement).value = data.nameAr || "";
      (form.elements.namedItem("NameEn") as HTMLInputElement).value = data.nameEn || "";
      (form.elements.namedItem("DescriptionAr") as HTMLTextAreaElement).value = data.descriptionAr || "";
      (form.elements.namedItem("DescriptionEn") as HTMLTextAreaElement).value = data.descriptionEn || "";
      (form.elements.namedItem("BasePrice") as HTMLInputElement).value = String(data.basePrice ?? 0);
      (form.elements.namedItem("Discount") as HTMLInputElement).value = String(data.discount ?? 0);
      (form.elements.namedItem("SortOrder") as HTMLInputElement).value = String(data.sortOrder ?? 0);
      (form.elements.namedItem("CategoryId") as HTMLSelectElement).value = data.categoryId || "";
      (form.elements.namedItem("BranchId") as HTMLSelectElement).value = data.branchId || "";
      (form.elements.namedItem("AllBranches") as HTMLInputElement).checked = !!data.allBranches;
      (form.elements.namedItem("HasMealOption") as HTMLInputElement).checked = !!data.hasMealOption;
      (form.elements.namedItem("HasDonenessOption") as HTMLInputElement).checked = !!data.hasDonenessOption;
      (form.elements.namedItem("IsActive") as HTMLInputElement).checked = !!data.isActive;

      setSizes((data.sizes || []).map((s: { nameAr?: string; nameEn?: string; price?: number }) => ({
        NameAr: s.nameAr || "", NameEn: s.nameEn || "", Price: Number(s.price || 0)
      })));
      setTypes((data.types || []).map((t: { nameAr?: string; nameEn?: string; price?: number; description?: string | null }) => ({
        NameAr: t.nameAr || "", NameEn: t.nameEn || "", Price: Number(t.price || 0), Description: t.description || null
      })));

      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      showToast("Failed to load product for editing.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const toggleForm = useCallback(() => {
    if (!containerRef.current) return;
    const isHidden = containerRef.current.style.display === "none";
    if (isHidden) {
      formRef.current?.reset();
      setEditId(0);
      setSizes([]);
      setTypes([]);
      const form = formRef.current;
      if (form) {
        (form.elements.namedItem("AllBranches") as HTMLInputElement).checked = true;
        (form.elements.namedItem("IsActive") as HTMLInputElement).checked = true;
        (form.elements.namedItem("HasMealOption") as HTMLInputElement).checked = false;
        (form.elements.namedItem("HasDonenessOption") as HTMLInputElement).checked = false;
      }
      containerRef.current.style.display = "block";
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      containerRef.current.style.display = "none";
    }
  }, []);

  const addSize = () => {
    const nameAr = sizeArRef.current?.value.trim() || "";
    const nameEn = sizeEnRef.current?.value.trim() || "";
    const price = parseFloat(sizePriceRef.current?.value || "") || 0;
    if (!nameAr && !nameEn) return;
    setSizes((prev) => [...prev, { NameAr: nameAr, NameEn: nameEn, Price: price }]);
    if (sizeArRef.current) sizeArRef.current.value = "";
    if (sizeEnRef.current) sizeEnRef.current.value = "";
    if (sizePriceRef.current) sizePriceRef.current.value = "";
  };

  const addType = () => {
    const nameAr = typeArRef.current?.value.trim() || "";
    const nameEn = typeEnRef.current?.value.trim() || "";
    const price = parseFloat(typePriceRef.current?.value || "") || 0;
    if (!nameAr && !nameEn) return;
    setTypes((prev) => [...prev, { NameAr: nameAr, NameEn: nameEn, Price: price, Description: null }]);
    if (typeArRef.current) typeArRef.current.value = "";
    if (typeEnRef.current) typeEnRef.current.value = "";
    if (typePriceRef.current) typePriceRef.current.value = "";
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">{t('manageProducts')} ({products.length})</h3>
        <button className="btn btn-primary" type="button" onClick={toggleForm}>
          {t('addProduct')}
        </button>
      </div>

      {loading && (
        <div style={{ padding: 20, textAlign: "center", color: "var(--text-secondary)" }}>
          <span className="spinner" /> Loading product…
        </div>
      )}

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
              <label>{t('descAr')}</label>
              <textarea name="DescriptionAr" rows={2} />
            </div>
            <div className="form-group">
              <label>{t('descEn')}</label>
              <textarea name="DescriptionEn" rows={2} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label>Base Price</label>
              <input type="number" name="BasePrice" step="0.01" min="0" defaultValue="0" required />
            </div>
            <div className="form-group">
              <label>Discount %</label>
              <input type="number" name="Discount" step="0.01" min="0" max="100" defaultValue="0" />
            </div>
            <div className="form-group">
              <label>Sort Order</label>
              <input type="number" name="SortOrder" defaultValue="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="CategoryId" required defaultValue="">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.nameEn} ({cat.branch?.nameEn ?? "All"})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Branch</label>
              <select name="BranchId" defaultValue="">
                <option value="">— (use AllBranches)</option>
                {branches.map((branch) => (
                  <option value={branch.id} key={branch.id}>{branch.nameEn}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image</label>
              <input type="file" name="productImage" accept="image/*" />
            </div>
            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 20 }}>
              <label><input type="checkbox" name="AllBranches" value="true" defaultChecked /> All Branches</label>
              <label><input type="checkbox" name="HasMealOption" value="true" /> Has Meal Option</label>
              <label><input type="checkbox" name="HasDonenessOption" value="true" /> Has Doneness</label>
              <label><input type="checkbox" name="IsActive" value="true" defaultChecked /> Active</label>
            </div>
          </div>

          {/* Sizes */}
          <div className="admin-card" style={{ marginTop: 12 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Sizes</h4>
            <div>
              {sizes.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-surface)", borderRadius: 8, marginBottom: 4 }}>
                  <span>{s.NameAr} / {s.NameEn} - {s.Price}</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
            <div className="form-row-3 mt-2">
              <input ref={sizeArRef} placeholder="Arabic name" />
              <input ref={sizeEnRef} placeholder="English name" />
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={sizePriceRef} type="number" step="0.01" placeholder="Price" />
                <button type="button" className="btn btn-outline" onClick={addSize}>+</button>
              </div>
            </div>
          </div>

          {/* Types */}
          <div className="admin-card" style={{ marginTop: 12 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Types</h4>
            <div>
              {types.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "var(--bg-surface)", borderRadius: 8, marginBottom: 4 }}>
                  <span>{t.NameAr} / {t.NameEn} - {t.Price}</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setTypes((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
            <div className="form-row-3 mt-2">
              <input ref={typeArRef} placeholder="Arabic name" />
              <input ref={typeEnRef} placeholder="English name" />
              <div style={{ display: "flex", gap: 8 }}>
                <input ref={typePriceRef} type="number" step="0.01" placeholder="Price" />
                <button type="button" className="btn btn-outline" onClick={addType}>+</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <AdminSubmitButton label={editId ? "Update Product" : "Save Product"} pendingLabel="Saving…" />
            <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={resetForm}>Cancel</button>
          </div>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Sizes</th>
            <th>Types</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img 
                  src={product.imagePath || '/images/classic-cheeseburger__0x1e3y1qv68eiip.jpg'} 
                  alt="" 
                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }} 
                />
              </td>
              <td>
                {product.nameAr} / {product.nameEn}
                {product.discount > 0 ? <span className="badge badge-primary">{product.discount}%</span> : null}
              </td>
              <td>{product.category?.nameEn || "No Category"}</td>
              <td>{Number(product.basePrice || 0).toFixed(0)}{settings?.currencySymbol}</td>
              <td>{product.sizes.length}</td>
              <td>{product.types.length}</td>
              <td>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => editProduct(product)}>
                  {t('edit')}
                </button>
                <form action={handleDelete} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={product.id} />
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
