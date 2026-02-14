"use client";

import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart";

interface CartSummaryProps {
  deliveryFee?: number;
  platformFee?: number;
  taxRate?: number;
  discount?: number;
}

export function CartSummary({
  deliveryFee = 4.99,
  platformFee,
  taxRate = 0.0825,
  discount = 0,
}: CartSummaryProps) {
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const subtotal = getTotalAmount();
  const calculatedPlatformFee = platformFee ?? subtotal * 0.05;
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * (discount / 100);
  const total =
    subtotal + calculatedPlatformFee + deliveryFee + tax - discountAmount;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount ({discount}%)</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Platform fee</span>
        <span>${calculatedPlatformFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Delivery</span>
        <span>
          {deliveryFee === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            `$${deliveryFee.toFixed(2)}`
          )}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold text-base">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
