/**
 * Auth0 configuration
 */
export const auth0Config = {
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || '',
  clientID: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
  baseURL: process.env.NEXTAUTH_URL || '',
  secret: process.env.NEXTAUTH_SECRET || '',
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  },
  authorizationParams: {
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
    response_type: 'code'
  },
  // Auth0 API audience
  audience: process.env.AUTH0_AUDIENCE || '',
  // Auth0 Management API audience
  managementAudience: 'https://api.auth0.com/api/v2/'
};

/**
 * Session configuration
 */
export const sessionConfig = {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

/**
 * JWT configuration
 */
export const jwtConfig = {
  secret: process.env.NEXTAUTH_SECRET || '',
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

/**
 * Auth0 custom claims
 */
export const auth0Claims = {
  namespace: process.env.AUTH0_NAMESPACE || 'https://keepmycert.com/',
  roles: 'roles',
  permissions: 'permissions',
  subscription: 'subscription'
};