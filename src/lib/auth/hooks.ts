import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { SessionUser, AuthContextType } from './types';

// Auth stubs
const stubs = {
  login: async () => console.log('Auth login stub'),
  logout: async () => console.log('Auth logout stub'),
  getProfile: async () => null,
  init: async () => console.log('Auth init stub'),
  handleCallback: async () => console.log('Auth callback stub')
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const getProfile = useCallback(async () => {
    try {
      const profile = await stubs.getProfile();
      setUser(profile);
    } catch {
      setError('Failed to fetch user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await stubs.init();
        const isCallback = typeof window !== 'undefined' && 
          window.location.search.includes('code=');
        
        if (isCallback) {
          await stubs.handleCallback();
          window.history.replaceState({}, '', window.location.pathname);
        }
        await getProfile();
      } catch {
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };
    init();
  }, [getProfile]);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      await stubs.login();
    } catch {
      setError('Login failed');
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await stubs.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await getProfile();
  }, [getProfile]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isSubscribed: user?.subscription ? ['active', 'trialing'].includes(user.subscription.status) : false,
    isPro: user?.subscription?.plan === 'pro',
    isTeam: user?.subscription?.plan === 'team',
    isAdmin: user?.role === 'admin',
    refreshUser
  }), [user, loading, error, login, logout, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const useProAccess = (): boolean => {
  const { isPro, isTeam, isAdmin } = useAuth();
  return isPro || isTeam || isAdmin;
};