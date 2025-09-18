"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@auth0/nextjs-auth0/client';

interface Auth0User {
  given_name?: string;
  family_name?: string;
  [key: string]: unknown;
}

export default function CompleteProfilePage() {
  const { user, isLoading } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const auth0User = user as Auth0User;
      setFirstName(auth0User.given_name || '');
      setLastName(auth0User.family_name || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName })
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        console.error('Profile update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}