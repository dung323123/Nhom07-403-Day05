/**
 * Merchant authentication store — phone-only login (no OTP).
 * Stores the logged-in phone number and auth state in memory.
 */
"use client";
import { create } from "zustand";

interface MerchantAuthState {
  isLoggedIn: boolean;
  phone: string;
  /** Log in with a phone number — no OTP required */
  login: (phone: string) => void;
  logout: () => void;
}

export const useMerchantAuthStore = create<MerchantAuthState>((set) => ({
  isLoggedIn: false,
  phone: "",

  login: (phone) => set({ isLoggedIn: true, phone }),

  logout: () => set({ isLoggedIn: false, phone: "" }),
}));
