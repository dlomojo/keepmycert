// Type-safe environment variable access
export const env = {
  // Database
  DATABASE_URL: process.env['DATABASE_URL']!,
  DIRECT_URL: process.env['DIRECT_URL'],
  
  // Auth0
  AUTH0_SECRET: process.env['AUTH0_SECRET']!,
  AUTH0_BASE_URL: process.env['AUTH0_BASE_URL']!,
  AUTH0_ISSUER_BASE_URL: process.env['AUTH0_ISSUER_BASE_URL']!,
  AUTH0_CLIENT_ID: process.env['AUTH0_CLIENT_ID']!,
  AUTH0_CLIENT_SECRET: process.env['AUTH0_CLIENT_SECRET']!,
  
  // Google Calendar
  GOOGLE_CLIENT_ID: process.env['GOOGLE_CLIENT_ID']!,
  GOOGLE_CLIENT_SECRET: process.env['GOOGLE_CLIENT_SECRET']!,
  GOOGLE_REDIRECT_URI: process.env['GOOGLE_REDIRECT_URI']!,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env['STRIPE_SECRET_KEY']!,
  STRIPE_WEBHOOK_SECRET: process.env['STRIPE_WEBHOOK_SECRET']!,
  STRIPE_PRICE_PRO: process.env['STRIPE_PRICE_PRO']!,
  STRIPE_PRICE_TEAM: process.env['STRIPE_PRICE_TEAM']!,
  
  // External APIs
  OPENAI_API_KEY: process.env['OPENAI_API_KEY']!,
  NEWSAPI_KEY: process.env['NEWSAPI_KEY']!,
  RESEND_API_KEY: process.env['RESEND_API_KEY']!,
  
  // ID.me
  IDME_CLIENT_ID: process.env['IDME_CLIENT_ID']!,
  IDME_CLIENT_SECRET: process.env['IDME_CLIENT_SECRET']!,
  
  // App URLs
  APP_URL: process.env['APP_URL']!,
  NEXT_PUBLIC_SITE_URL: process.env['NEXT_PUBLIC_SITE_URL']!,
  NEXT_PUBLIC_IDME_CLIENT_ID: process.env['NEXT_PUBLIC_IDME_CLIENT_ID']!,
  
  // Cron
  CRON_TOKEN: process.env['CRON_TOKEN']!,
  
  // Node environment
  NODE_ENV: process.env['NODE_ENV'] as 'development' | 'production' | 'test'
} as const;

// Type-safe user property access
export function getUserProperty<T extends Record<string, unknown>>(
  user: T | null | undefined,
  key: keyof T
): T[keyof T] | undefined {
  return user?.[key];
}