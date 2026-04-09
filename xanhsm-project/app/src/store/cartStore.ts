/**
 * Zustand cart store — manages items, quantities, and totals.
 * All state is stored client-side only (no persistence needed for this hackathon mock).
 */
import { create } from "zustand";

export interface CartItem {
  /** Unique item id from menu_items.json */
  itemId: string;
  storeId: string;
  storeName: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  /** Optional special instructions from the user */
  note: string;
}

interface CartState {
  items: CartItem[];
  /** Add an item or increment qty if already in cart */
  addItem: (item: Omit<CartItem, "qty">) => void;
  /** Update quantity by delta (+1 / -1). Removes item when qty reaches 0. */
  updateQty: (itemId: string, delta: number) => void;
  /** Remove an item completely */
  removeItem: (itemId: string) => void;
  /** Update note for an item */
  updateNote: (itemId: string, note: string) => void;
  /** Clear all items */
  clearCart: () => void;
  /** Total number of individual items (sum of qty) */
  totalQty: () => number;
  /** Total price */
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.itemId === item.itemId);
      if (existing) {
        // Increment quantity for existing item
        return {
          items: state.items.map((i) =>
            i.itemId === item.itemId ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, qty: 1 }] };
    });
  },

  updateQty: (itemId, delta) => {
    set((state) => {
      const updated = state.items
        .map((i) =>
          i.itemId === itemId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0); // Remove if qty drops to 0
      return { items: updated };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.itemId !== itemId),
    }));
  },

  updateNote: (itemId, note) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId ? { ...i, note } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalQty: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
