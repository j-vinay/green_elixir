import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, AlertTriangle, Leaf } from "lucide-react";

interface AIRecommendation {
  analysis: {
    category: string;
    severity: string;
    keywords: string[];
  };
  recommendations: Array<{
    herbId: number;
    herbName: string;
    scientificName: string;
    reason: string;
    dosage: string;
    benefits: string[];
  }>;
  disclaimer: string;
  lifestyle: string[];
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recommendation?: AIRecommendation;
}

export default function AIRecommendations() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: "Hello! I'm your Ayurveda AI assistant. Please describe your symptoms or health concerns, and I'll suggest personalized herbal remedies based on ancient Ayurvedic wisdom.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const recommendationMutation = useMutation({
    mutationFn: async (symptoms: string) => {
      const response = await apiRequest("POST", "/api/ai/recommend", { symptoms });
      return response.json() as Promise<AIRecommendation>;
    },
    onSuccess: (recommendation, symptoms) => {
      setMessages(prev => [
        ...prev,
        {
          type: 'user',
          content: symptoms,
          timestamp: new Date(),
        },
        {
          type: 'ai',
          content: `Based on your symptoms, you might be experiencing ${recommendation.analysis.category} imbalance. Here are some Ayurvedic recommendations:`,
          timestamp: new Date(),
          recommendation,
        }
      ]);
      setInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    recommendationMutation.mutate(input.trim());
  };

  const quickSuggestions = [
    "Digestive issues",
    "Stress & anxiety", 
    "Sleep problems",
    "Joint pain",
    "Low energy",
    "Headaches"
  ];

  const handleQuickSuggest = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                AI Health Recommendations
              </h1>
              <p className="text-xl text-muted-foreground">
                Describe your symptoms and get personalized Ayurvedic remedies
              </p>
            </div>
            
            <Card className="shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-primary text-primary-foreground p-6 flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Ayurveda AI Assistant</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Powered by Natural Language Processing
                  </p>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'justify-end' : ''
                  }`}>
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    
                    <div className={`rounded-2xl p-4 max-w-md ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {message.recommendation && (
                        <div className="mt-4 space-y-3">
                          {message.recommendation.recommendations.map((herb, herbIndex) => (
                            <div key={herbIndex} className="bg-background rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <Leaf className="w-4 h-4 text-primary" />
                                <span className="font-medium text-sm">{herb.herbName}</span>
                              </div>
                              <p className="text-xs text-muted-foreground italic mb-1">
                                {herb.scientificName}
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                {herb.reason}
                              </p>
                              <p className="text-xs font-medium">
                                Dosage: {herb.dosage}
                              </p>
                            </div>
                          ))}
                          
                          {message.recommendation.lifestyle.length > 0 && (
                            <div className="bg-background rounded-lg p-3">
                              <h4 className="font-medium text-sm mb-2">Lifestyle Recommendations:</h4>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {message.recommendation.lifestyle.slice(0, 2).map((item, itemIndex) => (
                                  <li key={itemIndex}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-secondary" />
                      </div>
                    )}
                  </div>
                ))}
                
                {recommendationMutation.isPending && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none p-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <span className="text-sm text-muted-foreground ml-2">Analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="border-t border-border p-6">
                <div className="flex space-x-3">
                  <Textarea
                    placeholder="Describe your symptoms or health concerns..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 min-h-[48px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    data-testid="textarea-symptoms"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || recommendationMutation.isPending}
                    className="flex items-center space-x-2"
                    data-testid="button-send-message"
                  >
                    <span>Send</span>
                  </Button>
                </div>
                
                {/* Quick Suggestions */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSuggest(suggestion)}
                        className="text-xs rounded-full"
                        data-testid={`button-quick-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Disclaimer */}
            <Card className="mt-8 p-4 bg-accent/10 border-accent/20">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-accent-foreground">Important Disclaimer</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    These recommendations are based on traditional Ayurvedic principles and are for educational purposes only. 
                    Always consult with qualified healthcare professionals before making any changes to your health regimen.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
