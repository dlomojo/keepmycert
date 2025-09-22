"use client";

import { Shield, Settings, User, LogOut, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsPanel } from "@/components/notifications-panel";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface DashboardHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          const unread = data.notifications?.filter((n: { read: boolean }) => !n.read).length || 0;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">KeepMyCert</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Dashboard
            </Link>
            <Link 
              href="/profile" 
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Profile
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              title="Notifications"
              onClick={() => setShowNotifications(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Help */}
            <Button 
              variant="ghost" 
              size="sm" 
              title="Help & Support"
              onClick={() => window.open('mailto:support@keepmycert.com', '_blank')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3">
                {/* User Avatar/Name */}
                <div className="flex items-center space-x-2">
                  {user.picture ? (
                    <Image 
                      src={user.picture} 
                      alt={user.name || 'User'} 
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">
                    {user.name || user.email}
                  </span>
                </div>
                
                {/* Settings */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  title="Settings"
                  onClick={() => window.location.href = '/profile'}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                {/* Logout */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/api/auth/logout'}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </nav>
  );
}