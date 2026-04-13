"use client";

import { useRef, useState, useCallback, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton, AdminDeleteButton } from "@/components/admin/AdminSubmitButton";
import { saveProductAction, deleteProductAction, type ActionResult } from "@/lib/actions";
import type { Branch, Category, Product, SiteSettings, AddonGroup } from "@/lib/types";

type SizeEntry = { NameAr: string; NameEn: string; Price: number };
type TypeEntry = { NameAr: string; NameEn: string; Price: number; Description: string | null };

type AdminProduct = Product & { category: Category; branch?: Branch | null };

type Props = {
  products: AdminProduct[];
  categories: (Category & { branch?: Branch | null })[];
  branches: Branch[];
  settings: SiteSettings | null;
  addonGroups: AddonGroup[];
};

export function AdminProductsTab({ products, categories, branches, settings, addonGroups }: Props) {
  const { t } = useAdminTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editId, setEditId] = useState(0);

  const [sizes, setSizes] = useState<SizeEntry[]>([]);
  const [types, setTypes] = useState<TypeEntry[]>([]);
  const [selectedAddonGroupIds, setSelectedAddonGroupIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const sizeArRef = useRef<HTMLInputElement>(null);
  const sizeEnRef = useRef<HTMLInputElement>(null);
  const sizePriceRef = useRef<HTMLInputElement>(null);
  const typeArRef = useRef<HTMLInputElement>(null);
  const typeEnRef = useRef<HTMLInputElement>(null);
  const typePriceRef = useRef<HTMLInputElement>(null);

  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [activeExtraTab, setActiveExtraTab] = useState<'sizes' | 'types' | 'addons'>('sizes');
  const [addonSearchTerm, setAddonSearchTerm] = useState("");
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
    setEditId(0);
    if (containerRef.current) containerRef.current.style.display = "none";
    setSizes([]);
    setTypes([]);
    setSelectedAddonGroupIds([]);
    setShowExtrasModal(false);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
  }, []);

  const handleSave = useCallback(async (formData?: FormData) => {
    const data = formData || new FormData(formRef.current!);
    data.set("Id", String(editId));
    data.set("sizesJson", JSON.stringify(sizes));
    data.set("typesJson", JSON.stringify(types));
    data.set("linkedAddonGroupsJson", JSON.stringify(selectedAddonGroupIds));

    // Check if we have minimal data before auto-saving
    if (!data.get("NameAr") && !data.get("NameEn")) return;

    setIsSaving(true);
    const result: ActionResult = await saveProductAction(data);
    setIsSaving(false);

    if (autoSaveTimerRef.current) autoSaveTimerRef.current = null;

    if (result.success) {
      if (!formData) {
        // Auto-save logic
        console.log("Auto-saved product", editId);
        router.refresh();
      } else {
        showToast(editId === 0 ? "Product created successfully!" : "Product updated successfully!");
        resetForm();
        router.refresh();
      }
    } else {
      showToast(result.error || "Failed to save product.", "error");
    }
  }, [editId, sizes, types, selectedAddonGroupIds, resetForm, router, showToast]);

  const handleFormChange = useCallback(() => {
    if (editId === 0) return; // Only auto-save existing products
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 2000); // 2 second debounce
  }, [editId, handleSave]);

  // Skip auto-save during initial data loading
  const skipAutoSaveRef = useRef(false);

  // Wrapped setters that trigger auto-save only if not currently loading
  const updateSizes = (val: SizeEntry[] | ((prev: SizeEntry[]) => SizeEntry[])) => {
    setSizes(val);
    if (!skipAutoSaveRef.current) handleFormChange();
  };
  const updateTypes = (val: TypeEntry[] | ((prev: TypeEntry[]) => TypeEntry[])) => {
    setTypes(val);
    if (!skipAutoSaveRef.current) handleFormChange();
  };
  const updateAddons = (val: number[] | ((prev: number[]) => number[])) => {
    setSelectedAddonGroupIds(val);
    if (!skipAutoSaveRef.current) handleFormChange();
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

      // Prevent auto-save while we're populating the form
      skipAutoSaveRef.current = true;

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

      setSelectedAddonGroupIds((data.addonGroups || []).map((g: any) => g.id));

      containerRef.current.style.display = "block";
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

      // Re-enable auto-save after the form is ready
      setTimeout(() => {
        skipAutoSaveRef.current = false;
      }, 500);
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
      setSelectedAddonGroupIds([]);
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
    updateSizes((prev) => [...prev, { NameAr: nameAr, NameEn: nameEn, Price: price }]);
    if (sizeArRef.current) sizeArRef.current.value = "";
    if (sizeEnRef.current) sizeEnRef.current.value = "";
    if (sizePriceRef.current) sizePriceRef.current.value = "";
  };

  const addType = () => {
    const nameAr = typeArRef.current?.value.trim() || "";
    const nameEn = typeEnRef.current?.value.trim() || "";
    const price = parseFloat(typePriceRef.current?.value || "") || 0;
    if (!nameAr && !nameEn) return;
    updateTypes((prev) => [...prev, { NameAr: nameAr, NameEn: nameEn, Price: price, Description: null }]);
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
        <div className="admin-form-container">
          <form ref={formRef} action={handleSave} onChange={handleFormChange}>
            <input type="hidden" name="Id" value={editId} readOnly />

            {/* Section 1: Identity */}
            <div className="form-section">
              <div className="form-section-title">📦 {t('productIdentity') || 'Product Identity'}</div>
              <div className="form-row">
                <div className="premium-input-group">
                  <label>{t('nameAr')}</label>
                  <input name="NameAr" className="premium-input" required onChange={handleFormChange} />
                </div>
                <div className="premium-input-group">
                  <label>{t('nameEn')}</label>
                  <input name="NameEn" className="premium-input" required onChange={handleFormChange} />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: '15px' }}>
                <div className="premium-input-group">
                  <label>{t('descAr')}</label>
                  <textarea name="DescriptionAr" className="premium-textarea" rows={2} onChange={handleFormChange} />
                </div>
                <div className="premium-input-group">
                  <label>{t('descEn')}</label>
                  <textarea name="DescriptionEn" className="premium-textarea" rows={2} onChange={handleFormChange} />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Sorting */}
            <div className="form-section">
              <div className="form-section-title">💰 {t('pricingAndOrganization') || 'Pricing & Sorting'}</div>
              <div className="form-row-3">
                <div className="premium-input-group">
                  <label>Base Price</label>
                  <input type="number" name="BasePrice" className="premium-input" step="0.01" min="0" defaultValue="0" required onChange={handleFormChange} />
                </div>
                <div className="premium-input-group">
                  <label>Discount %</label>
                  <input type="number" name="Discount" className="premium-input" step="0.01" min="0" max="100" defaultValue="0" onChange={handleFormChange} />
                </div>
                <div className="premium-input-group">
                  <label>Sort Order</label>
                  <input type="number" name="SortOrder" className="premium-input" defaultValue="0" onChange={handleFormChange} />
                </div>
              </div>
            </div>

            {/* Section 3: Classification & Logic */}
            <div className="form-section">
              <div className="form-section-title">📂 {t('classification') || 'Classification & Location'}</div>
              <div className="form-row">
                <div className="premium-input-group">
                  <label>Category</label>
                  <select name="CategoryId" className="premium-select" required defaultValue="" onChange={handleFormChange}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option value={cat.id} key={cat.id}>
                        {cat.nameEn} ({cat.branch?.nameEn ?? "Global"})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="premium-input-group">
                  <label>Specific Branch</label>
                  <select name="BranchId" className="premium-select" defaultValue="" onChange={handleFormChange}>
                    <option value="">— (Category Default)</option>
                    {branches.map((branch) => (
                      <option value={branch.id} key={branch.id}>{branch.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Advanced Extras */}
            <div className="form-section">
              <div className="form-section-title">✨ {t('customization') || 'Smart Customization'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
                <button
                  type="button"
                  className="extras-smart-btn"
                  onClick={() => setShowExtrasModal(true)}
                >
                  🛠️ {t('extrasAndAddons') || 'Configure Extras & Add-ons'}
                  <span className="extras-count">
                    {sizes.length + types.length + selectedAddonGroupIds.length}
                  </span>
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label className="status-chip">
                    <input type="checkbox" name="AllBranches" defaultChecked onChange={handleFormChange} />
                    <span>Global</span>
                  </label>
                  <label className="status-chip">
                    <input type="checkbox" name="IsActive" defaultChecked onChange={handleFormChange} />
                    <span>Active</span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <label className="status-chip" style={{ flex: 1 }}>
                  <input type="checkbox" name="HasMealOption" onChange={handleFormChange} />
                  <span>Meal Support</span>
                </label>
                <label className="status-chip" style={{ flex: 1 }}>
                  <input type="checkbox" name="HasDonenessOption" onChange={handleFormChange} />
                  <span>Doneness (Meat)</span>
                </label>
              </div>
            </div>

            {/* Section 5: Media */}
            <div className="form-section">
              <div className="form-section-title">🖼️ {t('productMedia') || 'Product Media'}</div>
              <div className="image-upload-card" onClick={() => formRef.current?.querySelector<HTMLInputElement>('input[name="productImage"]')?.click()}>
                <div style={{ fontSize: '30px', marginBottom: '5px' }}>📸</div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#666' }}>Click to upload product image</div>
                <input type="file" name="productImage" accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>

            <div className="save-bar">
              {isSaving && (
                <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="spinner-mini"></span> {t('saving') || 'Syncing changes...'}
                </span>
              )}
              <button type="button" className="btn btn-outline" style={{ borderRadius: '12px', padding: '12px 25px' }} onClick={resetForm}>Discard</button>
              <AdminSubmitButton label={editId ? "Update Product" : "Create Product"} pendingLabel="Saving…" />
            </div>
          </form>
        </div>
      </div>

      {/* Nice Extras Modal */}
      {showExtrasModal && (
        <div className="extras-modal-overlay">
          <div className="extras-modal-container">
            <div className="extras-modal-header">
              <h3>{t('manageExtras') || 'Product Customization'}</h3>
              <button onClick={() => setShowExtrasModal(false)} className="close-btn">&times;</button>
            </div>

            <div className="extras-modal-tabs">
              {(['sizes', 'types', 'addons'] as const).map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeExtraTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveExtraTab(tab)}
                >
                  {tab === 'sizes' ? 'Sizes' : tab === 'types' ? 'Types' : 'Addon Groups'}
                </button>
              ))}
            </div>

            <div className="extras-modal-body">
              {activeExtraTab === 'sizes' && (
                <div className="extra-tab-content">
                  <div className="extra-list">
                    {sizes.map((s, i) => (
                      <div key={i} className="extra-item">
                        <span className="item-name">{s.NameAr} / {s.NameEn}</span>
                        <div className="item-actions">
                          <span className="item-price">{s.Price}</span>
                          <button type="button" className="remove-btn" onClick={() => updateSizes((prev) => prev.filter((_, idx) => idx !== i))}>&times;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="extra-form-row">
                    <input ref={sizeArRef} placeholder="Arabic" />
                    <input ref={sizeEnRef} placeholder="English" />
                    <div className="input-with-button">
                      <input ref={sizePriceRef} type="number" step="0.1" placeholder="Price" />
                      <button type="button" onClick={addSize} className="add-btn">+</button>
                    </div>
                  </div>
                </div>
              )}

              {activeExtraTab === 'types' && (
                <div className="extra-tab-content">
                  <div className="extra-list">
                    {types.map((t, i) => (
                      <div key={i} className="extra-item">
                        <span className="item-name">{t.NameAr} / {t.NameEn}</span>
                        <div className="item-actions">
                          <span className="item-price">{t.Price}</span>
                          <button type="button" className="remove-btn" onClick={() => updateTypes((prev) => prev.filter((_, idx) => idx !== i))}>&times;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="extra-form-row">
                    <input ref={typeArRef} placeholder="Arabic" />
                    <input ref={typeEnRef} placeholder="English" />
                    <div className="input-with-button">
                      <input ref={typePriceRef} type="number" step="0.1" placeholder="Price" />
                      <button type="button" onClick={addType} className="add-btn">+</button>
                    </div>
                  </div>
                </div>
              )}

              {activeExtraTab === 'addons' && (
                <div className="extra-tab-content">
                  <div style={{ marginBottom: '15px' }}>
                    <input 
                      type="text" 
                      placeholder="Search groups (e.g. Without, Drinks...)" 
                      className="premium-input"
                      style={{ padding: '10px 15px', borderRadius: '12px' }}
                      value={addonSearchTerm}
                      onChange={(e) => setAddonSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="addons-scroll-area" style={{ maxHeight: '400px', overflowY: 'auto', padding: '5px' }}>
                    {(() => {
                      const filtered = addonGroups.filter(g => 
                        (g.nameAr || '').includes(addonSearchTerm) || 
                        (g.nameEn || '').toLowerCase().includes(addonSearchTerm.toLowerCase()) ||
                        (g.groupType || '').toLowerCase().includes(addonSearchTerm.toLowerCase())
                      );
                      
                      const groupsByType: Record<string, typeof filtered> = {};
                      filtered.forEach(g => {
                        const type = g.groupType || 'Other';
                        if (!groupsByType[type]) groupsByType[type] = [];
                        groupsByType[type].push(g);
                      });

                      return Object.entries(groupsByType).map(([type, items]) => (
                        <div key={type} style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {type} <div style={{ flex: 1, height: '1px', background: 'rgba(var(--primary-rgb), 0.1)' }}></div>
                          </div>
                          <div className="addons-grid">
                            {items.map(group => {
                              const isSelected = selectedAddonGroupIds.includes(group.id);
                              return (
                                <label key={group.id} className={`addon-label ${isSelected ? 'selected' : ''}`}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) updateAddons(prev => [...prev, group.id]);
                                      else updateAddons(prev => prev.filter(id => id !== group.id));
                                    }}
                                  />
                                  <span className="addon-name">{group.nameAr || group.nameEn}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>

            <div className="extras-modal-footer">
              <button
                onClick={() => setShowExtrasModal(false)}
                className="done-btn"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive" style={{ marginTop: 20 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Extras</th>
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
                    style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </td>
                <td>
                  <div className="font-bold">{product.nameAr} / {product.nameEn}</div>
                  {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
                </td>
                <td><span className="category-tag">{product.category?.nameEn || "No Category"}</span></td>
                <td><span className="price-text">{Number(product.basePrice || 0).toFixed(0)}{settings?.currencySymbol}</span></td>
                <td>
                  <div className="flex gap-1">
                    {product.sizes && product.sizes.length > 0 && <span className="badge-s">S:{product.sizes.length}</span>}
                    {product.types && product.types.length > 0 && <span className="badge-t">T:{product.types.length}</span>}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-outline btn-sm" style={{ border: 'none', background: '#f5f5f5' }} onClick={() => editProduct(product)}>
                      {t('edit')}
                    </button>
                    <form action={handleDelete} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={product.id} />
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
        .admin-form-container {
          background: #fff;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
          margin-bottom: 30px;
          animation: slideDown 0.4s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-section {
          margin-bottom: 30px;
        }
        .form-section-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #999;
          font-weight: 800;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-section-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }
        
        .discount-badge {
          background: #ff4757;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(255, 71, 87, 0.3);
          display: inline-block;
          margin-top: 4px;
        }
        .price-text {
          font-weight: 800;
          color: #2f3542;
          font-size: 16px;
        }
        .category-tag {
          background: #f1f2f6;
          color: #57606f;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
        }
        .premium-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .premium-input-group label {
          font-size: 13px;
          font-weight: 700;
          color: #444;
          margin-inline-start: 4px;
        }
        .premium-input, .premium-select, .premium-textarea {
          width: 100%;
          padding: 12px 16px;
          background: #fdfdfd;
          border: 2px solid #f0f0f0;
          border-radius: 14px;
          font-size: 15px;
          color: #111;
          transition: 0.3s;
          outline: none;
        }
        .premium-input:focus, .premium-select:focus, .premium-textarea:focus {
          border-color: var(--primary);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
        }
        
        .image-upload-card {
          width: 100%;
          border: 2px dashed #e0e0e0;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: 0.3s;
          background: #fafafa;
        }
        .image-upload-card:hover {
          border-color: var(--primary);
          background: rgba(var(--primary-rgb), 0.02);
        }
        
        .extras-smart-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
          color: #fff;
          border: none;
          border-radius: 18px;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);
        }
        .extras-smart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.3);
        }
        .extras-count {
          background: var(--primary);
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 12px;
        }
        
        .status-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.2s;
        }
        .status-chip:hover { background: #f9f9f9; }
        .status-chip input { width: 18px; height: 18px; accent-color: var(--primary); }
        .status-chip span { font-weight: 700; font-size: 14px; }

        .extras-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          padding: 20px;
        }
        .extras-modal-container {
          width: 100%;
          max-width: 600px;
          background: #fff;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalEnter 0.3s ease-out;
        }
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .extras-modal-header {
          padding: 25px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .extras-modal-header h3 { font-weight: 900; margin: 0; font-size: 1.4rem; }
        .close-btn { background: #f5f5f5; border: none; width: 36px; height: 36px; border-radius: 12px; font-size: 1.5rem; cursor: pointer; color: #666; display: flex; align-items: center; justify-content: center; }
        
        .extras-modal-tabs { display: flex; padding: 10px; background: #f9f9f9; border-bottom: 1px solid #eee; gap: 8px; }
        .tab-btn { flex: 1; padding: 12px; border: none; background: transparent; font-weight: 800; color: #777; cursor: pointer; border-radius: 12px; transition: 0.3s; }
        .tab-btn.active { color: #fff; background: var(--primary); box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3); }
        
        .extras-modal-body { padding: 25px; max-height: 60vh; overflow-y: auto; }
        .extra-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .extra-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #fff; border: 1px solid #eee; border-radius: 16px; transition: 0.2s; }
        .extra-item:hover { border-color: #ddd; transform: translateX(5px); }
        .item-name { font-weight: 800; font-size: 0.95rem; }
        .item-actions { display: flex; align-items: center; gap: 12px; }
        .item-price { font-weight: 900; color: var(--primary); background: rgba(var(--primary-rgb), 0.05); padding: 4px 10px; border-radius: 10px; }
        .remove-btn { color: #ff4d4d; border: none; background: #fff1f1; width: 28px; height: 28px; border-radius: 8px; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        .extra-form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .extra-form-row input { padding: 14px; border: 2px solid #f0f0f0; border-radius: 14px; font-size: 14px; font-weight: 600; outline: none; }
        .extra-form-row input:focus { border-color: var(--primary); }
        .add-btn { background: #000; color: #fff; border: none; min-width: 48px; border-radius: 14px; cursor: pointer; font-size: 1.5rem; }
        
        .addons-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .addon-label { display: flex; align-items: center; gap: 10px; padding: 15px; border: 2px solid #f0f0f0; border-radius: 16px; cursor: pointer; transition: 0.3s; }
        .addon-label.selected { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.03); }
        .addon-name { font-size: 14px; font-weight: 800; }
        
        .save-bar {
          position: sticky;
          bottom: -2px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 15px;
          margin: 0 -30px -30px;
          border-radius: 0 0 24px 24px;
        }

        .category-tag { font-size: 12px; font-weight: 800; color: #666; background: #f0f0f0; padding: 4px 10px; border-radius: 20px; }
        .badge-s { background: #eff6ff; color: #2563eb; font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 800; }
        .badge-t { background: #ecfdf5; color: #059669; font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 800; }
        .spinner-mini { width: 14px; height: 14px; border: 2px solid rgba(var(--primary-rgb), 0.2); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
