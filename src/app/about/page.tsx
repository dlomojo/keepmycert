import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Shield, 
  Clock, 
  TrendingUp, 
  Bell, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Award,
  FileText
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-100 to-blue-100 px-3 py-1 text-sm font-medium text-cyan-800 mb-6">
              🚀 The Future of IT Certification Management
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none mb-6">
              About <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">KeepMyCert</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re revolutionizing how IT professionals manage their certifications with AI-powered automation, 
              intelligent insights, and career acceleration tools.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower IT professionals by eliminating the complexity of certification management, 
                providing intelligent career guidance, and ensuring no valuable certification ever expires unnoticed.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Eliminate Manual Tracking</h3>
                    <p className="text-muted-foreground">AI automatically extracts and organizes certification data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Maximize Career Value</h3>
                    <p className="text-muted-foreground">Get personalized recommendations to boost your earning potential</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Never Miss Renewals</h3>
                    <p className="text-muted-foreground">Smart timing algorithms ensure optimal renewal scheduling</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Card className="p-8 max-w-md">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">
                      A world where every IT professional can focus on learning and growing, 
                      while AI handles the administrative burden of certification management.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Deep Dive */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines machine learning, natural language processing, and predictive analytics 
              to deliver an unparalleled certification management experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Document Parsing</h3>
              <p className="text-muted-foreground mb-4">
                Our advanced OCR and NLP algorithms automatically extract certification details from any document format with 99.2% accuracy.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Supports PDFs, images, and scanned documents</li>
                <li>• Recognizes 500+ certification types</li>
                <li>• Handles multiple languages</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Career Intelligence</h3>
              <p className="text-muted-foreground mb-4">
                Get personalized career recommendations based on market trends, salary data, and your certification portfolio.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time salary impact analysis</li>
                <li>• Market demand predictions</li>
                <li>• Skill gap identification</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Renewal Timing</h3>
              <p className="text-muted-foreground mb-4">
                AI analyzes your schedule, exam difficulty, and preparation time to recommend optimal renewal timing.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personalized study schedules</li>
                <li>• Difficulty-based time estimates</li>
                <li>• Calendar integration</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intelligent Notifications</h3>
              <p className="text-muted-foreground mb-4">
                Receive contextual alerts that adapt to your preferences, schedule, and certification priorities.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multi-channel notifications</li>
                <li>• Priority-based alerting</li>
                <li>• Snooze and reschedule options</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive dashboards and reports to track your certification journey and career progress.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Portfolio value tracking</li>
                <li>• Renewal success rates</li>
                <li>• Career progression metrics</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-muted-foreground mb-4">
                Bank-level security with SOC 2 compliance, end-to-end encryption, and comprehensive audit trails.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 256-bit AES encryption</li>
                <li>• GDPR compliant</li>
                <li>• Regular security audits</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How KeepMyCert Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes with our simple, AI-powered process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Your Certificates</h3>
              <p className="text-muted-foreground">
                Simply drag and drop your certification documents. Our AI instantly extracts all relevant information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. AI Analyzes & Organizes</h3>
              <p className="text-muted-foreground">
                Our platform automatically categorizes your certifications and creates personalized renewal schedules.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get Intelligent Insights</h3>
              <p className="text-muted-foreground">
                Receive career recommendations, renewal reminders, and market insights to maximize your professional value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Certification Management?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the growing community of IT professionals who have streamlined their certification tracking 
              and accelerated their careers with KeepMyCert.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700" size="lg">
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}