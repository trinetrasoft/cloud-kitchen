"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
  getKitchenGroups: () => Record<string, CartItem[]>;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.menuItemId === item.menuItemId &&
              i.kitchenId === item.kitchenId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, id: crypto.randomUUID() },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),

      updateSpecialInstructions: (id, instructions) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getKitchenGroups: () => {
        const items = get().items;
        return items.reduce(
          (groups, item) => {
            const kitchenId = item.kitchenId;
            if (!groups[kitchenId]) {
              groups[kitchenId] = [];
            }
            groups[kitchenId].push(item);
            return groups;
          },
          {} as Record<string, CartItem[]>
        );
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
