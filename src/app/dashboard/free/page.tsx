import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function FreeDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/login');
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your IT certifications with AI-powered insights.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Upload Certificate</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your certificate and let AI extract the details automatically.
            </p>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Upload Certificate
            </button>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">My Certificates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage all your certificates in one place.
            </p>
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-xs text-muted-foreground">certificates tracked</p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unlock unlimited certificates and AI insights.
            </p>
            <button 
              onClick={() => window.location.href = '/api/auth/login?returnTo=' + encodeURIComponent(window.location.origin + '/checkout/pro')}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}