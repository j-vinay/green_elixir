// client/src/pages/Landing.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthForms } from "@/components/AuthForms";
import { Leaf, Brain, Box } from "lucide-react";

export default function Landing() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    // The useAuth hook will automatically detect the authentication change
    // and App.tsx will handle the routing
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Pass a handler so Navbar can open the same auth dialog */}
      <Navbar onOpenAuthDialog={() => setIsAuthDialogOpen(true)} />

      {/* Hero Section */}
      <section className="min-h-screen gradient-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              The Future of <span className="text-primary">Herbal Healing</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Discover the ancient wisdom of Ayurveda through modern AI technology. Explore 3D herbal models and get personalized recommendations for natural healing.
            </p>

            {/* Hero Image */}
            <div className="mb-16 relative">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
                alt="Collection of Ayurvedic herbs and natural ingredients"
                className="rounded-2xl shadow-2xl w-full max-w-4xl mx-auto h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4"
                    data-testid="button-start-journey"
                  >
                    Start Your Journey
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <AuthForms onSuccess={handleAuthSuccess} />
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4">AI-Powered Recommendations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get personalized herbal remedies based on your symptoms using advanced natural language processing.
              </p>
            </Card>

            <Card className="p-8 text-center card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Box className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4">3D Plant Visualization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore interactive 3D models of medicinal plants with detailed annotations and educational content.
              </p>
            </Card>

            <Card className="p-8 text-center card-hover">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4">Comprehensive Database</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access detailed information about hundreds of Ayurvedic herbs, their benefits, and cultivation methods.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Ayurveda Section */}
      <section id="about" className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                The Wisdom of Ayurveda
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Understanding the 5,000-year-old science of natural healing
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Traditional Ayurvedic medicine preparation with herbs and ancient texts"
                  className="rounded-2xl shadow-xl w-full"
                />
              </div>
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-semibold text-foreground">Ancient Wisdom, Modern Science</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ayurveda, the "science of life," represents one of humanity's oldest healing systems.
                  Originating in India over 5,000 years ago, this holistic approach to wellness focuses
                  on preventing disease and promoting health through natural remedies and lifestyle practices.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform bridges this ancient wisdom with cutting-edge AI technology, making
                  personalized Ayurvedic recommendations accessible to everyone, anywhere.
                </p>
              </div>
            </div>

            {/* Principles of Ayurveda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚖️</span>
                </div>
                <h4 className="font-serif text-lg font-semibold mb-2">Balance</h4>
                <p className="text-muted-foreground text-sm">Harmony between mind, body, and spirit</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h4 className="font-serif text-lg font-semibold mb-2">Prevention</h4>
                <p className="text-muted-foreground text-sm">Prevent illness through lifestyle and diet</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h4 className="font-serif text-lg font-semibold mb-2">Individual</h4>
                <p className="text-muted-foreground text-sm">Personalized treatment for each constitution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
