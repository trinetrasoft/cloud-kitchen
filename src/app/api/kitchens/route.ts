import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get("cuisine");
    const region = searchParams.get("region");
    const q = searchParams.get("q");

    const kitchens = await prisma.kitchen.findMany({
      where: {
        isActive: true,
        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        reviews: {
          select: { overallRating: true },
        },
        _count: {
          select: { reviews: true, menuItems: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const kitchensWithRatings = kitchens
      .filter((kitchen) => {
        if (cuisine) {
          const types = kitchen.cuisineTypes as string[];
          if (!types.includes(cuisine)) return false;
        }
        if (region) {
          const tags = kitchen.regionTags as string[];
          if (!tags.includes(region)) return false;
        }
        return true;
      })
      .map((kitchen) => {
        const avgRating =
          kitchen.reviews.length > 0
            ? kitchen.reviews.reduce((sum, r) => sum + r.overallRating, 0) /
              kitchen.reviews.length
            : 0;

        const { reviews, _count, ...rest } = kitchen;
        return {
          ...rest,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: _count.reviews,
          menuItemCount: _count.menuItems,
        };
      });

    return NextResponse.json(kitchensWithRatings);
  } catch (error) {
    console.error("Error fetching kitchens:", error);
    return NextResponse.json(
      { error: "Failed to fetch kitchens" },
      { status: 500 }
    );
  }
}
