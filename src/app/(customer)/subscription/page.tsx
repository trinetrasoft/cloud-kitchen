"use client";

import { useState } from "react";
import { Check, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS } from "@/types";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setLoading(tier);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create subscription");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to start subscription"
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <Star className="h-10 w-10 mx-auto mb-4 text-orange-600" />
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Save on every order with a Trinetra subscription. Get exclusive
          discounts, free delivery, and access to special menus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.tier}
            className={`relative ${
              plan.tier === "FAMILY"
                ? "border-orange-600 border-2 shadow-lg"
                : ""
            }`}
          >
            {plan.tier === "FAMILY" && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Badge variant="secondary" className="mt-2">
                {plan.discount}% off all orders
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.tier === "FAMILY"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }`}
                variant={plan.tier === "FAMILY" ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.tier)}
                disabled={loading !== null}
              >
                {loading === plan.tier ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>Cancel anytime. No commitment required.</p>
      </div>
    </div>
  );
}
