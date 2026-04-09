"use client";

import CheckoutForm from "./checkout-form";
import { Branch, SiteSettings } from "@/lib/types";

type Props = {
  branch: Branch;
  settings: SiteSettings;
  lang: string;
};

export default function CheckoutFormWrapper(props: Props) {
  return <CheckoutForm {...props} />;
}
