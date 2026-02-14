import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ kitchens: [], menuItems: [] });
    }

    const query = q.trim();

    const [kitchens, menuItems] = await Promise.all([
      prisma.kitchen.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          cuisineTypes: true,
          city: true,
          imageUrl: true,
        },
        take: 10,
      }),
      prisma.menuItem.findMany({
        where: {
          isAvailable: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          imageUrl: true,
          kitchen: {
            select: { id: true, name: true, slug: true },
          },
        },
        take: 20,
      }),
    ]);

    return NextResponse.json({ kitchens, menuItems });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
