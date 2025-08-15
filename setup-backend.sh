#!/bin/bash

# KeepMyCert Vercel Backend Integration Setup
# This script prepares your frontend for Vercel-native backend services

set -e

echo "🚀 Setting up KeepMyCert for Vercel Backend Integration..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

# 1. Install core dependencies
echo "📦 Installing backend integration dependencies..."
npm install @auth/prisma-adapter @prisma/client prisma
npm install next-auth@beta
npm install @vercel/postgres @vercel/blob
npm install resend
npm install stripe @stripe/stripe-js
npm install zod bcryptjs
npm install @radix-ui/react-toast
npm install date-fns
npm install csv-parse

# Dev dependencies
npm install -D @types/bcryptjs

echo "✅ Dependencies installed"

# 2. Create directory structure
echo "📂 Creating directory structure..."
mkdir -p src/lib/auth
mkdir -p src/lib/db
mkdir -p src/lib/email
mkdir -p src/lib/storage
mkdir -p src/lib/payments
mkdir -p src/lib/services
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/certifications
mkdir -p src/app/api/uploads
mkdir -p src/app/api/webhooks
mkdir -p src/app/api/jobs
mkdir -p src/app/api/admin
mkdir -p prisma
mkdir -p src/types

echo "✅ Directory structure created"

# 3. Create environment variables template
echo "🔐 Creating environment variables template..."
cat > .env.local.example << 'EOF'
# Database (Vercel Postgres/Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=""

# Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="noreply@keepmycert.com"
EMAIL_REPLY_TO="support@keepmycert.com"

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID_PRO=""

# Vercel KV (optional for rate limiting)
KV_URL=""
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
KV_REST_API_READ_ONLY_TOKEN=""

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Feature Flags
ENABLE_AI_FEATURES="false"
ENABLE_TEAM_FEATURES="false"
EOF

echo "✅ Environment template created"

# 4. Generate NextAuth secret if not exists
if [ ! -f ".env.local" ]; then
    echo "🔑 Generating NextAuth secret..."
    SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=\"$SECRET\"" > .env.local
    echo "✅ NextAuth secret generated in .env.local"
else
    echo "ℹ️  .env.local already exists, skipping secret generation"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.local.example to .env.local and fill in your values"
echo "2. Set up your Vercel project: vercel link"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Run database migrations: npm run db:push"
echo "5. Start development: npm run dev"
EOF