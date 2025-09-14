import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeDViewer from "@/components/ThreeDViewer";
import { ArrowLeft, BookOpen, Bookmark, BookmarkCheck, Check } from "lucide-react";
import { Link } from "wouter";
import type { Herb } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function HerbDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: herb, isLoading, error } = useQuery<Herb>({
    queryKey: ["/api/herbs", id],
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        await apiRequest("DELETE", `/api/user/bookmarks/${id}`);
      } else {
        await apiRequest("POST", "/api/user/bookmarks", { herbId: parseInt(id!) });
      }
    },
    onSuccess: () => {
      setIsBookmarked(!isBookmarked);
      toast({
        title: isBookmarked ? "Bookmark removed" : "Bookmark added",
        description: isBookmarked 
          ? "Herb removed from your bookmarks" 
          : "Herb added to your bookmarks",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/bookmarks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading herb details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !herb) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="p-8 text-center max-w-md mx-auto">
            <p className="text-destructive mb-4">Herb not found or failed to load.</p>
            <Link href="/herbs">
              <Button>Back to Herbs</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const benefits = herb.benefits.split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/herbs">
                <Button variant="ghost" className="mb-4" data-testid="button-back-herbs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Herbs
                </Button>
              </Link>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
                    {herb.plantName}
                  </h1>
                  <p className="text-lg text-muted-foreground italic">
                    {herb.scientificName}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {herb.category && (
                    <Badge variant="secondary" className="text-sm">
                      {herb.category}
                    </Badge>
                  )}
                  {user && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bookmarkMutation.mutate()}
                      disabled={bookmarkMutation.isPending}
                      data-testid="button-bookmark"
                    >
                      {isBookmarked ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 mr-2" />
                          Bookmarked
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 mr-2" />
                          Bookmark
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 3D Model and Images */}
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="h-80 bg-muted">
                    <ThreeDViewer modelUrl={herb.model3dUrl} herbName={herb.plantName} />
                  </div>
                </Card>
                
                {/* Herb Image Gallery */}
                {herb.imageUrl && (
                  <div className="grid grid-cols-1 gap-2">
                    <img 
                      src={herb.imageUrl} 
                      alt={herb.plantName}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Herb Information */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {herb.description}
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-3">Health Benefits</h3>
                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {herb.cultivation && (
                  <Card className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-3">Cultivation</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {herb.cultivation}
                    </p>
                  </Card>
                )}
                
                {herb.climate && (
                  <Card className="p-6">
                    <h3 className="font-serif text-xl font-semibold mb-3">Climate Requirements</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {herb.climate}
                    </p>
                  </Card>
                )}
                
                {herb.usageInstructions && (
                  <Card className="p-6 bg-accent/10 border-accent/20">
                    <h4 className="font-medium mb-2 text-accent-foreground">Usage Instructions</h4>
                    <p className="text-sm text-muted-foreground">
                      {herb.usageInstructions}
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
