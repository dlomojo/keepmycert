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
