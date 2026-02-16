import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kitchenId = searchParams.get("kitchenId");
    const category = searchParams.get("category");
    const dietary = searchParams.get("dietary");
    const q = searchParams.get("q");

    const menuItems = await prisma.menuItem.findMany({
      where: {
        ...(kitchenId && { kitchenId }),
        ...(category && { category }),
        ...(q && {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        kitchen: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    const toArray = (val: unknown): string[] =>
      Array.isArray(val) ? val : typeof val === "string" ? JSON.parse(val) : [];

    const filtered = dietary
      ? menuItems.filter((item) => toArray(item.dietaryTags).includes(dietary))
      : menuItems;

    const normalized = filtered.map((item) => ({
      ...item,
      dietaryTags: toArray(item.dietaryTags),
      ingredients: toArray(item.ingredients),
      allergens: toArray(item.allergens),
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
