import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KitchenWithRating } from "@/types";

interface KitchenCardProps {
  kitchen: KitchenWithRating;
}

export function KitchenCard({ kitchen }: KitchenCardProps) {
  return (
    <Link href={`/kitchens/${kitchen.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        <div className="relative h-48 w-full bg-muted">
          {kitchen.imageUrl ? (
            <Image
              src={kitchen.imageUrl}
              alt={kitchen.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-50">
              <span className="text-4xl">🍛</span>
            </div>
          )}
          {kitchen.verificationStatus === "CERTIFIED" && (
            <Badge className="absolute top-2 right-2 bg-green-600">
              Certified
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {kitchen.name}
          </h3>
          {kitchen.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {kitchen.description}
            </p>
          )}
          <div className="flex items-center gap-3 mb-2">
            {kitchen.avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {kitchen.avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({kitchen.reviewCount})
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{kitchen.avgPrepTimeMinutes} min</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {kitchen.city}, {kitchen.state}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {kitchen.regionTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
