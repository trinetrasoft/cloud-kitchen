"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          ${item.price.toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <span className="text-sm font-medium w-16 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  );
}
