import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const hasStripeKeys =
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_") &&
  !process.env.STRIPE_SECRET_KEY?.includes("placeholder");

const PRICE_IDS: Record<string, string> = {
  BASIC: process.env.STRIPE_BASIC_PRICE_ID || "price_basic",
  FAMILY: process.env.STRIPE_FAMILY_PRICE_ID || "price_family",
  PARTY_PRO: process.env.STRIPE_PARTY_PRO_PRICE_ID || "price_party_pro",
};

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tier } = body;

    if (!PRICE_IDS[tier]) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    if (hasStripeKeys) {
      const { stripe } = await import("@/lib/stripe");
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription?canceled=true`,
        metadata: { userId: user.id, tier },
      });
      return NextResponse.json({ url: session.url });
    }

    // Demo mode: create subscription directly
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier as "BASIC" | "FAMILY" | "PARTY_PRO",
        status: "ACTIVE",
        stripeSubscriptionId: `demo_sub_${Date.now()}`,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      url: `/subscription?success=true`,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
