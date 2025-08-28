"use client";

import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand / About */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">KeepMyCert</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              AI-powered IT certification management for professionals who take their careers seriously.
            </p>
            <div className="text-xs text-muted-foreground">
              Built by IT professionals, for IT professionals. 🤖 Powered by AI.
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-primary"
                >
                  Pricing
                </button>
              </li>
              <li>
                <span className="text-muted-foreground/50">API (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="text-muted-foreground/50">Help Center (Coming Soon)</span>
              </li>
              <li>
                <span className="text-muted-foreground/50">Contact (Coming Soon)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-16 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} KeepMyCert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}