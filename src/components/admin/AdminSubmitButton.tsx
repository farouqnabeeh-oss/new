"use client";

import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  label?: string;
  pendingLabel?: string;
  className?: string;
  variant?: "primary" | "danger" | "outline";
  size?: "sm" | "md";
};

export function AdminSubmitButton({
  label = "Save",
  pendingLabel = "Saving…",
  className = "",
  variant = "primary",
  size = "md"
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  const btnClass = `btn btn-${variant}${size === "sm" ? " btn-sm" : ""} ${className}`.trim();

  return (
    <button type="submit" className={btnClass} disabled={pending}>
      {pending ? (
        <>
          <span className="spinner" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

type AdminDeleteButtonProps = {
  confirmMessage?: string;
  className?: string;
};

export function AdminDeleteButton({
  confirmMessage = "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
  className = ""
}: AdminDeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`btn btn-danger btn-sm ${className}`.trim()}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? <span className="spinner spinner-sm" /> : "Delete"}
    </button>
  );
}
