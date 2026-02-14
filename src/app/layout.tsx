import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trinetra - Authentic Indian Food from Cloud Kitchens",
  description:
    "Order authentic regional Indian food from 50+ cloud kitchens in a single order. Subscription-based savings with free delivery.",
  keywords: [
    "Indian food delivery",
    "cloud kitchen",
    "Indian cuisine",
    "food subscription",
    "Indian diaspora",
  ],
};

// Force dynamic rendering so Clerk keys are only validated at runtime
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerkKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder");

  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );

  if (hasClerkKey) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
