import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/api/auth/login');
  }
  
  // Plan-aware routing
  switch (user.plan) {
    case 'FREE':
      redirect('/dashboard/free');
    case 'PRO':
      redirect('/dashboard/pro');
    case 'TEAM':
      redirect('/team');
    default:
      redirect('/dashboard/free');
  }
}