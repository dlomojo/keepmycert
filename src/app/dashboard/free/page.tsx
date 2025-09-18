"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Upload, 
  Bell, 
  FileText, 
  Award, 
  TrendingUp, 
  Lock, 
  Circle,
  Clock,
  BarChart3,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import NewsFeed from '@/components/news-feed';
import RenewalCard from '@/components/renewal-card';
import CredlyImport from '@/components/credly-import';
import VendorRenewalDropdown from '@/components/vendor-renewal-dropdown';

interface User {
  name?: string;
  email?: string;
}

export const dynamic = 'force-dynamic';

export default function FreeDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          window.location.href = '/api/auth/login';
        }
      } catch {
        window.location.href = '/api/auth/login';
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const certCount = 0;
  const maxCerts = 3;
  const quickstartProgress = 0;

  const handleUpgrade = () => {
    window.location.href = '/api/auth/login?returnTo=' + encodeURIComponent(window.location.origin + '/checkout/pro');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.name || 'User'}!</h1>
              <p className="text-muted-foreground">Manage your IT certifications with AI-powered insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Free Plan • {certCount}/{maxCerts} certificates
              </div>
              <Button onClick={handleUpgrade} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Quickstart Checklist */}
        <Card className="mb-8 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-cyan-600" />
                  Quick Setup ({quickstartProgress}/3 completed)
                </CardTitle>
                <CardDescription>Get started in 2 minutes</CardDescription>
              </div>
              <Progress value={(quickstartProgress / 3) * 100} className="w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Add your first certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Turn on email reminders</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Connect your calendar</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Usage Meter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Free Plan Usage</span>
              <Button variant="link" onClick={handleUpgrade} className="text-xs p-0 h-auto">
                Upgrade →
              </Button>
            </div>
            <Progress value={(certCount / maxCerts) * 100} className="mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{certCount} of {maxCerts} certificates used</span>
              <span>{maxCerts - certCount} remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Certificate - Primary CTA */}
            <Card className="border-2 border-dashed border-primary/50 hover:border-primary cursor-pointer bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Add Your First Certificate</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a certificate and let AI extract all the details automatically
                  </p>
                  <Button className="bg-primary">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Empty State Helpers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Options</CardTitle>
                <CardDescription>Choose how you&apos;d like to add certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <Award className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Popular Templates</div>
                      <div className="text-xs text-muted-foreground">CompTIA, AWS, Cisco</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <FileText className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Import from CSV</div>
                      <div className="text-xs text-muted-foreground">Bulk upload existing data</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Connect Credly</div>
                      <div className="text-xs text-muted-foreground">Sync digital badges</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <Zap className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Try Demo Cert</div>
                      <div className="text-xs text-muted-foreground">See how it works</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expiring Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Renewal Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Badge variant="outline" className="flex-1 justify-center py-2">
                    Next 30 days: 0
                  </Badge>
                  <Badge variant="outline" className="flex-1 justify-center py-2">
                    Next 60 days: 0
                  </Badge>
                  <Badge variant="outline" className="flex-1 justify-center py-2">
                    Next 90 days: 0
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Add certificates to see your renewal timeline
                </p>
              </CardContent>
            </Card>

            {/* Career News */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">IT Security News</CardTitle>
                <CardDescription>Stay updated with the latest in your field</CardDescription>
              </CardHeader>
              <CardContent>
                <NewsFeed field="security" />
              </CardContent>
            </Card>

            {/* Vendor Renewal Steps */}
            <div className="grid gap-4 md:grid-cols-2">
              <RenewalCard vendor="comptia" />
              <RenewalCard vendor="microsoft" />
              <RenewalCard vendor="aws" />
              <RenewalCard vendor="cisco" />
            </div>

            {/* Recent Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm">No activity yet</p>
                  <p className="text-xs mt-1">Your certificate updates will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
                      <p className="text-2xl font-bold">{certCount}</p>
                    </div>
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Free plan: {maxCerts} max</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Within 90 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Vendor Renewal Dropdown */}
            <VendorRenewalDropdown />

            {/* Reminders Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Smart Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email notifications</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Calendar sync</span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get notified 90, 30, and 7 days before expiration
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Document Vault Teaser */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Document Vault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-sm mb-2">0/3 files uploaded</p>
                  <Progress value={0} className="mb-3" />
                  <div className="flex items-center justify-center text-xs text-muted-foreground mb-3">
                    <Lock className="mr-1 h-3 w-3" />
                    AI extraction available in Pro
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Upload Certificate PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Insights Teaser */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Career Insights
                  <Lock className="ml-2 h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unlock AI-powered career analytics and salary insights
                  </p>
                  <Button onClick={handleUpgrade} size="sm" variant="outline" className="w-full">
                    Upgrade for Insights
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credly Import */}
            <CredlyImport />

            {/* Support CTA */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    2-minute setup guide
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Setup Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}