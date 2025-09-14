import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Eye, Star } from "lucide-react";
import type { Herb } from "@shared/schema";

interface HerbCardProps {
  herb: Herb;
}

export default function HerbCard({ herb }: HerbCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg card-hover" data-testid={`card-herb-${herb.id}`}>
      {herb.imageUrl && (
        <img 
          src={herb.imageUrl} 
          alt={herb.plantName} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-xl font-semibold">{herb.plantName}</h3>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="text-sm text-muted-foreground mb-2 italic">
          {herb.scientificName}
        </p>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
          {herb.description}
        </p>
        <div className="flex items-center justify-between">
          {herb.category && (
            <Badge variant="secondary" className="text-xs">
              {herb.category}
            </Badge>
          )}
          <Link href={`/herbs/${herb.id}`}>
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center space-x-2"
              data-testid={`button-view-details-${herb.id}`}
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
