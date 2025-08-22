/**
 * React hooks for Auth0 authentication
 */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  login as auth0Login,
  logout as auth0Logout,
  getUserProfile,
  initializeAuth0,
  handleAuthCallback
} from './auth0';
import { SessionUser, AuthContextType, SubscriptionStatus } from './types';

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth context provider
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  // Check if URL contains auth callback
  const isCallback = typeof window !== 'undefined' && 
    window.location.search.includes('code=') && 
    window.location.search.includes('state=');

  // Get user profile
  const getProfile = useCallback(async () => {
    try {
      const profile = await getUserProfile();
      
      if (profile) {
        // Create session user with essential data
        const sessionUser: SessionUser = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          role: profile.role,
          subscription: profile.subscription ? {
            plan: profile.subscription.plan,
            status: profile.subscription.status
          } : undefined
        };
        
        setUser(sessionUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle auth callback
  const handleCallback = useCallback(async () => {
    try {
      await handleAuthCallback();
      // Remove callback URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      await getProfile();
    } catch (err) {
      console.error('Error handling auth callback:', err);
      setError('Authentication failed');
      setLoading(false);
    }
  }, [getProfile]);

  // Initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await initializeAuth0();
        
        if (isCallback) {
          await handleCallback();
        } else {
          await getProfile();
        }
      } catch (err) {
        console.error('Error initializing Auth0:', err);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [getProfile, handleCallback, isCallback]);

  // Login function
  const login = useCallback(async (redirectUri?: string) => {
    setLoading(true);
    try {
      await auth0Login(redirectUri);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await auth0Logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    setLoading(true);
    await getProfile();
  }, [getProfile]);

  // Calculate subscription status helpers
  const isAuthenticated = !!user;
  
  const isSubscribed = useMemo(() => {
    if (!user?.subscription) return false;
    return ['active', 'trialing'].includes(user.subscription.status);
  }, [user]);
  
  const isPro = useMemo(() => {
    if (!isSubscribed) return false;
    return user?.subscription?.plan === 'pro';
  }, [isSubscribed, user]);
  
  const isTeam = useMemo(() => {
    if (!isSubscribed) return false;
    return user?.subscription?.plan === 'team';
  }, [isSubscribed, user]);
  
  const isAdmin = useMemo(() => {
    return user?.role === 'admin';
  }, [user]);

  // Create context value
  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isSubscribed,
    isPro,
    isTeam,
    isAdmin,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Hook to check if user has access to pro features
 */
export const useProAccess = () => {
  const { isPro, isTeam, isAdmin } = useAuth();
  return isPro || isTeam || isAdmin;
};