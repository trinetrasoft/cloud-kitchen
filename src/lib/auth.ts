import { prisma } from "./prisma";

const hasClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("placeholder") &&
  process.env.CLERK_SECRET_KEY?.startsWith("sk_") &&
  !process.env.CLERK_SECRET_KEY?.includes("placeholder");

export async function getAuthUser() {
  if (hasClerkKeys) {
    const { auth } = await import("@clerk/nextjs/server");
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;
    return prisma.user.findUnique({ where: { clerkId } });
  }

  // Demo mode: return the demo customer
  return prisma.user.findFirst({
    where: { email: "customer@trinetra.com" },
  });
}
