"use client";

import { useCartStore } from "@/stores/cart";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateSpecialInstructions = useCartStore(
    (state) => state.updateSpecialInstructions
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const getKitchenGroups = useCartStore((state) => state.getKitchenGroups);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const getItemCount = useCartStore((state) => state.getItemCount);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateSpecialInstructions,
    clearCart,
    getKitchenGroups,
    getTotalAmount,
    getItemCount,
  };
}
