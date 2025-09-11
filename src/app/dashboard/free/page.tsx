"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Plus, Crown, Shield, TrendingUp, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCertModal } from '@/components/modals/upload-cert-modal';

export default function FreeDashboardPage() {
  const { user: authUser, isLoading: authLoading } = useUser();
  const [certifications, setCertifications] = useState<{id: string; title: string; issuer: string; status: string; expiresOn: string}[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!authUser) {
      window.location.href = '/api/auth/login?returnTo=/dashboard/free';
      return;
    }

    async function loadCerts() {
      try {
        const certsResponse = await fetch('/api/certs');
        if (certsResponse.ok) {
          const certsData = await certsResponse.json();
          setCertifications(certsData.certifications || []);
        }
      } catch (error) {
        console.error('Error loading certifications:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCerts();
  }, [authUser, authLoading]);

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

  if (authLoading || isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!authUser) {
    return null;
  }
  
  const certLimit = 3;
  const canAddMore = certifications.length < certLimit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
              </div>
              <p className="text-muted-foreground ml-13">Welcome back, {authUser.name || authUser.email?.split('@')[0] || 'User'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground bg-white/60 px-3 py-1 rounded-full border">
                Free Plan ({certifications.length}/{certLimit} certificates)
              </div>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700" size="sm">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="bg-white/60">
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
            className={`border-dashed border-2 bg-white/60 backdrop-blur transition-all duration-200 ${canAddMore ? 'hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 cursor-pointer hover:shadow-lg' : 'border-muted-foreground/25'}`}
            onClick={() => canAddMore && setIsUploadModalOpen(true)}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-2 ${canAddMore ? 'bg-gradient-to-br from-cyan-100 to-blue-100' : 'bg-gray-100'}`}>
                <Plus className={`h-6 w-6 ${canAddMore ? 'text-cyan-600' : 'text-muted-foreground'}`} />
              </div>
              <CardTitle className={`${canAddMore ? 'text-gray-900' : 'text-muted-foreground'}`}>
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
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700" size="sm">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Add More
                </Button>
              </CardContent>
            )}
          </Card>

          {certifications.map((cert) => (
            <Card key={cert.id} className="bg-white/60 backdrop-blur hover:shadow-lg transition-all duration-200 hover:bg-white/80">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">{cert.title}</CardTitle>
                      <CardDescription className="text-gray-600">{cert.issuer}</CardDescription>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cert.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    cert.status === 'EXPIRING_SOON' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {cert.status.replace('_', ' ')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Expires: {new Date(cert.expiresOn).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Your Progress</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/60 backdrop-blur hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Certificates</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                    <Award className="h-4 w-4 text-cyan-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{certifications.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {certLimit - certifications.length} remaining in free plan
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">Expiring Soon</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {certifications.filter(c => c.status === 'EXPIRING_SOON').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Certificates expiring in 90 days
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700">Active Status</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {certifications.filter(c => c.status === 'ACTIVE').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
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