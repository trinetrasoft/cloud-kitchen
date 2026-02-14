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

    const filtered = dietary
      ? menuItems.filter((item) => {
          const tags = item.dietaryTags as string[];
          return tags.includes(dietary);
        })
      : menuItems;

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
