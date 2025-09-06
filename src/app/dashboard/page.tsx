"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    console.log('Dashboard useEffect:', { isLoading, user: !!user, userEmail: user?.email });
    
    if (!isLoading) {
      if (!user) {
        console.log('No user, redirecting to login');
        window.location.href = '/api/auth/login?returnTo=/dashboard';
      } else {
        console.log('User found, redirecting to free dashboard');
        window.location.href = '/dashboard/free';
      }
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-4"></div>
        <p>{isLoading ? 'Loading...' : user ? 'Redirecting to dashboard...' : 'Redirecting to login...'}</p>
      </div>
    </div>
  );
}