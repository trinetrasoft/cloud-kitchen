"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  totalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  platformFee: number;
  taxAmount: number;
  finalAmount: number;
  deliveryAddress: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  specialInstructions: string | null;
  paymentStatus: string;
  createdAt: string;
  estimatedDeliveryTime: string | null;
  items: {
    id: string;
    quantity: number;
    priceAtTime: number;
    status: string;
    specialInstructions: string | null;
    kitchen: { name: string; slug: string; phone: string };
    menuItem: { name: string; imageUrl: string | null };
  }[];
}

const ORDER_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "On the Way", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          setOrder(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/orders">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex(
    (s) => s.key === order.status
  );
  const isCanceled = order.status === "CANCELED";

  // Group items by kitchen
  const kitchenGroups = order.items.reduce(
    (acc, item) => {
      const name = item.kitchen.name;
      if (!acc[name]) acc[name] = [];
      acc[name].push(item);
      return acc;
    },
    {} as Record<string, typeof order.items>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        All Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={
            isCanceled
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }
        >
          {order.paymentStatus}
        </Badge>
      </div>

      {/* Order Status Timeline */}
      {!isCanceled && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {ORDER_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isCurrent
                          ? "bg-orange-600 text-white"
                          : isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-xs text-center ${
                        isActive
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {isCanceled && (
        <Card className="mb-6 border-red-200">
          <CardContent className="pt-6 text-center">
            <Badge className="bg-red-100 text-red-800 mb-2">Canceled</Badge>
            <p className="text-sm text-muted-foreground">
              This order has been canceled.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(kitchenGroups).map(([kitchenName, items]) => (
            <div key={kitchenName} className="mb-4 last:mb-0">
              <h4 className="font-medium text-orange-700 mb-2">
                {kitchenName}
              </h4>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-1.5"
                >
                  <div>
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    {item.specialInstructions && (
                      <p className="text-xs text-muted-foreground">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <span>
                    ${(item.priceAtTime * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator className="my-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform fee</span>
            <span>${order.platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${order.taxAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>${order.finalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      {order.deliveryAddress && order.deliveryAddress.street && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {order.deliveryAddress.street}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
              {order.deliveryAddress.zipCode}
            </p>
            {order.specialInstructions && (
              <p className="text-sm text-muted-foreground mt-2">
                Instructions: {order.specialInstructions}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
