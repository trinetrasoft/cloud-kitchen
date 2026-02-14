"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { items, getKitchenGroups, getTotalAmount, getItemCount } =
    useCartStore();
  const kitchenGroups = getKitchenGroups();
  const total = getTotalAmount();
  const itemCount = getItemCount();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse our kitchens and add some delicious dishes!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(kitchenGroups).map(
                ([kitchenId, kitchenItems]) => (
                  <div key={kitchenId}>
                    <h3 className="font-semibold text-sm text-orange-700 mb-2">
                      {kitchenItems[0].kitchenName}
                    </h3>
                    <div className="space-y-1">
                      {kitchenItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                    <div className="text-right text-sm text-muted-foreground mt-1">
                      Subtotal: $
                      {kitchenItems
                        .reduce((s, i) => s + i.price * i.quantity, 0)
                        .toFixed(2)}
                    </div>
                    <Separator className="mt-3" />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery fee and taxes calculated at checkout
            </p>
            <Link href="/cart" className="block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" className="block">
              <Button variant="outline" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
