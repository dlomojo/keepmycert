import { redirect } from 'next/navigation';
import { Plus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpgradeCard } from '@/components/ui/upgrade-card';
import { CertificationCard } from '@/components/dashboard/certification-card';
import { getCurrentUser } from '@/lib/auth';
import { getUserCertifications } from '@/lib/mock-data';
import { getCertificationLimit } from '@/lib/feature-gates';

export default async function FreeDashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/login');
  }
  const certifications = getUserCertifications(user.id);
  const certLimit = getCertificationLimit(user.plan);
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Add Certificate Card */}
          <Card className={`border-dashed border-2 ${canAddMore ? 'hover:border-primary cursor-pointer' : 'border-muted-foreground/25'}`}>
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

          {/* Existing Certifications */}
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} />
          ))}
        </div>

        {/* Upgrade Cards for Locked Features */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Unlock More Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UpgradeCard
              title="AI-Powered Insights"
              description="Get intelligent recommendations for your certification path and career growth."
              upgradeMessage="Upgrade to Pro to unlock AI insights and career recommendations"
              targetPlan="PRO"
            />
            
            <UpgradeCard
              title="Advanced Reminders"
              description="Smart renewal predictions and personalized notification scheduling."
              upgradeMessage="Upgrade to Pro to unlock advanced reminder features"
              targetPlan="PRO"
            />
            
            <UpgradeCard
              title="Data Export"
              description="Export your certification data to CSV, ICS calendar, and other formats."
              upgradeMessage="Upgrade to Pro to unlock data export capabilities"
              targetPlan="PRO"
            />
          </div>
        </div>

        {/* Quick Stats */}
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
    </div>
  );
}