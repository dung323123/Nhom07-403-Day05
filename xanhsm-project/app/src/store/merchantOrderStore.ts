/**
 * Merchant order store — manages order list and store open/closed status.
 * Seeded from merchant_orders.json; mutations are in-memory for the session.
 */
"use client";
import { create } from "zustand";
import type { MerchantOrder } from "@/types";
import ordersData from "@/data/merchant/merchant_orders.json";

interface MerchantOrderState {
  orders: MerchantOrder[];
  storeStatus: "open" | "closed";

  /** Toggle store open/closed */
  toggleStoreStatus: () => void;
  /** Accept a single new order → moves to confirmed */
  acceptOrder: (id: string) => void;
  /** Accept all new orders at once */
  acceptAll: () => void;
  /** Mark a confirmed order as done → moves to history_done */
  completeOrder: (id: string) => void;
  /** Mark a confirmed order as refunded → moves to history_cancelled */
  refundOrder: (id: string, reason: string) => void;
}

export const useMerchantOrderStore = create<MerchantOrderState>((set) => ({
  orders: ordersData.orders as MerchantOrder[],
  storeStatus: "open",

  toggleStoreStatus: () =>
    set((s) => ({
      storeStatus: s.storeStatus === "open" ? "closed" : "open",
    })),

  acceptOrder: (id) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status: "confirmed", driverNote: "Đang thực hiện" } : o
      ),
    })),

  acceptAll: () =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.status === "new"
          ? { ...o, status: "confirmed", driverNote: "Đang thực hiện" }
          : o
      ),
    })),

  completeOrder: (id) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status: "history_done", driverNote: "Hoàn thành" } : o
      ),
    })),

  refundOrder: (id, _reason) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, status: "history_cancelled", driverNote: "Đã huỷ" } : o
      ),
    })),
}));
