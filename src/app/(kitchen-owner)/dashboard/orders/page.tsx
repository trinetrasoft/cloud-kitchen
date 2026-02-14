"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KitchenOrder {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  items: { name: string; quantity: number; specialInstructions?: string }[];
  totalAmount: number;
  createdAt: string;
}

// Placeholder data for demo
const DEMO_ORDERS: KitchenOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-ABC123",
    status: "PENDING",
    customerName: "John D.",
    items: [
      { name: "Butter Chicken", quantity: 2 },
      { name: "Garlic Naan", quantity: 4, specialInstructions: "Extra crispy" },
    ],
    totalAmount: 38.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    orderNumber: "ORD-DEF456",
    status: "PREPARING",
    customerName: "Sarah M.",
    items: [
      { name: "Paneer Tikka", quantity: 1 },
      { name: "Dal Makhani", quantity: 1 },
      { name: "Jeera Rice", quantity: 2 },
    ],
    totalAmount: 45.0,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "3",
    orderNumber: "ORD-GHI789",
    status: "READY",
    customerName: "Priya R.",
    items: [{ name: "Biryani Family Pack", quantity: 1 }],
    totalAmount: 28.99,
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
];

const STATUS_ACTIONS: Record<
  string,
  { label: string; next: string; icon: React.ElementType }
> = {
  PENDING: { label: "Accept Order", next: "CONFIRMED", icon: CheckCircle2 },
  CONFIRMED: {
    label: "Start Preparing",
    next: "PREPARING",
    icon: ChefHat,
  },
  PREPARING: { label: "Mark as Ready", next: "READY", icon: Package },
};

export default function KitchenOrdersPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(DEMO_ORDERS);

  const updateStatus = async (orderId: string, newStatus: string) => {
    // In production, this would call the API
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const rejectOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "CANCELED" } : o
      )
    );
  };

  const filterOrders = (status: string) => {
    if (status === "all") return orders;
    return orders.filter((o) => o.status === status);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Orders</h1>
      <p className="text-muted-foreground mb-8">
        Manage incoming and active orders
      </p>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="PENDING">
            Pending ({filterOrders("PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="PREPARING">
            Preparing ({filterOrders("PREPARING").length})
          </TabsTrigger>
          <TabsTrigger value="READY">
            Ready ({filterOrders("READY").length})
          </TabsTrigger>
        </TabsList>

        {["all", "PENDING", "PREPARING", "READY"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="space-y-4">
              {filterOrders(tab).map((order) => {
                const action = STATUS_ACTIONS[order.status];
                return (
                  <Card key={order.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              #{order.orderNumber}
                            </span>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.customerName} &middot;{" "}
                            {new Date(order.createdAt).toLocaleTimeString(
                              "en-US",
                              { hour: "numeric", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                        <span className="font-semibold">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            {item.specialInstructions && (
                              <span className="text-muted-foreground ml-2">
                                ({item.specialInstructions})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {action && (
                          <Button
                            className="bg-orange-600 hover:bg-orange-700"
                            size="sm"
                            onClick={() =>
                              updateStatus(order.id, action.next)
                            }
                          >
                            <action.icon className="h-4 w-4 mr-1" />
                            {action.label}
                          </Button>
                        )}
                        {order.status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => rejectOrder(order.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        )}
                        {order.status === "READY" && (
                          <Badge className="bg-green-100 text-green-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Waiting for pickup
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filterOrders(tab).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No orders in this category.
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
