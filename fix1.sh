#!/bin/bash

# Create component directories
mkdir -p src/components/layout
mkdir -p src/components/sections

# Create Header component
cat > src/components/layout/header.tsx << 'EOF'
"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">KeepMyCert</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary">
              FAQ
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                Start Free
              </Button>
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
EOF

# Create Footer component
cat > src/components/layout/footer.tsx << 'EOF'
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-4">
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
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Features</a></li>
              <li><a href="#" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-16 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 KeepMyCert by Detached Solutions LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
EOF

# Create HeroSection component
cat > src/components/sections/hero.tsx << 'EOF'
"use client";

import Link from "next/link";
import { ArrowRight, Bot, Brain, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-100 to-blue-100 px-3 py-1 text-sm font-medium text-cyan-800">
                🤖 AI-Powered Certificate Management
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                Track Your IT Certifications with <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">AI Power</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Never lose a certificate again. Our AI-powered platform automates document parsing, 
                predicts optimal renewal timing, and provides career insights to accelerate your IT journey.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700" size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Try Demo Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">500+</div>
                <div className="text-sm text-muted-foreground">Professionals Using</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">2,000+</div>
                <div className="text-sm text-muted-foreground">Certificates Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">99.2%</div>
                <div className="text-sm text-muted-foreground">Parsing Accuracy</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="rounded-xl border bg-card text-card-foreground shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
          <div className="flex items-center justify-between text-white">
            <h3 className="font-semibold">AI Insights Dashboard</h3>
            <Brain className="h-5 w-5" />
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="rounded-lg border bg-green-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Career Recommendation</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your AWS certs, consider Azure to increase salary by $15K
            </p>
          </div>
          
          <div className="rounded-lg border bg-blue-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Smart Renewal Alert</span>
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground">
              AWS Solutions Architect expires in 45 days. Start prep now for optimal timing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# Create FeaturesSection component
cat > src/components/sections/features.tsx << 'EOF'
import { Bot, Brain, TrendingUp, Shield, Users, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Document Parsing",
      description: "Upload certificate PDFs and let AI extract all details automatically. No manual data entry required."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Renewals",
      description: "AI-powered renewal predictions with personalized timing based on your certification complexity."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Career Analytics",
      description: "Get AI insights on salary impact, market demand, and career progression for each certification path."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance Tracking",
      description: "Automated compliance monitoring with audit-ready reports and documentation management."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Manage team certifications, track compliance, and get insights on skill gaps across your organization."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Intelligent reminder system that adapts to your schedule and certification renewal requirements."
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[58rem] text-center mb-16">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Everything you need to manage your IT career
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mx-auto mt-4">
          AI-powered features designed specifically for IT professionals who take their careers seriously.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600">
              {feature.icon}
            </div>
            <div className="space-y-2 mt-4">
              <h3 className="font-bold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
EOF

# Create PricingSection component
cat > src/components/sections/pricing.tsx << 'EOF'
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals",
      features: [
        "Track up to 5 certifications",
        "Basic AI document parsing",
        "Email renewal reminders",
        "Mobile app access",
        "Community support",
      ],
      cta: "Get Started",
      href: "/auth/signup",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      description: "per month",
      features: [
        "Unlimited certifications",
        "Advanced AI insights & recommendations",
        "Career analytics & salary insights",
        "Smart renewal predictions",
        "Priority support",
        "Export & reporting tools",
        "Calendar integrations",
      ],
      cta: "Start 14-Day Trial",
      href: "/auth/signup?plan=pro",
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      description: "per month",
      features: [
        "Everything in Pro",
        "Team compliance dashboard",
        "Bulk certificate management",
        "Advanced reporting & analytics",
        "Admin controls & permissions",
        "SSO integration",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-[58rem] text-center mb-16">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Simple, AI-powered pricing
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mx-auto mt-4">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-cyan-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-center text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
EOF

echo "✅ All components created successfully!"
echo ""
echo "Now commit and push these changes:"
echo "git add ."
echo "git commit -m 'Add missing components for landing page'"
echo "git push"