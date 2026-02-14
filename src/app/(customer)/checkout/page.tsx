"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/stores/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getKitchenGroups, clearCart } = useCartStore();
  const kitchenGroups = getKitchenGroups();
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No Items to Checkout</h1>
        <Link href="/kitchens">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Browse Kitchens
          </Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert("Please fill in your delivery address.");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        kitchenId: item.kitchenId,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          deliveryAddress: address,
          specialInstructions,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create order");
      }

      const data = await res.json();

      // In production, this would integrate with Stripe Elements
      // For now, we simulate a successful payment
      clearCart();
      router.push(`/orders/${data.order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main St, Apt 4B"
                  value={address.street}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, street: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, state: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="Zip"
                    value={address.zipCode}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, zipCode: e.target.value }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(kitchenGroups).map(
                ([kitchenId, kitchenItems]) => (
                  <div key={kitchenId} className="mb-4 last:mb-0">
                    <h4 className="font-medium text-orange-700 mb-2">
                      {kitchenItems[0].kitchenName}
                    </h4>
                    {kitchenItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm py-1"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requests or delivery instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <CartSummary />
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground mb-4">
                By placing this order, you agree to our terms of service. Payment
                will be processed via Stripe.
              </p>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
