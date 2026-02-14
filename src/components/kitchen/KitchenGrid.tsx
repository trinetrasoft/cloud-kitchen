import { KitchenCard } from "./KitchenCard";
import type { KitchenWithRating } from "@/types";

interface KitchenGridProps {
  kitchens: KitchenWithRating[];
}

export function KitchenGrid({ kitchens }: KitchenGridProps) {
  if (kitchens.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No kitchens found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kitchens.map((kitchen) => (
        <KitchenCard key={kitchen.id} kitchen={kitchen} />
      ))}
    </div>
  );
}
