"use client";

import { MenuItem } from "./MenuItem";
import type { MenuItemType } from "@/types";

interface MenuSectionProps {
  category: string;
  items: MenuItemType[];
  kitchenId: string;
  kitchenName: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  appetizer: "Appetizers",
  starter: "Starters",
  main: "Main Course",
  bread: "Breads",
  rice: "Rice & Biryani",
  dessert: "Desserts",
  beverage: "Beverages",
  side: "Sides",
  snack: "Snacks",
};

export function MenuSection({
  category,
  items,
  kitchenId,
  kitchenName,
}: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {CATEGORY_LABELS[category] || category}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            kitchenId={kitchenId}
            kitchenName={kitchenName}
          />
        ))}
      </div>
    </div>
  );
}
