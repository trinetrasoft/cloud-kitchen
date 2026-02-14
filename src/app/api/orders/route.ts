import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const hasStripeKeys =
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_") &&
  !process.env.STRIPE_SECRET_KEY?.includes("placeholder");

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            kitchen: { select: { name: true } },
            menuItem: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        kitchenName: item.kitchen.name,
        menuItemName: item.menuItem.name,
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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
    const { items, deliveryAddress, specialInstructions } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const platformFee = Math.round(totalAmount * 0.05 * 100) / 100;
    const deliveryFee = 4.99;
    const taxAmount = Math.round(totalAmount * 0.0825 * 100) / 100;
    const finalAmount =
      Math.round(
        (totalAmount + platformFee + deliveryFee + taxAmount) * 100
      ) / 100;

    let paymentIntentId: string | null = null;
    let clientSecret: string | null = null;

    // Create Stripe Payment Intent only if Stripe is configured
    if (hasStripeKeys) {
      const { stripe } = await import("@/lib/stripe");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100),
        currency: "usd",
        metadata: { userId: user.id },
      });
      paymentIntentId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret;
    } else {
      paymentIntentId = `demo_pi_${Date.now()}`;
    }

    // Create order
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        orderType: "REGULAR",
        status: hasStripeKeys ? "PENDING" : "CONFIRMED",
        totalAmount,
        platformFee,
        deliveryFee,
        taxAmount,
        finalAmount,
        deliveryAddress: deliveryAddress || {},
        specialInstructions,
        paymentIntentId,
        paymentStatus: hasStripeKeys ? "PENDING" : "PAID",
        items: {
          create: items.map(
            (item: {
              kitchenId: string;
              menuItemId: string;
              quantity: number;
              price: number;
              specialInstructions?: string;
            }) => ({
              kitchenId: item.kitchenId,
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              priceAtTime: item.price,
              specialInstructions: item.specialInstructions,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      order,
      clientSecret,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
