"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/stores/cart";

export default function CartPage() {
  const { items, getKitchenGroups, clearCart } = useCartStore();
  const kitchenGroups = getKitchenGroups();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Browse our kitchens and add some delicious dishes to your cart.
        </p>
        <Link href="/kitchens">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Browse Kitchens
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/kitchens"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>
        <Button
          variant="ghost"
          className="text-destructive"
          onClick={clearCart}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(kitchenGroups).map(([kitchenId, kitchenItems]) => (
            <Card key={kitchenId}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-700">
                  {kitchenItems[0].kitchenName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {kitchenItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kitchen subtotal</span>
                  <span className="font-medium">
                    $
                    {kitchenItems
                      .reduce((s, i) => s + i.price * i.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <CartSummary />
              <Link href="/checkout" className="block mt-6">
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
