'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Globe, 
  Shield, 
  Bell, 
  CreditCard, 
  Download,
  Key,
  Trash2
} from "lucide-react";

type UserProfile = {
  id: string;
  email: string;
  name: string;
  plan: 'FREE' | 'PRO' | 'TEAM';
  timezone: string;
};

export default function ProfilePage() {
  const { user: auth0User, isLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !auth0User) {
      router.push('/api/auth/login');
      return;
    }

    if (auth0User?.email) {
      // Fetch user profile data
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => setUserProfile(data))
        .catch(() => {
          // Fallback to basic user data
          setUserProfile({
            id: auth0User.sub || '',
            email: auth0User.email || '',
            name: auth0User.name || 'User',
            plan: 'FREE',
            timezone: 'UTC'
          });
        });
    }
  }, [auth0User, isLoading, router]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="flex items-center mt-1">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <div className="flex items-center mt-1">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userProfile.timezone}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/complete-profile')}>Edit Profile</Button>
              </CardContent>
            </Card>

            {/* Account & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Account & Security
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Password</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('Password change functionality coming soon!')}>Change</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Two-Factor Auth</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('Two-factor authentication coming soon!')}>Enable</Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your billing and plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Plan</span>
                  <Badge variant={userProfile.plan === 'FREE' ? 'secondary' : 'default'}>
                    {userProfile.plan}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {userProfile.plan === 'FREE' && (
                    <Button variant="outline" size="sm" onClick={() => alert('Upgrade functionality coming soon!')}>Upgrade to Pro</Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => alert('Billing history coming soon!')}>Billing History</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Reminders</span>
                  <Button variant="outline" size="sm" onClick={() => alert('Email reminder configuration coming soon!')}>Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Button variant="outline" size="sm" onClick={() => alert('Push notification settings coming soon!')}>Settings</Button>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Data export functionality coming soon!')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export My Data
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Privacy settings coming soon!')}>
                  Privacy Settings
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion functionality coming soon!');
                  }
                }}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}