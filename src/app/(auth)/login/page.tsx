"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const hasClerkKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("placeholder");

  if (hasClerkKey) {
    // Dynamic import to avoid loading Clerk when not configured
    const ClerkSignIn = require("@clerk/nextjs").SignIn;
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="w-full max-w-md p-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600">Trinetra</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to order authentic Indian food
            </p>
          </div>
          <ClerkSignIn
            appearance={{
              elements: { rootBox: "mx-auto", card: "shadow-lg" },
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <ChefHat className="h-12 w-12 mx-auto text-orange-600 mb-3" />
          <h1 className="text-3xl font-bold text-orange-600">Trinetra</h1>
          <p className="text-muted-foreground mt-2">Demo Mode</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome to the Demo</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You&apos;re browsing in demo mode. All features are available
              without sign-in. Orders are placed as the demo customer.
            </p>
            <Link href="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Continue to Homepage
              </Button>
            </Link>
            <Link href="/kitchens">
              <Button variant="outline" className="w-full">
                Browse Kitchens
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
