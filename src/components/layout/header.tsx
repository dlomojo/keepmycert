"use client";

import { Shield, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useUser } from '@auth0/nextjs-auth0/client';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">KeepMyCert</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Pricing
            </button>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Dashboard
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Hi, {user.name || user.email}</span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/api/auth/logout'}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => window.location.href = '/api/auth/login'}
              >
                Sign Up
              </Button>
            )}
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Pricing
              </button>
              <Link href="/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Hi, {user.name || user.email}</div>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/api/auth/logout'}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={() => window.location.href = '/api/auth/login'}
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
