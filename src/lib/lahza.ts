import { SiteSettings } from "./types";

const LAHZA_API_BASE = "https://api.lahza.io";
const SECRET_KEY = process.env.LAHZA_SECRET_KEY;

export type LahzaInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type LahzaVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: any;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: any;
      risk_action: string;
    };
  };
};

export async function initializeLahzaTransaction(params: {
  email: string;
  amount: string; // amount as string (lowest unit)
  currency: "ILS" | "JOD" | "USD";
  reference?: string;
  callback_url?: string;
  mobile?: string;
  metadata?: any;
}): Promise<LahzaInitializeResponse> {
  console.log("Lahza Initialize Payload:", JSON.stringify(params, null, 2));

  const response = await fetch(`${LAHZA_API_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to initialize Lahza transaction");
  }

  return data;
}

export async function verifyLahzaTransaction(reference: string): Promise<LahzaVerifyResponse> {
  const response = await fetch(`${LAHZA_API_BASE}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to verify Lahza transaction");
  }

  return data;
}
