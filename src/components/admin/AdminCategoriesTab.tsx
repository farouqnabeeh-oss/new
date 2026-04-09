"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminTranslation } from "@/lib/useAdminTranslation";
import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton, AdminDeleteButton } from "@/components/admin/AdminSubmitButton";
import { saveCategoryAction, deleteCategoryAction, type ActionResult } from "@/lib/actions";
import type { Branch, Category } from "@/lib/types";

type Props = {
  categories: (Category & { branch?: Branch | null })[];
  branches: Branch[];
};

export function AdminCategoriesTab({ categories, branches }: Props) {
  const { t } = useAdminTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editId, setEditId] = useState(0);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
    setEditId(0);
    if (containerRef.current) containerRef.current.style.display = "none";
  }, []);

  const handleSave = async (formData: FormData) => {
    formData.set("Id", String(editId));
    const result: ActionResult = await saveCategoryAction(formData);
    if (result.success) {
      showToast(editId === 0 ? "Category created successfully!" : "Category updated successfully!");
      resetForm();
      router.refresh();
    } else {
      showToast(result.error || "Failed to save category.", "error");
    }
  };

  const handleDelete = async (formData: FormData) => {
    const result: ActionResult = await deleteCategoryAction(formData);
    if (result.success) {
      showToast("Category deleted successfully!");
      router.refresh();
    } else {
      showToast(result.error || "Failed to delete category.", "error");
    }
  };

  const editCategory = useCallback((cat: Category & { branch?: Branch | null }) => {
    if (!containerRef.current || !formRef.current) return;
    containerRef.current.style.display = "block";
    setEditId(cat.id);
    const form = formRef.current;
    (form.elements.namedItem("NameAr") as HTMLInputElement).value = cat.nameAr;
    (form.elements.namedItem("NameEn") as HTMLInputElement).value = cat.nameEn;
    (form.elements.namedItem("BranchId") as HTMLSelectElement).value = cat.branchId != null ? String(cat.branchId) : "";
    (form.elements.namedItem("SortOrder") as HTMLInputElement).value = String(cat.sortOrder);
    (form.elements.namedItem("IconClass") as HTMLInputElement).value = cat.iconClass ?? "";
    (form.elements.namedItem("IsActive") as HTMLInputElement).checked = cat.isActive;
    containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleForm = useCallback(() => {
    if (!containerRef.current) return;
    const isHidden = containerRef.current.style.display === "none";
    if (isHidden) {
      formRef.current?.reset();
      setEditId(0);
      (formRef.current?.elements.namedItem("IsActive") as HTMLInputElement).checked = true;
      containerRef.current.style.display = "block";
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      containerRef.current.style.display = "none";
    }
  }, []);

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">{t('manageCategories')}</h3>
        <button className="btn btn-primary" type="button" onClick={toggleForm}>
          {t('addCategory')}
        </button>
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
              <label>{t('branch')}</label>
              <select name="BranchId" defaultValue="">
                <option value="">{t('allBranches')}</option>
                {branches.map((branch) => (
                  <option value={branch.id} key={branch.id}>{branch.nameEn}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('order')}</label>
              <input type="number" name="SortOrder" defaultValue="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Icon (Lucide name)</label>
              <input name="IconClass" placeholder="e.g. utensils, coffee, pizza" />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" name="IsActive" value="true" defaultChecked /> Active
              </label>
            </div>
          </div>
          <AdminSubmitButton label={editId ? "Update Category" : "Save Category"} pendingLabel="Saving…" />
          <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={resetForm}>Cancel</button>
        </form>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('branch')}</th>
            <th>{t('order')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.nameAr} / {category.nameEn}</td>
              <td>{category.branch?.nameEn ?? "All"}</td>
              <td>{category.sortOrder}</td>
              <td>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => editCategory(category)}>
                  {t('edit')}
                </button>
                <form action={handleDelete} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={category.id} />
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
