"use client";

import { useToast } from "@/components/admin/AdminToast";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { updateProfileAction, changePasswordAction, type ActionResult } from "@/lib/actions";
import { useRef } from "react";

type Props = {
  user: {
    email: string;
    displayName: string;
  } | null;
};

export function AdminProfileTab({ user }: Props) {
  const { showToast } = useToast();
  const passwordFormRef = useRef<HTMLFormElement>(null);

  const handleUpdateProfile = async (formData: FormData) => {
    const result: ActionResult = await updateProfileAction(formData);
    if (result.success) {
      showToast("Profile updated successfully!");
    } else {
      showToast(result.error || "Failed to update profile.", "error");
    }
  };

  const handleChangePassword = async (formData: FormData) => {
    const result: ActionResult = await changePasswordAction(formData);
    if (result.success) {
      showToast("Password changed successfully!");
      passwordFormRef.current?.reset();
    } else {
      showToast(result.error || "Failed to change password.", "error");
    }
  };

  return (
    <div className="admin-profile-container" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
      <div className="admin-card">
        <h3 className="admin-card-title mb-4">إعدادات الحساب</h3>
        <form action={handleUpdateProfile}>
          <div className="form-group mb-3">
            <label>البريد الإلكتروني</label>
            <input name="Email" type="email" defaultValue={user?.email ?? ""} required />
          </div>
          <div className="form-group mb-4">
            <label>اسم العرض</label>
            <input name="DisplayName" type="text" defaultValue={user?.displayName ?? ""} required />
          </div>
          <AdminSubmitButton label="تحديث الحساب" pendingLabel="جاري التحديث..." />
        </form>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title mb-4">تغيير كلمة المرور</h3>
        <form ref={passwordFormRef} action={handleChangePassword}>
          <div className="form-group mb-3">
            <label>كلمة المرور الجديدة</label>
            <input name="NewPassword" type="password" required minLength={6} />
          </div>
          <div className="form-group mb-4">
            <label>تأكيد كلمة المرور الجديدة</label>
            <input name="ConfirmPassword" type="password" required minLength={6} />
          </div>
          <AdminSubmitButton label="تغيير كلمة المرور" pendingLabel="جاري التغيير..." variant="danger" />
        </form>
      </div>
    </div>
  );
}
