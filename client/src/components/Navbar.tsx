import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 navbar-scroll border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-serif font-bold text-xl text-foreground">
              Green Elixir Vision
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                isActive("/") && "text-foreground font-medium"
              )}>
                Home
              </a>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link href="/herbs">
                  <a className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isActive("/herbs") && "text-foreground font-medium"
                  )}>
                    Herbs
                  </a>
                </Link>
                <Link href="/ai-recommendations">
                  <a className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isActive("/ai-recommendations") && "text-foreground font-medium"
                  )}>
                    AI Recommendations
                  </a>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <a className={cn(
                      "text-muted-foreground hover:text-foreground transition-colors",
                      isActive("/admin") && "text-foreground font-medium"
                    )}>
                      Admin
                    </a>
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Authentication Buttons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden md:block"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/">
                <a className="block px-3 py-2 text-muted-foreground hover:text-foreground">
                  Home
                </a>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link href="/herbs">
                    <a className="block px-3 py-2 text-muted-foreground hover:text-foreground">
                      Herbs
                    </a>
                  </Link>
                  <Link href="/ai-recommendations">
                    <a className="block px-3 py-2 text-muted-foreground hover:text-foreground">
                      AI Recommendations
                    </a>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <a className="block px-3 py-2 text-muted-foreground hover:text-foreground">
                        Admin
                      </a>
                    </Link>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user?.firstName || user?.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mx-3"
                      onClick={() => window.location.href = '/api/logout'}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              )}
              
              {!isAuthenticated && (
                <div className="border-t border-border pt-2 mt-2">
                  <Button 
                    className="mx-3 mb-2"
                    onClick={() => window.location.href = '/api/login'}
                  >
                    Login / Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
