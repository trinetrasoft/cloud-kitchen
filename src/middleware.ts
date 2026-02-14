import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hasClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder") &&
  process.env.CLERK_SECRET_KEY &&
  process.env.CLERK_SECRET_KEY.startsWith("sk_") &&
  !process.env.CLERK_SECRET_KEY.includes("placeholder");

export default async function middleware(req: NextRequest) {
  // If Clerk keys are configured, use Clerk middleware
  if (hasClerkKeys) {
    const { clerkMiddleware, createRouteMatcher } = await import(
      "@clerk/nextjs/server"
    );
    const isProtectedRoute = createRouteMatcher([
      "/checkout(.*)",
      "/orders(.*)",
      "/subscription(.*)",
      "/dashboard(.*)",
    ]);
    return clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect();
      }
    })(req, {} as any);
  }

  // Demo mode: allow all routes without auth
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
