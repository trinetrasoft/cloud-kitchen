"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/shared/SearchBar";
import { KitchenGrid } from "@/components/kitchen/KitchenGrid";
import { CUISINE_TYPES, DIETARY_TAGS } from "@/types";
import type { KitchenWithRating } from "@/types";

export default function KitchensPage() {
  const searchParams = useSearchParams();
  const [kitchens, setKitchens] = useState<KitchenWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState(
    searchParams.get("cuisine") || ""
  );
  const [selectedDietary, setSelectedDietary] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchKitchens() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCuisine) params.set("cuisine", selectedCuisine);
        const q = searchParams.get("q");
        if (q) params.set("q", q);

        const res = await fetch(`/api/kitchens?${params.toString()}`);
        const data = await res.json();
        setKitchens(data);
      } catch (error) {
        console.error("Failed to fetch kitchens:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchKitchens();
  }, [selectedCuisine, searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Kitchens</h1>
        <p className="text-muted-foreground">
          Discover authentic Indian food from verified home kitchens
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar className="flex-1" />
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Cuisine Type</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCuisine === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCuisine("")}
              >
                All
              </Badge>
              {CUISINE_TYPES.map((cuisine) => (
                <Badge
                  key={cuisine.value}
                  variant={
                    selectedCuisine === cuisine.value ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => setSelectedCuisine(cuisine.value)}
                >
                  {cuisine.label}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Dietary</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedDietary === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedDietary("")}
              >
                All
              </Badge>
              {DIETARY_TAGS.map((tag) => (
                <Badge
                  key={tag.value}
                  variant={
                    selectedDietary === tag.value ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => setSelectedDietary(tag.value)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {kitchens.length} kitchen{kitchens.length !== 1 ? "s" : ""} found
          </p>
          <KitchenGrid kitchens={kitchens} />
        </>
      )}
    </div>
  );
}
