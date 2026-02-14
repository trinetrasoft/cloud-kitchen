import Link from "next/link";
import { ArrowRight, ChefHat, ShoppingBag, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/shared/SearchBar";
import { CUISINE_TYPES } from "@/types";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Authentic Indian Food from{" "}
              <span className="text-orange-600">50+ Cloud Kitchens</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Order dal from Kitchen A, dosa from Kitchen B, and dessert from
              Kitchen C - all in a single order. Delivered fresh to your door.
            </p>
            <SearchBar className="max-w-xl mx-auto mb-6" />
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/kitchens">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Browse Kitchens
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="lg" variant="outline">
                  View Subscription Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Choose Your Kitchens</h3>
              <p className="text-sm text-muted-foreground">
                Browse 50+ verified home kitchens specializing in different
                regional Indian cuisines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Build Your Order</h3>
              <p className="text-sm text-muted-foreground">
                Add items from multiple kitchens into a single cart. Mix and
                match to your heart&apos;s content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Get It Delivered</h3>
              <p className="text-sm text-muted-foreground">
                Everything arrives together in one delivery. Hot, fresh, and
                authentic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Explore by Cuisine
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {CUISINE_TYPES.map((cuisine) => (
              <Link
                key={cuisine.value}
                href={`/kitchens?cuisine=${cuisine.value}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
                  <CardContent className="p-4">
                    <span className="text-sm font-medium">
                      {cuisine.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Star className="h-10 w-10 mx-auto mb-4 fill-white" />
          <h2 className="text-3xl font-bold mb-4">
            Save Up to 25% with a Subscription
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Get exclusive discounts, free delivery, and access to special
            menus. Plans start at just $9.99/month.
          </p>
          <Link href="/subscription">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              See Subscription Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
