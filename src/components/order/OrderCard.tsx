import Link from "next/link";
import { Clock, Package, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OrderSummary } from "@/types";

interface OrderCardProps {
  order: OrderSummary;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  READY: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELED: "Canceled",
};

export function OrderCard({ order }: OrderCardProps) {
  const kitchenNames = [
    ...new Set(order.items.map((item) => item.kitchenName)),
  ];

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold">#{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={STATUS_COLORS[order.status] || "bg-gray-100"}
                variant="secondary"
              >
                {STATUS_LABELS[order.status] || order.status}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1 mb-3">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.menuItemName}
                </span>
                <span className="text-muted-foreground">
                  ${(item.priceAtTime * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-muted-foreground">
                +{order.items.length - 3} more items
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>{kitchenNames.join(", ")}</span>
            </div>
            <span className="font-semibold">
              ${order.finalAmount.toFixed(2)}
            </span>
          </div>

          {order.estimatedDeliveryTime && order.status !== "DELIVERED" && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <Clock className="h-3.5 w-3.5" />
              <span>
                ETA:{" "}
                {new Date(order.estimatedDeliveryTime).toLocaleTimeString(
                  "en-US",
                  { hour: "numeric", minute: "2-digit" }
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
