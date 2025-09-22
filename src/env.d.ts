declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      DIRECT_URL?: string;
      
      // Auth0
      AUTH0_SECRET: string;
      AUTH0_BASE_URL: string;
      AUTH0_ISSUER_BASE_URL: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      
      // Google Calendar
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_REDIRECT_URI: string;
      
      // Stripe
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      STRIPE_PRICE_PRO: string;
      STRIPE_PRICE_TEAM: string;
      
      // External APIs
      OPENAI_API_KEY: string;
      NEWSAPI_KEY: string;
      RESEND_API_KEY: string;
      
      // ID.me
      IDME_CLIENT_ID: string;
      IDME_CLIENT_SECRET: string;
      
      // App URLs
      APP_URL: string;
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_IDME_CLIENT_ID: string;
      
      // Cron
      CRON_TOKEN: string;
      
      // Node environment
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};