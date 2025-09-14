import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="font-serif font-bold text-xl">Green Elixir Vision</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bridging ancient Ayurvedic wisdom with modern AI technology for personalized herbal healing.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/herbs">
                  <a className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    Herb Database
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/ai-recommendations">
                  <a className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                    AI Recommendations
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  3D Herb Models
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Educational Resources
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Research Team
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Medical Disclaimer
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Green Elixir Vision. All rights reserved. | 
            <span className="text-accent ml-2">
              For educational purposes only. Consult healthcare professionals for medical advice.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
