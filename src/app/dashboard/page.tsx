import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/mock-data';

export default function DashboardPage() {
  const user = getCurrentUser();
  
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