import { redirect } from 'next/navigation';
import { Users, Plus, Shield, BarChart3, Settings, Download, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { getTeamMembers } from '@/lib/mock-data';
import { canManageTeam } from '@/lib/feature-gates';

export default async function TeamDashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/login');
  }
  const isManager = canManageTeam(user.plan, user.teamRole);
  const teamMembers = user.teamId ? getTeamMembers(user.teamId) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Team Dashboard</h1>
              <p className="text-muted-foreground">
                {isManager ? 'Manage your team certifications' : 'View team compliance status'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {user.teamRole} • Team Plan
              </Badge>
              <div className="flex items-center space-x-2">
                {isManager && (
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                )}
                <a href="/profile">
                  <Button variant="ghost" size="sm">
                    Manage Profile
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Team Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Compliance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-muted-foreground">Certifications up to date</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground">Next 90 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Across all members</p>
            </CardContent>
          </Card>
        </div>

        {/* Manager Actions */}
        {isManager && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Management Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Compliance Report
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Team Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Bulk Upload Certificates
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                SSO Settings
              </Button>
            </div>
          </div>
        )}

        {/* Team Members List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{member.user.name}</CardTitle>
                      <CardDescription>{member.user.email}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.role === 'MANAGER' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <Badge variant="outline">3 Certificates</Badge>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Joined: {member.joinedAt.toLocaleDateString()}</span>
                    {isManager && (
                      <div className="space-x-2">
                        <Button variant="ghost" size="sm">View Certificates</Button>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Compliance Dashboard */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Compliance Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Certification Status</CardTitle>
                <CardDescription>Current compliance across all team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AWS Certifications</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microsoft Certifications</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security Certifications</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Renewals</CardTitle>
                <CardDescription>Certifications expiring in the next 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">AWS Solutions Architect</div>
                      <div className="text-xs text-muted-foreground">John Doe • Expires Mar 15</div>
                    </div>
                    <Badge variant="outline" className="text-yellow-600">45 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">Azure Fundamentals</div>
                      <div className="text-xs text-muted-foreground">Jane Smith • Expires Apr 20</div>
                    </div>
                    <Badge variant="outline" className="text-green-600">81 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}