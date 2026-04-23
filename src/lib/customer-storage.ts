// lib/customer-storage.ts
// Utility for saving/loading customer info from localStorage

const KEY = "uptown_customer";

export interface SavedCustomer {
    name: string;
    phone: string;
    email: string;
    street: string;
    building: string;
    addressNotes: string;
    lastZone: string;
}

export function loadCustomer(): SavedCustomer | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw) as SavedCustomer;
    } catch {
        return null;
    }
}

export function saveCustomer(data: SavedCustomer) {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
        // localStorage unavailable — fail silently
    }
}