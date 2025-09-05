import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Brain, Zap, FileDown, Paperclip, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificationCard } from '@/components/dashboard/certification-card';
import { getCurrentUser } from '@/lib/auth';
import { getUserCertifications } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default async function ProDashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/login');
  }
  const certifications = getUserCertifications(user.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Pro Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Pro Plan • Unlimited certificates
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Certificate
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
        {/* AI Insights Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-blue-600" />
            AI Insights & Recommendations
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="mr-2 h-4 w-4 text-blue-600" />
                  Career Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your AWS certifications, consider adding Azure fundamentals to increase your market value by an estimated 15-20%.
                </p>
                <Button size="sm" variant="outline">
                  View Full Analysis
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-4 w-4 text-green-600" />
                  Smart Renewal Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Your AWS Solutions Architect cert expires in 45 days. Based on exam difficulty, we recommend starting prep now.
                </p>
                <Button size="sm" variant="outline">
                  Set Study Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export Calendar (ICS)
            </Button>
            <Button variant="outline" size="sm">
              <Paperclip className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Advanced Reminders
            </Button>
          </div>
        </div>

        {/* Certifications Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Certifications</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Add Certificate Card */}
            <Card className="border-dashed border-2 hover:border-primary cursor-pointer">
              <CardHeader className="text-center">
                <Plus className="mx-auto h-8 w-8 text-primary" />
                <CardTitle>Add Certificate</CardTitle>
                <CardDescription>Upload your IT certification with AI parsing</CardDescription>
              </CardHeader>
            </Card>

            {/* Existing Certifications with Pro features */}
            {certifications.map((cert) => (
              <CertificationCard 
                key={cert.id} 
                certification={cert} 
                showAttachment={true}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certifications.length}</div>
              <p className="text-xs text-muted-foreground">Unlimited in Pro plan</p>
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
              <p className="text-xs text-muted-foreground">Smart alerts enabled</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Career Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85</div>
              <p className="text-xs text-muted-foreground">AI-calculated rating</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$95K</div>
              <p className="text-xs text-muted-foreground">Estimated salary range</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}