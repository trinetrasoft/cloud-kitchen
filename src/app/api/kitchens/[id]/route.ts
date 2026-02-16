import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const kitchen = await prisma.kitchen.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
        },
        reviews: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!kitchen) {
      return NextResponse.json(
        { error: "Kitchen not found" },
        { status: 404 }
      );
    }

    const avgRating =
      kitchen.reviews.length > 0
        ? kitchen.reviews.reduce((sum, r) => sum + r.overallRating, 0) /
          kitchen.reviews.length
        : 0;

    const toArray = (val: unknown): string[] =>
      Array.isArray(val) ? val : typeof val === "string" ? JSON.parse(val) : [];

    const normalizedMenuItems = kitchen.menuItems.map((item) => ({
      ...item,
      dietaryTags: toArray(item.dietaryTags),
      ingredients: toArray(item.ingredients),
      allergens: toArray(item.allergens),
    }));

    return NextResponse.json({
      ...kitchen,
      cuisineTypes: toArray(kitchen.cuisineTypes),
      regionTags: toArray(kitchen.regionTags),
      menuItems: normalizedMenuItems,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: kitchen._count.reviews,
    });
  } catch (error) {
    console.error("Error fetching kitchen:", error);
    return NextResponse.json(
      { error: "Failed to fetch kitchen" },
      { status: 500 }
    );
  }
}
