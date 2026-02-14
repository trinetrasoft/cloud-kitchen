"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MenuSection } from "@/components/kitchen/MenuSection";
import type { MenuItemType } from "@/types";

interface KitchenDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  story: string | null;
  cuisineTypes: string[];
  regionTags: string[];
  city: string;
  state: string;
  imageUrl: string | null;
  verificationStatus: string;
  hygieneScore: string | null;
  avgPrepTimeMinutes: number;
  avgRating: number;
  reviewCount: number;
  menuItems: MenuItemType[];
  reviews: {
    id: string;
    overallRating: number;
    reviewText: string | null;
    createdAt: string;
    user: { firstName: string; lastName: string };
  }[];
}

export default function KitchenDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [kitchen, setKitchen] = useState<KitchenDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKitchen() {
      try {
        const res = await fetch(`/api/kitchens/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setKitchen(data);
        }
      } catch (error) {
        console.error("Failed to fetch kitchen:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchKitchen();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!kitchen) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Kitchen Not Found</h1>
        <Link href="/kitchens">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Kitchens
          </Button>
        </Link>
      </div>
    );
  }

  // Group menu items by category
  const menuByCategory = kitchen.menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItemType[]>
  );

  const categoryOrder = [
    "appetizer",
    "starter",
    "main",
    "bread",
    "rice",
    "side",
    "dessert",
    "beverage",
    "snack",
  ];
  const sortedCategories = Object.keys(menuByCategory).sort(
    (a, b) =>
      (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) -
      (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
  );

  return (
    <div>
      {/* Kitchen Header */}
      <div className="relative h-64 md:h-80 bg-muted">
        {kitchen.imageUrl ? (
          <Image
            src={kitchen.imageUrl}
            alt={kitchen.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
            <span className="text-6xl">🍛</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <Link
              href="/kitchens"
              className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              All Kitchens
            </Link>
            <h1 className="text-3xl font-bold mb-2">{kitchen.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              {kitchen.avgRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {kitchen.avgRating.toFixed(1)}
                  </span>
                  <span className="text-white/80">
                    ({kitchen.reviewCount} reviews)
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-white/80">
                <MapPin className="h-4 w-4" />
                {kitchen.city}, {kitchen.state}
              </div>
              <div className="flex items-center gap-1 text-white/80">
                <Clock className="h-4 w-4" />
                {kitchen.avgPrepTimeMinutes} min avg prep
              </div>
              {kitchen.hygieneScore && (
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Hygiene: {kitchen.hygieneScore}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {kitchen.cuisineTypes.map((type: string) => (
            <Badge key={type} variant="secondary">
              {type.replace(/_/g, " ")}
            </Badge>
          ))}
          {kitchen.verificationStatus === "CERTIFIED" && (
            <Badge className="bg-green-600">Certified Kitchen</Badge>
          )}
        </div>

        {/* Description / Story */}
        {(kitchen.description || kitchen.story) && (
          <div className="mb-8">
            {kitchen.description && (
              <p className="text-muted-foreground mb-2">
                {kitchen.description}
              </p>
            )}
            {kitchen.story && (
              <p className="text-sm text-muted-foreground italic">
                {kitchen.story}
              </p>
            )}
          </div>
        )}

        <Separator className="mb-8" />

        {/* Menu & Reviews Tabs */}
        <Tabs defaultValue="menu">
          <TabsList>
            <TabsTrigger value="menu">
              Menu ({kitchen.menuItems.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({kitchen.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-6">
            {sortedCategories.map((category) => (
              <MenuSection
                key={category}
                category={category}
                items={menuByCategory[category]}
                kitchenId={kitchen.id}
                kitchenName={kitchen.name}
              />
            ))}
            {kitchen.menuItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No menu items available at the moment.
              </p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {kitchen.reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {review.user.firstName} {review.user.lastName[0]}.
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.overallRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.reviewText && (
                    <p className="text-sm text-muted-foreground">
                      {review.reviewText}
                    </p>
                  )}
                </div>
              ))}
              {kitchen.reviews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this kitchen!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
