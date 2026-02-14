"use client";

import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "@/components/order/OrderCard";
import { Loader2, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { orders, loading, error } = useOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-muted-foreground mb-8">
        Track and review your order history
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Your order history will appear here once you place your first order.
          </p>
          <Link href="/kitchens">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Browse Kitchens
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
