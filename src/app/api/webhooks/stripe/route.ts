import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
          where: { paymentIntentId: paymentIntent.id },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
          where: { paymentIntentId: paymentIntent.id },
          data: {
            paymentStatus: "FAILED",
            status: "CANCELED",
          },
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;
        const tier = subscription.metadata.tier;

        if (userId && tier) {
          // In Stripe v20+, period info is on subscription items
          const firstItem = subscription.items?.data?.[0];
          const periodStart = firstItem?.current_period_start
            ? new Date(firstItem.current_period_start * 1000)
            : new Date();
          const periodEnd = firstItem?.current_period_end
            ? new Date(firstItem.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await prisma.subscription.upsert({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            update: {
              status:
                subscription.status === "active" ? "ACTIVE" : "PAUSED",
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
            create: {
              userId,
              tier: tier as "BASIC" | "FAMILY" | "PARTY_PRO",
              status: "ACTIVE",
              stripeSubscriptionId: subscription.id,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "CANCELED" },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
