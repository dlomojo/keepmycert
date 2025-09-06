"use client";

import { useState, useEffect } from 'react';
import { Plus, Crown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCertModal } from '@/components/modals/upload-cert-modal';

export default function FreeDashboardPage() {
  const [user, setUser] = useState<{id: string; name: string; email: string; plan: string} | null>(null);
  const [certifications, setCertifications] = useState<{id: string; title: string; issuer: string; status: string; expiresOn: string}[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userResponse = await fetch('/api/user');
        if (!userResponse.ok) {
          window.location.href = '/api/auth/login';
          return;
        }
        const userData = await userResponse.json();
        setUser(userData);
        
        const certsResponse = await fetch('/api/certs');
        if (certsResponse.ok) {
          const certsData = await certsResponse.json();
          setCertifications(certsData.certifications || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUploadSuccess = async () => {
    try {
      const response = await fetch('/api/certs');
      if (response.ok) {
        const data = await response.json();
        setCertifications(data.certifications || []);
      }
    } catch (error) {
      console.error('Error reloading certifications:', error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }
  
  const certLimit = 3;
  const canAddMore = certifications.length < certLimit;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Free Plan ({certifications.length}/{certLimit} certificates)
              </div>
              <Button variant="outline" size="sm">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Manage Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className={`border-dashed border-2 ${canAddMore ? 'hover:border-primary cursor-pointer' : 'border-muted-foreground/25'}`}
            onClick={() => canAddMore && setIsUploadModalOpen(true)}
          >
            <CardHeader className="text-center">
              <Plus className={`mx-auto h-8 w-8 ${canAddMore ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className={canAddMore ? '' : 'text-muted-foreground'}>
                {canAddMore ? 'Add Certificate' : 'Certificate Limit Reached'}
              </CardTitle>
              <CardDescription>
                {canAddMore 
                  ? 'Upload your IT certification' 
                  : `Free plan allows up to ${certLimit} certificates`
                }
              </CardDescription>
            </CardHeader>
            {!canAddMore && (
              <CardContent className="text-center">
                <Button variant="outline" size="sm" disabled>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Add More
                </Button>
              </CardContent>
            )}
          </Card>

          {certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <CardTitle className="text-lg">{cert.title}</CardTitle>
                <CardDescription>{cert.issuer}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className={`font-medium ${
                      cert.status === 'ACTIVE' ? 'text-green-600' :
                      cert.status === 'EXPIRING_SOON' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {cert.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expires:</span>
                    <span>{new Date(cert.expiresOn).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Your Progress</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {certLimit - certifications.length} remaining in free plan
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certifications.filter(c => c.status === 'EXPIRING_SOON').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Certificates expiring in 90 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certifications.filter(c => c.status === 'ACTIVE').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently valid certificates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <UploadCertModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}