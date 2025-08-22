/**
 * Auth0 client configuration and authentication functions
 */
import { Auth0Client } from '@auth0/auth0-spa-js';
import { Auth0UserProfile, UserProfile } from './types';
import { getUserSubscription } from '../db/queries';

// Auth0 configuration
const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' 
      ? `${window.location.origin}/api/auth/callback` 
      : '',
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    scope: 'openid profile email'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

// Create Auth0 client instance
let auth0Client: Auth0Client | null = null;

/**
 * Initialize Auth0 client
 */
export const initializeAuth0 = async (): Promise<Auth0Client> => {
  if (auth0Client) {
    return auth0Client;
  }

  // Import Auth0Client dynamically to avoid SSR issues
  const { Auth0Client } = await import('@auth0/auth0-spa-js');
  
  auth0Client = new Auth0Client(auth0Config);
  return auth0Client;
};

/**
 * Login with Auth0
 * @param redirectUri Optional redirect URI after login
 */
export const login = async (redirectUri?: string): Promise<void> => {
  const client = await initializeAuth0();
  
  await client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: redirectUri || auth0Config.authorizationParams.redirect_uri
    }
  });
};

/**
 * Logout from Auth0
 */
export const logout = async (): Promise<void> => {
  const client = await initializeAuth0();
  
  await client.logout({
    logoutParams: {
      returnTo: typeof window !== 'undefined' ? window.location.origin : ''
    }
  });
};

/**
 * Get user profile from Auth0
 */
export const getUser = async (): Promise<Auth0UserProfile | null> => {
  const client = await initializeAuth0();
  
  try {
    // Check if authenticated
    const isAuthenticated = await client.isAuthenticated();
    
    if (!isAuthenticated) {
      return null;
    }
    
    // Get user profile
    const user = await client.getUser();
    return user as Auth0UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Get access token for API calls
 */
export const getAccessToken = async (): Promise<string | null> => {
  const client = await initializeAuth0();
  
  try {
    const token = await client.getTokenSilently();
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get complete user profile with subscription data
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    // Get Auth0 user profile
    const auth0User = await getUser();
    
    if (!auth0User) {
      return null;
    }
    
    // Get subscription data from database
    const subscription = await getUserSubscription(auth0User.sub);
    
    // Create complete user profile
    const userProfile: UserProfile = {
      id: auth0User.sub,
      ...auth0User,
      role: 'user', // Default role, can be overridden from database
      subscription: subscription || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return userProfile;
  } catch (error) {
    console.error('Error getting user profile with subscription:', error);
    return null;
  }
};

/**
 * Handle Auth0 callback
 */
export const handleAuthCallback = async (): Promise<void> => {
  const client = await initializeAuth0();
  
  try {
    // Handle callback
    await client.handleRedirectCallback();
  } catch (error) {
    console.error('Error handling auth callback:', error);
  }
};