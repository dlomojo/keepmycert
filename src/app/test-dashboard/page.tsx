"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';

export default function TestDashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/api/auth/login?returnTo=/test-dashboard';
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Test Dashboard</h1>
        <p>User: {user.name || user.email}</p>
        <p>This page works if you can see this message!</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Real Dashboard
        </button>
      </div>
    </div>
  );
}