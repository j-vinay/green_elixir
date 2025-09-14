import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HerbCard from "@/components/HerbCard";
import { Search } from "lucide-react";
import type { Herb } from "@shared/schema";

const categories = [
  "All",
  "Digestive",
  "Respiratory", 
  "Immunity",
  "Skin Care",
  "Anti-inflammatory",
  "Adaptogenic",
  "Brain Health"
];

export default function HerbsList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: herbs = [], isLoading, error } = useQuery<Herb[]>({
    queryKey: ["/api/herbs", search || undefined, selectedCategory !== "All" ? selectedCategory : undefined],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                Herbal Database
              </h1>
              <p className="text-xl text-muted-foreground">
                Explore our comprehensive collection of Ayurvedic herbs
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search herbs by name or benefit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  data-testid="input-search-herbs"
                />
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                    data-testid={`button-category-${category.toLowerCase()}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading herbs...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <Card className="p-8 text-center">
                <p className="text-destructive mb-4">Failed to load herbs. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </Card>
            )}
            
            {/* Empty State */}
            {!isLoading && !error && herbs.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No herbs found matching your criteria.</p>
              </Card>
            )}
            
            {/* Herbs Grid */}
            {!isLoading && !error && herbs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {herbs.map((herb) => (
                  <HerbCard key={herb.id} herb={herb} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
