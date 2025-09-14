import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Leaf, Brain, History, Star } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Welcome Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Welcome back, {user?.firstName || 'Explorer'}!
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Continue your journey into the world of Ayurvedic healing. Discover new herbs, 
              get AI-powered recommendations, and explore nature's pharmacy.
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Link href="/herbs">
                <Card className="p-6 text-center cursor-pointer card-hover" data-testid="card-browse-herbs">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">Browse Herbs</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore our comprehensive database of Ayurvedic plants
                  </p>
                </Card>
              </Link>
              
              <Link href="/ai-recommendations">
                <Card className="p-6 text-center cursor-pointer card-hover" data-testid="card-ai-recommendations">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">AI Recommendations</h3>
                  <p className="text-muted-foreground text-sm">
                    Get personalized herbal remedies for your symptoms
                  </p>
                </Card>
              </Link>
              
              <Card className="p-6 text-center cursor-pointer card-hover" data-testid="card-your-history">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">Your History</h3>
                <p className="text-muted-foreground text-sm">
                  Review your past consultations and recommendations
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Herbs Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Herbs
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover the most popular and powerful Ayurvedic remedies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured herb cards would be populated from API */}
              <Card className="overflow-hidden card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1584553391442-12330e17e8a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" 
                  alt="Turmeric" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl font-semibold">Turmeric</h3>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Curcuma longa</p>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                    Known as the "golden spice," turmeric is renowned for its powerful 
                    anti-inflammatory and antioxidant properties.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">Anti-inflammatory</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" 
                  alt="Ashwagandha" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl font-semibold">Ashwagandha</h3>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Withania somnifera</p>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                    An adaptogenic herb that helps the body manage stress and promotes 
                    overall vitality and energy.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">Adaptogenic</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden card-hover">
                <img 
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" 
                  alt="Tulsi" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl font-semibold">Tulsi</h3>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Ocimum sanctum</p>
                  <p className="text-muted-foreground mb-4 text-sm line-clamp-3">
                    Holy basil is revered for its respiratory benefits and ability to enhance 
                    mental clarity and spiritual well-being.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">Respiratory</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Link href="/herbs">
                <Button size="lg" data-testid="button-view-all-herbs">
                  View All Herbs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
