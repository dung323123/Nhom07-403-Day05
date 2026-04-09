/**
 * Merchant menu store — manages categories, items, and topping groups.
 * Seeded from merchant_menu.json; mutations are in-memory for the session.
 */
"use client";
import { create } from "zustand";
import type {
  MerchantCategory,
  MerchantItem,
  MerchantItemStatus,
  MerchantToppingGroup,
  MerchantToppingOption,
} from "@/types";
import menuData from "@/data/merchant/merchant_menu.json";

interface MerchantMenuState {
  categories: MerchantCategory[];
  toppingGroups: MerchantToppingGroup[];
  aiLoading: boolean;

  /** Add a new category */
  addCategory: (name: string) => void;
  /** Rename an existing category */
  editCategory: (id: string, name: string) => void;
  /** Delete a category and all its items */
  deleteCategory: (id: string) => void;

  /** Add an item to a category */
  addItem: (categoryId: string, item: Omit<MerchantItem, "id">) => void;
  /** Update an existing item */
  editItem: (categoryId: string, item: MerchantItem) => void;
  /** Change item sell status */
  setItemStatus: (categoryId: string, itemId: string, status: MerchantItemStatus) => void;
  /** Remove an item */
  deleteItem: (categoryId: string, itemId: string) => void;

  /** Add a topping group */
  addToppingGroup: (name: string, options: Omit<MerchantToppingOption, "id">[]) => void;
  /** Update a topping group */
  editToppingGroup: (id: string, name: string, options: MerchantToppingOption[]) => void;
  /** Delete a topping group */
  deleteToppingGroup: (id: string) => void;

  /** Simulate AI smart menu — injects mock pre-filled data */
  generateAiMenu: () => void;
}

export const useMerchantMenuStore = create<MerchantMenuState>((set) => ({
  categories: menuData.categories as MerchantCategory[],
  toppingGroups: menuData.toppingGroups as MerchantToppingGroup[],
  aiLoading: false,

  addCategory: (name) =>
    set((s) => ({
      categories: [
        ...s.categories,
        { id: `cat-${Date.now()}`, name, items: [] },
      ],
    })),

  editCategory: (id, name) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === id ? { ...c, name } : c
      ),
    })),

  deleteCategory: (id) =>
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
    })),

  addItem: (categoryId, item) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: [...c.items, { ...item, id: `item-${Date.now()}` }] }
          : c
      ),
    })),

  editItem: (categoryId, item) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.map((i) => (i.id === item.id ? item : i)) }
          : c
      ),
    })),

  setItemStatus: (categoryId, itemId, status) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, status } : i
              ),
            }
          : c
      ),
    })),

  deleteItem: (categoryId, itemId) =>
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      ),
    })),

  addToppingGroup: (name, options) =>
    set((s) => ({
      toppingGroups: [
        ...s.toppingGroups,
        {
          id: `top-${Date.now()}`,
          name,
          options: options.map((o, idx) => ({
            ...o,
            id: `tp-new-${Date.now()}-${idx}`,
          })),
        },
      ],
    })),

  editToppingGroup: (id, name, options) =>
    set((s) => ({
      toppingGroups: s.toppingGroups.map((g) =>
        g.id === id ? { ...g, name, options } : g
      ),
    })),

  deleteToppingGroup: (id) =>
    set((s) => ({
      toppingGroups: s.toppingGroups.filter((g) => g.id !== id),
    })),

  generateAiMenu: () => {
    set({ aiLoading: true });
    setTimeout(() => {
      set((s) => ({
        aiLoading: false,
        categories: [
          ...s.categories,
          {
            id: `cat-ai-${Date.now()}`,
            name: "AI – Combo đặc biệt",
            items: [
              {
                id: `item-ai-${Date.now()}`,
                name: "Combo trà sữa + bánh mì",
                description: "Gợi ý từ AI: kết hợp bán chạy nhất",
                price: 65000,
                image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=70",
                status: "available" as const,
                toppingGroupIds: [],
              },
            ],
          },
        ],
      }));
    }, 1800);
  },
}));
