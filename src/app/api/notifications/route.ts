import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserByEmail } from '@/lib/user-service';
import { NotificationRow } from '@/types/database';

export async function GET() {
  try {
    const session = await getSession();
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = await supabaseAdmin.select<NotificationRow>('notifications', '*', {
      eq: { user_id: user.id },
      order: { column: 'created_at', ascending: false },
      limit: 50,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { action, notificationIds } = await req.json();

    if (action === 'markAsRead') {
      if (Array.isArray(notificationIds) && notificationIds.length > 0) {
        await supabaseAdmin.update<NotificationRow>('notifications', { read: true }, {
          eq: { user_id: user.id },
          in: { id: notificationIds },
        });
      }
    } else if (action === 'markAllAsRead') {
      await supabaseAdmin.update<NotificationRow>('notifications', { read: true }, {
        eq: { user_id: user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}