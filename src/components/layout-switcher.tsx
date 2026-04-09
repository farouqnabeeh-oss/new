"use client";

import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

export default function LayoutSwitcher({ header, footer, children }: Props) {
  const pathname = usePathname();

  React.useEffect(() => {
    // Ensure Lucide icons are initialized on the client especially after route changes
    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }, [pathname]);

  // Define paths that should NOT have header and footer
  const isExcluded = pathname.startsWith("/Admin") || pathname.startsWith("/Account/Login") || pathname.startsWith("/checkout");

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
