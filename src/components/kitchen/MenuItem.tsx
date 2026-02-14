"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart";
import type { MenuItemType } from "@/types";

interface MenuItemProps {
  item: MenuItemType;
  kitchenId: string;
  kitchenName: string;
}

export function MenuItem({ item, kitchenId, kitchenName }: MenuItemProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(
    (i) => i.menuItemId === item.id && i.kitchenId === kitchenId
  );

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      kitchenId,
      kitchenName,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl ?? undefined,
    });
  };

  const spiceIndicator = (level: number) => {
    const indicators = [];
    for (let i = 0; i < level; i++) {
      indicators.push(
        <span key={i} className="text-red-500">
          *
        </span>
      );
    }
    return indicators;
  };

  return (
    <Card className="flex gap-4 p-4">
      {item.imageUrl && (
        <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {item.dietaryTags.includes("veg") && (
                <span className="inline-block w-4 h-4 border-2 border-green-600 rounded-sm">
                  <span className="block w-2 h-2 bg-green-600 rounded-full m-auto mt-0.5" />
                </span>
              )}
              {item.dietaryTags.includes("vegan") && (
                <span className="inline-block w-4 h-4 border-2 border-green-700 rounded-sm">
                  <span className="block w-2 h-2 bg-green-700 rounded-full m-auto mt-0.5" />
                </span>
              )}
              <h4 className="font-semibold truncate">{item.name}</h4>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {item.description}
              </p>
            )}
          </div>
          <span className="font-semibold text-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {item.spiceLevel && item.spiceLevel > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              Spice: {spiceIndicator(item.spiceLevel)}
            </span>
          )}
          {item.servingSize && (
            <Badge variant="outline" className="text-xs">
              {item.servingSize}
            </Badge>
          )}
          {item.isSeasonalSpecial && (
            <Badge className="text-xs bg-amber-500">Seasonal</Badge>
          )}
          {item.dietaryTags
            .filter((t) => t !== "veg" && t !== "vegan")
            .map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div>
        <div className="mt-3">
          {!item.isAvailable ? (
            <Badge variant="outline" className="text-muted-foreground">
              Unavailable
            </Badge>
          ) : cartItem ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (cartItem.quantity <= 1) {
                    removeItem(cartItem.id);
                  } else {
                    updateQuantity(cartItem.id, cartItem.quantity - 1);
                  }
                }}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-8 text-center font-medium">
                {cartItem.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  updateQuantity(cartItem.id, cartItem.quantity + 1)
                }
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
